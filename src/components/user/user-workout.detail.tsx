import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Dumbbell, User } from "lucide-react";
import { toast } from "sonner";
import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";
import { useAuthStore } from "@/stores/auth.store";
import userServices from "@/services/user/user.services";
import type { WorkoutDetailResponse } from "@/interface/user.interface";
import { useFetch } from "@/hooks/useFetch";

const UserWorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data, loading } = useFetch<WorkoutDetailResponse>(
    () => userServices.getWorkoutDetail(id!).then((res) => res.data),
  );

  if (loading) {
    return (
      <SidebarLayout role={user?.role || "user"}>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </SidebarLayout>
    );
  }

  if (!data) {
    toast.error("Failed to load workout details");
    navigate("/workouts");
    return null;
  }

  const { workout, relatedTrainers, relatedWorkouts } = data;

  return (
    <SidebarLayout role={user?.role || "user"}>
      <div className="text-white max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/workouts")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Workouts
        </button>

        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-72">
          <img
            src={workout.workoutImage}
            alt={workout.workoutName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {workout.workoutName}
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Dumbbell size={20} className="text-purple-400" />
            About this Workout
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {workout.workoutDescription}
          </p>
        </div>

        {/* Related Trainers */}
        {relatedTrainers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-purple-400" />
              Trainers with this Specialization
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {relatedTrainers.map((trainer) => (
                <div
                  key={trainer._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/40 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={trainer.profilePic || "https://via.placeholder.com/48"}
                      alt={trainer.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{trainer.name}</h3>
                      <p className="text-purple-300 text-xs">
                        {trainer.experienceInYears} years experience
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{trainer.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Workouts */}
        {relatedWorkouts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recommended Workouts</h2>
            <div className="grid grid-cols-3 gap-4">
              {relatedWorkouts.map((w) => (
                <div
                  key={w.id}
                  onClick={() => navigate(`/workouts/${w.id}`)}
                  className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition cursor-pointer"
                >
                  <img
                    src={w.workoutImage}
                    alt={w.workoutName}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{w.workoutName}</h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                      {w.workoutDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default UserWorkoutDetail;