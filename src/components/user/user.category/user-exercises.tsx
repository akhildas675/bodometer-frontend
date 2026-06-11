import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTableFetch } from "@/hooks/useTableFetch";
import userServices from "@/services/user/user.services";
import { PaginationMeta } from "@/interface/common.interface";
import type { ExerciseRow } from "@/interface/exercise.interface";
import { Search, SlidersHorizontal, Dumbbell, Zap, ChevronRight } from "lucide-react";
import Pagination from "@/components/controls/pagination/pagination";
import LazyImage from "@/components/ui/lazy.image";
import { DIFFICULTY_LEVEL } from "@/constants/fitness.constant";


const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 400;

const DIFFICULTY_OPTIONS = [
  { label: "All Levels", value: "" },
  { label: "Beginner", value: DIFFICULTY_LEVEL.BEGINNER },
  { label: "Intermediate", value: DIFFICULTY_LEVEL.INTERMEDIATE },
  { label: "Advanced", value: DIFFICULTY_LEVEL.ADVANCED },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt" },
  { label: "Name (A–Z)", value: "title" },
];

const DIFFICULTY_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  beginner:     { label: "Beginner",     color: "text-emerald-400", bg: "bg-emerald-900/40 border-emerald-700/40" },
  intermediate: { label: "Intermediate", color: "text-amber-400",   bg: "bg-amber-900/40  border-amber-700/40"   },
  advanced:     { label: "Advanced",     color: "text-red-400",     bg: "bg-red-900/40    border-red-700/40"     },
};

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
const ExerciseCardSkeleton = () => (
  <div
    className="relative rounded-2xl overflow-hidden border border-purple-700/20 animate-pulse bg-[#140b3a]"
    style={{ height: "280px" }}
  >
    <div className="absolute inset-0 bg-white/5" />
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 space-y-2">
      <div className="h-4 w-1/3 rounded bg-white/10" />
      <div className="h-5 w-2/3 rounded bg-white/10" />
      <div className="h-3 w-4/5 rounded bg-white/10" />
      <div className="h-8 w-full rounded-xl bg-white/10 mt-3" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
const ExerciseCard = ({ exercise }: { exercise: ExerciseRow }) => {
  const navigate = useNavigate();
  const badge = DIFFICULTY_BADGE[exercise.difficulty] ?? DIFFICULTY_BADGE.beginner;

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-purple-700/30 hover:border-purple-500/60 transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/30"
      style={{ height: "280px" }}
      onClick={() => navigate(`/exercises/${exercise.exerciseId ?? exercise.key}`)}
    >
      {/* Background image with lazy loading */}
      {exercise.media?.image ? (
        <LazyImage
          src={exercise.media.image}
          alt={exercise.title}
          containerClassName="absolute inset-0 w-full h-full"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a0f45] to-[#0d0730]">
          <Dumbbell size={52} className="text-purple-600/40" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0624] via-[#0a0624]/60 to-transparent" />

      {/* Difficulty badge — top right */}
      <div className="absolute top-3 right-3">
        <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${badge.bg} ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {/* Compound badge — top left */}
      {exercise.isCompound && (
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-purple-800/60 border border-purple-500/40 text-purple-300">
            <Zap size={10} />
            Compound
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <h3 className="text-white font-bold text-base tracking-wide mb-1 line-clamp-1">{exercise.title}</h3>
        {exercise.description && (
          <p className="text-white/50 text-xs mb-3 line-clamp-2">{exercise.description}</p>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/exercises/${exercise.exerciseId ?? exercise.key}`);
          }}
          className="w-full flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm py-2 rounded-xl transition"
        >
          View Exercise
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const UserExercises = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close filter menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setShowFilterMenu(false);
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
      userServices.getExercises({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
        sortBy: sortField || undefined,
        sortOrder,
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
      }),
    [currentPage, debouncedSearch, sortField, sortOrder, selectedDifficulty],
  );

  const { data: response, loading, error, refetch } =
    useTableFetch<{ data: ExerciseRow[]; pagination: PaginationMeta }>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const exercises = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <div className="text-white min-h-screen">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-400 tracking-tight">
            Exercises
          </h1>
          <p className="text-white/40 text-sm mt-1">Browse your premium exercise library</p>
        </div>

        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {/* Search Bar */}
          <div className="flex items-center bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 gap-2 w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search exercises..."
              className="bg-transparent text-white text-sm placeholder-white/40 outline-none flex-1"
            />
            <Search size={16} className="text-white/60" />
          </div>

          {/* Filter / Sort */}
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => setShowFilterMenu((v) => !v)}
              className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm transition ${
                selectedDifficulty || sortField !== "createdAt"
                  ? "bg-purple-700/40 border-purple-500/60 text-white"
                  : "bg-[#1a1535] border-purple-700/40 text-white/70 hover:text-white"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filter & Sort
              {selectedDifficulty && (
                <span className="ml-1 text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full">
                  1
                </span>
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#1a1535] border border-purple-700/40 rounded-2xl overflow-hidden z-50 shadow-xl shadow-black/40 p-2 space-y-1">
                {/* Difficulty */}
                <p className="text-[10px] uppercase tracking-widest text-white/40 px-2 pb-1">Difficulty</p>
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedDifficulty(opt.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-xl transition ${
                      selectedDifficulty === opt.value
                        ? "bg-purple-700/50 text-purple-300 font-semibold"
                        : "text-white/70 hover:bg-purple-700/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}

                <div className="border-t border-purple-700/30 my-1" />

                {/* Sort */}
                <p className="text-[10px] uppercase tracking-widest text-white/40 px-2 pb-1">Sort by</p>
                {SORT_OPTIONS.map((opt) => (
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
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-xl transition flex items-center justify-between ${
                      sortField === opt.value
                        ? "bg-purple-700/50 text-purple-300 font-semibold"
                        : "text-white/70 hover:bg-purple-700/20"
                    }`}
                  >
                    {opt.label}
                    {sortField === opt.value && (
                      <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active filter chip */}
      {selectedDifficulty && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-white/50">Filters:</span>
          <button
            onClick={() => { setSelectedDifficulty(""); setCurrentPage(1); }}
            className="flex items-center gap-1 text-xs bg-purple-800/50 border border-purple-600/40 text-purple-300 px-3 py-1 rounded-full hover:bg-purple-700/50 transition"
          >
            {DIFFICULTY_BADGE[selectedDifficulty]?.label ?? selectedDifficulty}
            <span className="ml-1 text-purple-400 font-bold">×</span>
          </button>
        </div>
      )}

      {/* Grid */}
      {error ? (
        <div className="text-center text-red-400 py-20">
          Failed to load exercises. Please try again.
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <ExerciseCardSkeleton key={i} />
          ))}
        </div>
      ) : !exercises.length ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Dumbbell size={48} className="text-purple-800/50" />
          <p className="text-purple-300/60 text-lg font-semibold">No exercises found.</p>
          {(debouncedSearch || selectedDifficulty) && (
            <button
              onClick={() => { setSearchInput(""); setDebouncedSearch(""); setSelectedDifficulty(""); setCurrentPage(1); }}
              className="text-sm text-purple-400 hover:text-white transition underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {exercises.map((ex) => (
            <ExerciseCard key={ex.exerciseId ?? ex.key} exercise={ex} />
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

export default UserExercises;

