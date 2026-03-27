import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Dumbbell, User, Target, Wrench, Sparkles, Play } from "lucide-react";
import { toast } from "sonner";
import userServices from "@/services/user/user.services";
import type { WorkoutDetailResponse } from "@/interface/user.interface";
import { useFetch } from "@/hooks/useFetch";

const UserWorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  const { data, loading } = useFetch<WorkoutDetailResponse>(
    () => userServices.getWorkoutDetail(id!).then((res) => res.data)
  );

  console.log("data.... from workout details",data)

  if (loading) {
    return (
     
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading...</div>
        </div>
     
    );
  }

  if (!data) {
    toast.error("Failed to load workout details");
    navigate("/workouts");
    return null;
  }

  const { workout, relatedTrainers, relatedWorkouts } = data;

  const coverPhoto    = workout.coverPhoto    || "";
  const workoutImage  = workout.workoutImage  || "";
  const introVideo    = workout.introVideo    || "";
  const targetMuscles = workout.targetMuscles ?? [];
  const equipment     = workout.equipment     ?? [];
  const benefits      = workout.benefits      ?? [];

  return (
   
      <div className="text-white max-w-5xl mx-auto pb-12">

        {/* ── BACK ── */}
        <button
          onClick={() => navigate("/workouts")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Workouts
        </button>

        {/* ── HERO ── */}
        <div className="relative rounded-2xl overflow-hidden h-80 w-full mb-6">
          {coverPhoto ? (
            <img src={coverPhoto} alt={workout.workoutName} className="w-full h-full object-cover" />
          ) : workoutImage ? (
            <img src={workoutImage} alt={workout.workoutName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-indigo-900/60 flex items-center justify-center">
              <Dumbbell size={64} className="text-purple-400 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end gap-5">
            {workoutImage && (
              <img
                src={workoutImage}
                alt={workout.workoutName}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white/20 shrink-0"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight">{workout.workoutName}</h1>
              <span
                className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium border ${
                  workout.isActive
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {workout.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT: description + video + trainers */}
          <div className="col-span-2 space-y-6">

            <div className="bg-indigo-900/40 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-200">
                <Dumbbell size={18} className="text-purple-400" />
                About this Workout
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm">{workout.workoutDescription}</p>
            </div>

            {introVideo && (
              <div className="bg-indigo-900/40 border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-200">
                  <Play size={18} className="text-purple-400" />
                  Intro Video
                </h2>
                <video src={introVideo} controls className="w-full rounded-xl max-h-64 bg-black" />
              </div>
            )}

            {relatedTrainers?.length > 0 && (
              <div className="bg-indigo-900/40 border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-200">
                  <User size={18} className="text-purple-400" />
                  Trainers with this Specialization
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {relatedTrainers.map((trainer) => (
                    <div
                      key={trainer._id}
                      className="flex items-center gap-3 bg-indigo-800/40 border border-white/5 rounded-xl p-3 hover:border-purple-500/30 transition cursor-pointer"
                    >
                      <img
                        src={trainer.profilePic || "https://via.placeholder.com/48"}
                        alt={trainer.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-white truncate">{trainer.name}</p>
                        <p className="text-purple-300 text-xs">{trainer.experienceInYears} yrs exp</p>
                        <p className="text-slate-400 text-xs truncate mt-0.5">{trainer.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: tags — always rendered, shows "None" fallback if empty */}
          <div className="space-y-5">

            <div className="bg-indigo-900/40 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-purple-200">
                <Target size={15} className="text-purple-400" />
                Target Muscles
              </h3>
              {targetMuscles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {targetMuscles.map((muscle) => (
                    <span key={muscle} className="text-xs px-2.5 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300">
                      {muscle}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs">None specified</p>
              )}
            </div>

            <div className="bg-indigo-900/40 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-purple-200">
                <Wrench size={15} className="text-purple-400" />
                Equipment Needed
              </h3>
              {equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {equipment.map((item) => (
                    <span key={item} className="text-xs px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs">No equipment needed</p>
              )}
            </div>

            <div className="bg-indigo-900/40 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-purple-200">
                <Sparkles size={15} className="text-purple-400" />
                Benefits
              </h3>
              {benefits.length > 0 ? (
                <ul className="space-y-2">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-xs">No benefits listed</p>
              )}
            </div>
          </div>
        </div>

        {/* ── RELATED WORKOUTS ── */}
        {relatedWorkouts?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Recommended Workouts</h2>
            <div className="grid grid-cols-3 gap-4">
              {relatedWorkouts.map((w) => (
                <div
                  key={w.id}
                  onClick={() => navigate(`/workouts/${w.id}`)}
                  className="bg-indigo-900/40 rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition cursor-pointer group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={w.workoutImage}
                      alt={w.workoutName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate text-white">{w.workoutName}</h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{w.workoutDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
   
  );
};

export default UserWorkoutDetail;