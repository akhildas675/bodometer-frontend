import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // ✅ add

import type { PaginationMeta } from "@/interface/admin.interface";
import { useTableFetch } from "@/hooks/useTableFetch";
import Pagination from "@/components/controls/pagination/pagination";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import userServices from "@/services/user/user.services";
import { useAuthStore } from "@/stores/auth.store";
import { UserWorkout } from "@/interface/user.interface";

const WORKOUT_SORT_OPTIONS = [
  { label: "Name", value: "workoutName" },
  { label: "Latest", value: "createdAt" },
];

const UserWorkouts = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<string>>({
    field: "",
    order: "asc",
  });

  const { data: response, loading, refetch } =
    useTableFetch<{ data: UserWorkout[]; pagination: PaginationMeta }>(
      () =>
        userServices
          .getWorkouts(
            currentPage,
            itemsPerPage,
            searchQuery,
            sortConfig.field || undefined,
            sortConfig.order,
          )
          .then((res) => ({
            data: res.data,
            pagination: res.pagination,
          })),
      false,
    );

  useEffect(() => {
    refetch();
  }, [currentPage, searchQuery, sortConfig, refetch]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortConfig<string>) => {
    setSortConfig(sort);
    setCurrentPage(1);
  }, []);

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

        {loading ? (
          <div className="text-center text-purple-300 py-20">
            Loading workouts...
          </div>
        ) : !workouts.length ? (
          <div className="text-center text-purple-300 py-20">
            No workouts available.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-gradient-to-br from-[#140b3a] to-[#0a0624] rounded-2xl overflow-hidden shadow-xl border border-white/5 hover:border-purple-500/30 transition cursor-pointer"  // ✅ cursor-pointer
                onClick={() => navigate(`/workouts/${workout.id}`)}  // ✅ navigate on card click
              >
                <img
                  src={workout.workoutImage}
                  alt={workout.workoutName}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    {workout.workoutName}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                    {workout.workoutDescription}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // ✅ prevent double navigate
                      navigate(`/workouts/${workout.id}`);
                    }}
                    className="mt-4 w-full bg-purple-600 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
                  >
                    View Workout
                  </button>
                </div>
              </div>
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