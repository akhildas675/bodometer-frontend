import { trainerService } from "@/features/trainer/services/trainer.service";
import { categoryService } from "@/features/admin/categories/services/category.service";
import { CategoryListItem } from "@/features/admin/categories/types/category.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaginationMeta } from "@/types/common.types";
import { TrainerListItem } from "@/features/trainer/types/trainer.types";
import { Search, SlidersHorizontal, Star, X, RotateCcw } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import LazyImage from "@/components/ui/LazyImage";

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const TRAINER_SORT_OPTIONS = [
  { label: "Latest", value: "createdAt" },
  { label: "Rating", value: "rating" },
  { label: "Experience", value: "experienceInYears" },
  { label: "Name", value: "name" },
];

const EXPERIENCE_FILTERS = [
  { label: "All Experience", value: "" },
  { label: "0-2 years", value: "0-2" },
  { label: "2-5 years", value: "2-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10-50" },
];

const RATING_FILTERS = [
  { label: "All Ratings", value: "" },
  { label: "4.5+ Stars", value: "4.5" },
  { label: "4.0+ Stars", value: "4" },
  { label: "3.0+ Stars", value: "3" },
];

const trainerPath = (profileId: string) => `/trainers/${profileId}`;

const TrainerCardSkeleton = () => (
  <div
    className="relative rounded-2xl overflow-hidden border border-purple-700/20 animate-pulse bg-[#140b3a]"
    style={{ height: "390px" }}
  >
    <div className="absolute inset-0 bg-white/5" />
    <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 space-y-3">
      <div className="h-5 w-2/3 mx-auto rounded bg-white/10" />
      <div className="h-3 w-1/3 mx-auto rounded bg-white/10" />
      <div className="h-3 w-3/4 mx-auto rounded bg-white/10" />
      <div className="h-9 w-full rounded-xl bg-white/10 mt-2" />
    </div>
  </div>
);

const TrainerCard = ({ trainer }: { trainer: TrainerListItem }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-purple-700/30 hover:border-purple-500/60 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
      style={{ height: "390px" }}
      onClick={() => navigate(trainerPath(trainer.profileId))}
    >
      <LazyImage
        src={trainer.profilePic ?? ""}
        alt={trainer.name}
        containerClassName="absolute inset-0 w-full h-full"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0624] via-[#0a0624]/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 text-center">
        <h3 className="text-white font-extrabold text-xl tracking-widest uppercase mb-1 truncate">
          {trainer.name}
        </h3>

        <div className="flex items-center justify-center gap-3 text-sm mb-2 flex-wrap">
          <span className="text-purple-300 font-medium text-xs sm:text-sm">
            {trainer.experienceInYears}+{" "}
            <span className="text-white/60 font-normal">Experience</span>
          </span>

          <span className="flex items-center gap-1 text-amber-400 font-semibold text-xs bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {trainer.rating && trainer.rating > 0 ? trainer.rating.toFixed(1) : "New"}
            {trainer.totalReviews && trainer.totalReviews > 0 ? (
              <span className="text-white/40 text-[11px]">({trainer.totalReviews})</span>
            ) : null}
          </span>
        </div>

        {trainer.specializations && trainer.specializations.length > 0 && (
          <p className="text-white/50 text-xs mb-4 truncate">
            {trainer.specializations
              .slice(0, 4)
              .map((s) => s.name)
              .join(", ")}
            {trainer.specializations.length > 4 && "..."}
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(trainerPath(trainer.profileId));
          }}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-2.5 rounded-xl transition"
        >
          Visit
        </button>
      </div>
    </div>
  );
};

const parseExperienceFilter = (filter: string): { minExperience?: number; maxExperience?: number } => {
  if (!filter) return {};
  const [min, max] = filter.split("-").map(Number);
  return { minExperience: min, maxExperience: max };
};

const UserTrainers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL query parameters
  const initialSearch = searchParams.get("search") || "";
  const initialSpecialization = searchParams.get("specializationId") || searchParams.get("specialization") || "";
  const initialExperience = searchParams.get("experience") || "";
  const initialRating = searchParams.get("minRating") || "";
  const initialSortField = searchParams.get("sortBy") || "createdAt";
  const initialSortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [specializationFilter, setSpecializationFilter] = useState(initialSpecialization);
  const [experienceFilter, setExperienceFilter] = useState(initialExperience);
  const [ratingFilter, setRatingFilter] = useState(initialRating);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Categories list for specialization filter
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Data fetching state
  const [trainers, setTrainers] = useState<TrainerListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  // Load actual categories from backend
  useEffect(() => {
    let isMounted = true;
    setLoadingCategories(true);
    categoryService
      .getCategories({ page: 1, limit: 100 })
      .then((res) => {
        if (isMounted && res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories for trainer filter", err);
      })
      .finally(() => {
        if (isMounted) setLoadingCategories(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search handler
  const handleSearchInput = useCallback((value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Update URL search parameters to stay consistent with filter state
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (specializationFilter) params.set("specializationId", specializationFilter);
    if (experienceFilter) params.set("experience", experienceFilter);
    if (ratingFilter) params.set("minRating", ratingFilter);
    if (sortField && sortField !== "createdAt") params.set("sortBy", sortField);
    if (sortOrder && sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (currentPage > 1) params.set("page", String(currentPage));

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    specializationFilter,
    experienceFilter,
    ratingFilter,
    sortField,
    sortOrder,
    currentPage,
    setSearchParams,
  ]);

  // Fetch trainers based on all active filters
  const fetchTrainers = useCallback(async () => {
    const thisRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const expParams = parseExperienceFilter(experienceFilter);
      const res = await trainerService.getTrainers<TrainerListItem>({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch.trim() || undefined,
        specializationId: specializationFilter || undefined,
        sortBy: sortField || undefined,
        sortOrder: sortOrder,
        minExperience: expParams.minExperience,
        maxExperience: expParams.maxExperience,
        minRating: ratingFilter ? Number(ratingFilter) : undefined,
      });

      // Avoid race conditions if a newer request was dispatched
      if (thisRequestId === requestIdRef.current) {
        setTrainers(res.data || []);
        setPagination(res.pagination);
      }
    } catch (err: unknown) {
      if (thisRequestId === requestIdRef.current) {
        console.error("Error fetching trainers:", err);
        setError("Failed to load trainers. Please try again.");
      }
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    currentPage,
    debouncedSearch,
    specializationFilter,
    experienceFilter,
    ratingFilter,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  // Clear all filters handler
  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setSpecializationFilter("");
    setExperienceFilter("");
    setRatingFilter("");
    setSortField("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = Boolean(
    searchInput ||
      debouncedSearch ||
      specializationFilter ||
      experienceFilter ||
      ratingFilter ||
      sortField !== "createdAt" ||
      sortOrder !== "desc"
  );

  return (
    <div className="text-white min-h-screen">
      {/* Header Row */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-extrabold text-purple-400 tracking-tight">
            Trainers
          </h1>

          {/* Quick Clear Button in Header if filters active */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 px-3 py-1.5 rounded-full transition"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar — debounced auto-search */}
          <div className="flex items-center bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 gap-2 flex-1 min-w-[200px] sm:max-w-xs focus-within:border-purple-500 transition">
            <Search size={18} className="text-white/60 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search by trainer name..."
              className="bg-transparent text-white text-sm placeholder-white/40 outline-none flex-1 w-full"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => handleSearchInput("")}
                className="text-white/40 hover:text-white transition"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Specialization Filter */}
          <select
            value={specializationFilter}
            onChange={(e) => {
              setSpecializationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition outline-none cursor-pointer focus:border-purple-500"
          >
            <option value="" className="bg-[#1a1535]">
              {loadingCategories ? "Loading Specializations..." : "All Specializations"}
            </option>
            {categories.map((cat) => (
              <option
                key={cat.categoryId || cat._id}
                value={cat.categoryId || cat._id}
                className="bg-[#1a1535]"
              >
                {cat.name}
              </option>
            ))}
          </select>

          {/* Experience Filter */}
          <select
            value={experienceFilter}
            onChange={(e) => {
              setExperienceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition outline-none cursor-pointer focus:border-purple-500"
          >
            {EXPERIENCE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value} className="bg-[#1a1535]">
                {filter.label}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition outline-none cursor-pointer focus:border-purple-500"
          >
            {RATING_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value} className="bg-[#1a1535]">
                {filter.label}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <div className="relative ml-auto" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu((v) => !v)}
              className="flex items-center gap-2 bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition focus:border-purple-500"
            >
              <SlidersHorizontal size={15} />
              <span>Sort: {TRAINER_SORT_OPTIONS.find((o) => o.value === sortField)?.label || "Latest"}</span>
              <span className="text-xs text-purple-400 font-bold">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1535] border border-purple-700/40 rounded-xl overflow-hidden z-50 shadow-xl py-1">
                {TRAINER_SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (sortField === opt.value) {
                        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
                      } else {
                        setSortField(opt.value);
                        // Name defaults to asc, others to desc
                        setSortOrder(opt.value === "name" ? "asc" : "desc");
                      }
                      setCurrentPage(1);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center justify-between hover:bg-purple-700/20 ${
                      sortField === opt.value ? "text-purple-400 font-semibold bg-purple-900/20" : "text-white/70"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortField === opt.value && (
                      <span className="text-xs font-bold text-purple-400">
                        {sortOrder === "asc" ? "Asc (↑)" : "Desc (↓)"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {error ? (
        <div className="text-center py-20 bg-[#140b3a]/40 border border-purple-900/30 rounded-2xl p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchTrainers()}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <TrainerCardSkeleton key={i} />
          ))}
        </div>
      ) : !trainers.length ? (
        <div className="text-center py-20 bg-[#140b3a]/30 border border-purple-900/20 rounded-2xl p-8">
          <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Trainers Found</h3>
          <p className="text-purple-300/70 text-sm max-w-md mx-auto mb-6">
            We couldn't find any trainers matching your current filters. Try adjusting your search term, experience, rating, or specialization.
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-purple-900/20"
            >
              <RotateCcw size={15} />
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <TrainerCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={Number(pagination.currentPage)}
            totalPages={Number(pagination.totalPages)}
            totalItems={Number(pagination.totalItems)}
            itemsPerPage={Number(pagination.itemsPerPage)}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={() => {}}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default UserTrainers;