import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";
import { Pencil, Plus } from "lucide-react";
import type { PaginationMeta } from "@/interface/admin.interface";
import { toast } from "sonner";
import adminService from "@/services/admin/admin.services";
import { useTableFetch } from "@/hooks/useTableFetch";
import Pagination from "@/components/controls/pagination/pagination";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import { Workout } from "@/interface/workout.interface";

const WORKOUT_SORT_OPTIONS = [
    { label: "Name", value: "workoutName" },
    { label: "Created At", value: "createdAt" },
];

const AdminWorkoutList = () => {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig<string>>({
    field: "",
    order: "asc",
  });

  const { data: response, loading: fetchLoading, refetch } =
    useTableFetch<{ data: Workout[]; pagination: PaginationMeta }>(
      () =>
        adminService
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
  }, [currentPage, itemsPerPage, searchQuery, sortConfig, refetch]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortConfig<string>) => {
    setSortConfig(sort);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  const handleToggleStatus = async (workout: Workout) => {
    try {
      setTogglingId(workout.id);
      await adminService.toggleWorkoutStatus(workout.id);
      toast.success(workout.isActive ? "Workout blocked" : "Workout unblocked");
      refetch();
    } catch {
      toast.error("Failed to update workout status");
    } finally {
      setTogglingId(null);
    }
  };

  const workouts = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <SidebarLayout role="admin">
      <div className="text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Workout Categories</h1>
          <button
            onClick={() => navigate("/admin/workouts/create")}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            <Plus size={18} />
            Add Workout
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-3 mb-6">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search workouts..."
            disabled={fetchLoading}
            className="flex-1 max-w-md"
          />
          <SortDropdown<string>
            options={WORKOUT_SORT_OPTIONS}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={fetchLoading}
            className="w-56"
            placeholder="Sort by..."
          />
        </div>

        {/* Table */}
        {fetchLoading ? (
          <div className="text-center text-purple-300 py-20">Loading...</div>
        ) : !workouts.length ? (
          <div className="text-center text-purple-300 py-20">
            No workouts found. Add your first workout category!
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left">
                <tr>
                  <th className="px-4 py-3 text-slate-400 font-medium">#</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Workout</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Description</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Status</th>
                  <th className="px-4 py-3 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr
                    key={workout.id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3 text-slate-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={workout.workoutImage}
                          alt={workout.workoutName}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <span className="text-white font-medium">
                          {workout.workoutName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs">
                      <p className="truncate">{workout.workoutDescription}</p>
                    </td>
  
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          workout.isActive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {workout.isActive ? "● Active" : "● Blocked"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/workouts/edit/${workout.id}`)}
                          className="p-2 bg-indigo-700/50 hover:bg-indigo-600 text-purple-300 hover:text-white rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(workout)}
                          disabled={togglingId === workout.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                            workout.isActive
                              ? "bg-red-600/80 hover:bg-red-600 text-white"
                              : "bg-green-600/80 hover:bg-green-600 text-white"
                          }`}
                        >
                          {togglingId === workout.id
                            ? "..."
                            : workout.isActive ? "Block" : "Unblock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="mt-6">
            <Pagination
              currentPage={Number(pagination.currentPage)}
              totalPages={Number(pagination.totalPages)}
              totalItems={Number(pagination.totalItems)}
              itemsPerPage={Number(pagination.itemsPerPage)}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              disabled={fetchLoading}
            />
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};



export default AdminWorkoutList;
