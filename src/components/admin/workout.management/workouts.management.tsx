import { useState, useCallback, useEffect } from "react";
import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";
import { Upload, Pencil, X } from "lucide-react";
import type { AddWorkoutForm, Workout } from "@/interface/admin.interface";
import type { PaginationMeta } from "@/interface/admin.interface";
import { toast } from "sonner";
import adminService from "@/services/admin/admin.services";
import { useTableFetch } from "@/hooks/useTableFetch";
import Pagination from "@/components/controls/pagination/pagination";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";

const EMPTY_FORM: AddWorkoutForm = {
  workoutName: "",
  workoutDescription: "",
  workoutImage: null,
};

const WORKOUT_SORT_OPTIONS = [
  { label: "Name", value: "workoutName" },
  { label: "Created At", value: "createdAt" },
];

const WorkoutsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState<AddWorkoutForm>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setWorkoutData((prev) => ({ ...prev, workoutImage: file }));
    if (!file) { setImagePreview(null); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditClick = (workout: Workout) => {
    setEditingId(workout.id);
    setWorkoutData({
      workoutName: workout.workoutName,
      workoutDescription: workout.workoutDescription,
      workoutImage: null,
    });
    setImagePreview(workout.workoutImage);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setWorkoutData(EMPTY_FORM);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!workoutData.workoutName || !workoutData.workoutDescription) {
      toast.error("Please fill all fields");
      return;
    }
    if (!editingId && !workoutData.workoutImage) {
      toast.error("Please select an image");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("workoutName", workoutData.workoutName);
      formData.append("workoutDescription", workoutData.workoutDescription);
      if (workoutData.workoutImage) {
        formData.append("workoutImage", workoutData.workoutImage);
      }
      if (editingId) {
        await adminService.updateWorkout(editingId, formData);
        toast.success("Workout updated successfully!");
      } else {
        const res = await adminService.addWorkouts(formData);
        if (!res.success) throw new Error();
        toast.success("Workout added successfully!");
      }
      setWorkoutData(EMPTY_FORM);
      setImagePreview(null);
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("submit error:", error);
      toast.error(editingId ? "Failed to update workout" : "Failed to add workout");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (workout: Workout) => {
    try {
      setTogglingId(workout.id);
      await adminService.toggleWorkoutStatus(workout.id);
      toast.success(workout.isActive ? "Workout blocked" : "Workout unblocked");
      refetch();
    } catch (error) {
      console.error("toggle error:", error);
      toast.error("Failed to update workout status");
    } finally {
      setTogglingId(null);
    }
  };

  const workouts = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <SidebarLayout role="admin">
      <div className="flex gap-6 max-w-7xl mx-auto">
        <div className="flex-1 bg-gradient-to-b from-[#03000D] to-[#190473] rounded-2xl p-8">
          <h1 className="text-white text-3xl font-bold mb-8">WORKOUT MANAGEMENT</h1>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Form */}
            <div className="bg-indigo-900/50 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-semibold">
                  {editingId ? "Edit Workout" : "Add New Workout"}
                </h2>
                {editingId && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-slate-400 hover:text-white transition"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-purple-200 text-sm block mb-2">Workout Name</label>
                  <input
                    type="text"
                    value={workoutData.workoutName}
                    onChange={(e) => setWorkoutData({ ...workoutData, workoutName: e.target.value })}
                    className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                    placeholder="Enter workout name"
                  />
                </div>

                <div>
                  <label className="text-purple-200 text-sm block mb-2">Description</label>
                  <textarea
                    value={workoutData.workoutDescription}
                    onChange={(e) => setWorkoutData({ ...workoutData, workoutDescription: e.target.value })}
                    className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 h-24 resize-none"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="text-purple-200 text-sm block mb-2">
                    Workout Image
                    {editingId && (
                      <span className="text-purple-400 text-xs ml-2">
                        (leave empty to keep current)
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-purple-300 cursor-pointer hover:bg-indigo-700/50 transition flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    {editingId ? "Change Image" : "Choose Image"}
                  </label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mt-3"
                    />
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? editingId ? "Updating..." : "Adding..."
                    : editingId ? "Update Workout" : "Add Workout"}
                </button>

                {editingId && (
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Right List */}
            <div className="col-span-2 bg-indigo-900/30 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Workouts List</h2>
              </div>

              {/* Search and Sort */}
              <div className="flex gap-3 mb-4">
                <SearchBar
                  value={searchQuery}
                  onSearch={handleSearch}
                  placeholder="Search workouts..."
                  disabled={fetchLoading}
                  className="flex-1"
                />
                <SortDropdown<string>
                  options={WORKOUT_SORT_OPTIONS}
                  value={sortConfig}
                  onSortChange={handleSortChange}
                  disabled={fetchLoading}
                  className="w-48"
                  placeholder="Sort by..."
                />
              </div>

              {fetchLoading ? (
                <div className="text-center text-purple-300 py-8">Loading...</div>
              ) : !workouts.length ? (
                <div className="text-center text-purple-300 py-8">
                  No workouts found. Add your first workout!
                </div>
              ) : (
                <div className="space-y-3">
                  {workouts.map((workout, index) => (
                    <div
                      key={workout.id}
                      className={`rounded-lg p-4 flex items-center gap-3 transition ${
                        editingId === workout.id
                          ? "bg-purple-600/20 border border-purple-500/50"
                          : "bg-indigo-800/40 hover:bg-indigo-800/60"
                      }`}
                    >
                      {/* Index */}
                      <span className="text-white font-semibold text-lg flex-shrink-0">
                        {(currentPage - 1) * itemsPerPage + index + 1}.
                      </span>

                      {/* Image */}
                      <img
                        src={workout.workoutImage}
                        alt={workout.workoutName}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">
                          {workout.workoutName}
                        </h3>
                        <p className="text-purple-300 text-sm truncate">
                          {workout.workoutDescription}
                        </p>
                        {/* Active badge */}
                        <span className={`text-xs font-medium ${workout.isActive ? "text-green-400" : "text-red-400"}`}>
                          {workout.isActive ? "● Active" : "● Blocked"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Edit / Cancel */}
                        <button
                          onClick={() =>
                            editingId === workout.id
                              ? handleCancelEdit()
                              : handleEditClick(workout)
                          }
                          className={`p-2 rounded-lg transition ${
                            editingId === workout.id
                              ? "bg-white/10 text-white"
                              : "bg-indigo-700/50 hover:bg-indigo-600 text-purple-300 hover:text-white"
                          }`}
                          title={editingId === workout.id ? "Cancel" : "Edit"}
                        >
                          {editingId === workout.id ? <X size={16} /> : <Pencil size={16} />}
                        </button>

                        {/* Block / Unblock */}
                        <button
                          onClick={() => handleToggleStatus(workout)}
                          disabled={togglingId === workout.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
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
                    </div>
                  ))}
                </div>
              )}

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
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default WorkoutsManagement;