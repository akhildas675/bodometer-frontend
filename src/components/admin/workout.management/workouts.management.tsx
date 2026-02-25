import { useState } from "react";
import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";
import { Upload } from "lucide-react";
import type { AddWorkoutForm, Workout } from "@/interface/admin.interface";
import { toast } from "sonner";
import adminService from "@/services/admin/admin.services";
import { useFetch } from "@/hooks/useFetch";

const WorkoutsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState<AddWorkoutForm>({
    workoutName: "",
    workoutDescription: "",
    workoutImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { 
    data: workouts, 
    loading: fetchLoading, 
    refetch 
  } = useFetch<Workout[]>(
    () => adminService.getWorkouts().then(res => res.data)
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setWorkoutData((prev) => ({
      ...prev,
      workoutImage: file,
    }));

    if (!file) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!workoutData.workoutName || !workoutData.workoutDescription) {
      toast.error("Please fill all fields");
      return;
    }

    if (!workoutData.workoutImage) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("workoutName", workoutData.workoutName);
      formData.append("workoutDescription", workoutData.workoutDescription);
      formData.append("workoutImage", workoutData.workoutImage);

      const response = await adminService.addWorkouts(formData);

      if (response.success) {
        toast.success("Workout added successfully!");
        setWorkoutData({
          workoutName: "",
          workoutDescription: "",
          workoutImage: null,
        });
        setImagePreview(null);
        refetch(); 
      }
    } catch (error) {
      console.error("Error adding workout:", error);
      toast.error("Failed to add workout");
    } finally {
      setLoading(false);
    }
  };

  // const toggleActive = async (id: number) => {
  //   try {
  //     const response = await adminService.toggleWorkoutStatus(id);
  //     if (response.success) {
  //       refetch(); 
  //       toast.success("Workout status updated");
  //     }
  //   } catch (error) {
  //     console.error("Error toggling workout status:", error);
  //     toast.error("Failed to update workout status");
  //   }
  // };

  // const handleDelete = async (id: number) => {
  //   if (!window.confirm("Are you sure you want to delete this workout?")) {
  //     return;
  //   }

  //   try {
  //     const response = await adminService.deleteWorkout(id);
  //     if (response.success) {
  //       refetch();
  //       toast.success("Workout deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting workout:", error);
  //     toast.error("Failed to delete workout");
  //   }
  // };

  // Show loading state
  if (fetchLoading) {
    return (
      <SidebarLayout role="admin">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading workouts...</div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout role="admin">
      <div className="flex gap-6 max-w-7xl mx-auto">
        <div className="flex-1 bg-gradient-to-b from-[#03000D] to-[#190473] rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-white text-3xl font-bold">
              WORKOUT MANAGEMENT
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Form Section */}
            <div className="bg-indigo-900/50 rounded-xl p-6 backdrop-blur">
              <h2 className="text-white text-xl font-semibold mb-6">
                Add New Workout
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-purple-200 text-sm block mb-2">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    value={workoutData.workoutName}
                    onChange={(e) =>
                      setWorkoutData({
                        ...workoutData,
                        workoutName: e.target.value,
                      })
                    }
                    className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                    placeholder="Enter workout name"
                  />
                </div>

                <div>
                  <label className="text-purple-200 text-sm block mb-2">
                    Description
                  </label>
                  <textarea
                    value={workoutData.workoutDescription}
                    onChange={(e) =>
                      setWorkoutData({
                        ...workoutData,
                        workoutDescription: e.target.value,
                      })
                    }
                    className="w-full bg-indigo-800/50 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 h-24 resize-none"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="text-purple-200 text-sm block mb-2">
                    Workout Image
                  </label>
                  <div className="relative">
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
                      Choose Image
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add Workout"}
                </button>
              </div>
            </div>

            {/* Right Table Section */}
            <div className="col-span-2 bg-indigo-900/30 rounded-xl p-6 backdrop-blur">
              <h2 className="text-white text-xl font-semibold mb-6">
                Workouts List
              </h2>

              {!workouts || workouts.length === 0 ? (
                <div className="text-center text-purple-300 py-8">
                  No workouts found. Add your first workout!
                </div>
              ) : (
                <div className="space-y-3">
                  {workouts.map((workout, index) => (
                    <div
                      key={workout.id}
                      className="bg-indigo-800/40 rounded-lg p-4 flex items-center justify-between hover:bg-indigo-800/60 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-white font-semibold text-lg">
                          {index + 1}.
                        </span>
                        <img
                          src={workout.workoutImage}
                          alt={workout.workoutName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">
                            {workout.workoutName}
                          </h3>
                          <p className="text-purple-300 text-sm">
                            {workout.workoutDescription}
                          </p>
                        </div>
                      </div>

                      {/* <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleActive(workout.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            workout.active
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          {workout.active ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleDelete(workout.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Delete
                        </button>
                      </div> */}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination
              <div className="flex justify-center gap-2 mt-6">
                <button className="w-10 h-10 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  1
                </button>
                <button className="w-10 h-10 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700 transition">
                  2
                </button>
                <button className="w-10 h-10 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700 transition">
                  3
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default WorkoutsManagement;