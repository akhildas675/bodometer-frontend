import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { PaginationMeta } from "@/interface/admin.interface";
import { useTableFetch } from "@/hooks/useTableFetch";
import Pagination from "@/components/controls/pagination/pagination";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import userServices from "@/services/user/user.services";
import { UserWorkout } from "@/interface/user.interface";
import LazyImage from "@/components/ui/lazy.image";

const WORKOUT_SORT_OPTIONS = [
  { label: "Name", value: "workoutName" },
  { label: "Latest", value: "createdAt" },
];

const ITEMS_PER_PAGE = 6;
const SEARCH_DEBOUNCE_MS = 400;

const workoutPath = (id: string) => `/workouts/${id}`;


const WorkoutCardSkeleton = () => (
  <div className="bg-gradient-to-br from-[#140b3a] to-[#0a0624] rounded-2xl overflow-hidden shadow-xl border border-white/5 animate-pulse">

    <div className="h-40 w-full bg-white/10" />
    <div className="p-4 space-y-3">

      <div className="h-5 w-3/4 rounded bg-white/10" />
  
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-3 w-2/3 rounded bg-white/10" />
      <div className="h-9 w-full rounded-lg bg-white/10 mt-4" />
    </div>
  </div>
);


const WorkoutCard = ({ workout }: { workout: UserWorkout }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#140b3a] to-[#0a0624] rounded-2xl overflow-hidden shadow-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
      <LazyImage
        src={workout.workoutImage}
        alt={workout.workoutName}
        containerClassName="h-40 w-full"
        className="h-40 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{workout.workoutName}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-2">
          {workout.workoutDescription}
        </p>
        <button
          onClick={() => navigate(workoutPath(workout.id))}
          className="mt-4 w-full bg-purple-600 py-2 rounded-lg text-sm hover:bg-purple-700 transition cursor-pointer"
        >
          View Workout
        </button>
      </div>
    </div>
  );
};


const UserWorkouts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
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


  const handleSortChange = useCallback((sort: SortConfig<string>) => {
    setSortField(sort.field);
    setSortOrder(sort.order);
    setCurrentPage(1);
  }, []);

  const sortConfig: SortConfig<string> = { field: sortField, order: sortOrder };

  const fetchFn = useCallback(
    () =>
      userServices
        .getWorkouts(currentPage, ITEMS_PER_PAGE, debouncedSearch, sortField || undefined, sortOrder)
        .then((res) => ({ data: res.data, pagination: res.pagination })),
    [currentPage, debouncedSearch, sortField, sortOrder],
  );

  const { data: response, loading, error, refetch } =
    useTableFetch<{ data: UserWorkout[]; pagination: PaginationMeta }>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const workouts = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Workouts</h1>
      </div>

      <div className="flex gap-3 mb-6">
        <SearchBar
          value={searchQuery}
          onSearch={handleSearch}
          placeholder="Search workouts..."
          disabled={loading}
          className="flex-1 max-w-md"
        />
        <SortDropdown<string>
          options={WORKOUT_SORT_OPTIONS}
          value={sortConfig}
          onSortChange={handleSortChange}
          disabled={loading}
          className="w-48"
          placeholder="Sort by..."
        />
      </div>

      {error ? (
        <div className="text-center text-red-400 py-20">
          Failed to load workouts. Please try again.
        </div>
      ) : loading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <WorkoutCardSkeleton key={i} />
          ))}
        </div>
      ) : !workouts.length ? (
        <div className="text-center text-purple-300 py-20">
          No workouts available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}

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

export default UserWorkouts;