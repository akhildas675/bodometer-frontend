import { trainerService } from "@/modules/trainer/service/trainer.service";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTableFetch } from "@/hooks/useTableFetch";
import { PaginationMeta } from "@/interface/common.interface";
import { TrainerListItem } from "@/interface/trainer.interface";
import { Search, SlidersHorizontal } from "lucide-react";
import Pagination from "@/features/controls/pagination/pagination";
import LazyImage from "@/ui.components/ui/lazy.image";

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const TRAINER_SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Experience", value: "experienceInYears" },
  { label: "Latest", value: "createdAt" },
];

const trainerPath = (profileId: string) => `/trainers/${profileId}`;

const TrainerCardSkeleton = () => (
  <div
    className="relative rounded-2xl overflow-hidden border border-purple-700/20 animate-pulse bg-[#140b3a]"
    style={{ height: "380px" }}
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
      style={{ height: "380px" }}
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
        <h3 className="text-white font-extrabold text-xl tracking-widest uppercase mb-1">
          {trainer.name}
        </h3>

        <div className="flex items-center justify-center gap-4 text-sm mb-2">
          <span className="text-purple-300 font-medium">
            {trainer.experienceInYears}+{" "}
            <span className="text-white/60 font-normal">Experience</span>
          </span>
        </div>

        {trainer.specializations.length > 0 && (
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


const UserTrainers = () => {
  const [currentPage, setCurrentPage] = useState(ITEMS_PER_PAGE);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSearchInput = useCallback((value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), SEARCH_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);


  const fetchFn = useCallback(
    () =>
      trainerService.getTrainers<TrainerListItem>({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
        sortBy: sortField || undefined,
        sortOrder: sortOrder,
      })
        .then((res) => ({ data: res.data, pagination: res.pagination })),
    [currentPage, debouncedSearch, sortField, sortOrder],
  );

  const { data: response, loading, error, refetch } =
    useTableFetch<{ data: TrainerListItem[]; pagination: PaginationMeta }>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const trainers = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <div className="text-white min-h-screen">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h1 className="text-3xl font-extrabold text-purple-400 tracking-tight">
          Trainers
        </h1>

        <div className="flex items-center gap-3 ml-auto">
          {/* Search Bar — debounced auto-search */}
          <div className="flex items-center bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 gap-2 w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-white text-sm placeholder-white/40 outline-none flex-1"
            />
            <Search size={18} className="text-white/60" />
          </div>

          {/* Sort / Filter */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu((v) => !v)}
              className="flex items-center gap-2 bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 text-sm text-white/70 hover:text-white transition"
            >
              <SlidersHorizontal size={15} />
              Sort / Filter
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[#1a1535] border border-purple-700/40 rounded-xl overflow-hidden z-50 shadow-xl">
                {TRAINER_SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (sortField === opt.value) {
                        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
                      } else {
                        setSortField(opt.value);
                        setSortOrder("asc");
                      }
                      setCurrentPage(1);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-purple-700/20 ${sortField === opt.value ? "text-purple-400 font-semibold" : "text-white/70"
                      }`}
                  >
                    {opt.label}
                    {sortField === opt.value && (
                      <span className="ml-1 text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
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
        <div className="text-center text-red-400 py-20">
          Failed to load trainers. Please try again.
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <TrainerCardSkeleton key={i} />
          ))}
        </div>
      ) : !trainers.length ? (
        <div className="text-center text-purple-300 py-20">No trainers found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <TrainerCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-10">
          <Pagination
            currentPage={Number(pagination.currentPage)}
            totalPages={Number(pagination.totalPages)}
            totalItems={Number(pagination.totalItems)}
            itemsPerPage={Number(pagination.itemsPerPage)}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={() => { }}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default UserTrainers;