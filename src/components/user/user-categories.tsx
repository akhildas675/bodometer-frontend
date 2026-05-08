import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTableFetch } from "@/hooks/useTableFetch";
import userServices from "@/services/user/user.services";
import type { PaginationMeta } from "@/interface/admin.interface";
import type { CategoryListItem } from "@/interface/user.interface";
import { Search, SlidersHorizontal, Dumbbell } from "lucide-react";
import Pagination from "@/components/controls/pagination/pagination";
import LazyImage from "@/components/ui/lazy.image";

const ITEMS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 400;

const CATEGORY_SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Latest", value: "createdAt" },
];

/** Helper — resolve the image url from either shape the backend may return */
const resolveImage = (cat: CategoryListItem): string =>
  cat.media?.image?.url ?? cat.image ?? "";

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
const CategoryCardSkeleton = () => (
  <div
    className="relative rounded-2xl overflow-hidden border border-purple-700/20 animate-pulse bg-[#140b3a]"
    style={{ height: "300px" }}
  >
    <div className="absolute inset-0 bg-white/5" />
    <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 space-y-3">
      <div className="h-5 w-2/3 mx-auto rounded bg-white/10" />
      <div className="h-3 w-3/4 mx-auto rounded bg-white/10" />
      <div className="h-9 w-full rounded-xl bg-white/10 mt-2" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
const CategoryCard = ({ category }: { category: CategoryListItem }) => {
  const navigate = useNavigate();
  const imgSrc = resolveImage(category);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-purple-700/30 hover:border-purple-500/60 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
      style={{ height: "300px" }}
      onClick={() => navigate(`/categories/${category.categoryId ?? category._id}`)}
    >
      {/* Background image or fallback */}
      {imgSrc ? (
        <LazyImage
          src={imgSrc}
          alt={category.name}
          containerClassName="absolute inset-0 w-full h-full"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a0f45]">
          <Dumbbell size={56} className="text-purple-600/40" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0624] via-[#0a0624]/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 text-center">
        <h3 className="text-white font-extrabold text-xl tracking-widest uppercase mb-1">
          {category.name}
        </h3>

        {category.description && (
          <p className="text-white/50 text-xs mb-4 line-clamp-2">
            {category.description}
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/categories/${category.categoryId ?? category._id}`);
          }}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-2.5 rounded-xl transition"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const UserCategories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close sort menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
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

  // Fetch
  const fetchFn = useCallback(
    () =>
      userServices
        .getCategories(currentPage, ITEMS_PER_PAGE, debouncedSearch, sortField || undefined, sortOrder)
        .then((res) => ({ data: res.data, pagination: res.pagination })),
    [currentPage, debouncedSearch, sortField, sortOrder],
  );

  const { data: response, loading, error, refetch } =
    useTableFetch<{ data: CategoryListItem[]; pagination: PaginationMeta }>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const categories = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <div className="text-white min-h-screen">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h1 className="text-3xl font-extrabold text-purple-400 tracking-tight">
          Categories
        </h1>

        <div className="flex items-center gap-3 ml-auto">
          {/* Search Bar */}
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
                {CATEGORY_SORT_OPTIONS.map((opt) => (
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
                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-purple-700/20 ${
                      sortField === opt.value ? "text-purple-400 font-semibold" : "text-white/70"
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
          Failed to load categories. Please try again.
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : !categories.length ? (
        <div className="text-center text-purple-300 py-20">No categories found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat._id ?? cat.categoryId} category={cat} />
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
            onItemsPerPageChange={() => {}}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default UserCategories;
