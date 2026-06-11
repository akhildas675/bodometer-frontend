import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  Package,
  CheckCircle2,
  Zap,
  Globe,
} from "lucide-react";
import userServices from "@/services/user/user.services";
import { useFetch } from "@/hooks/useFetch";
import type { ExerciseRow } from "@/interface/exercise.interface";
import LazyImage from "@/components/ui/lazy.image";

//  Helpers

const DIFFICULTY_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  beginner:     { label: "Beginner",     color: "text-emerald-400", bg: "bg-emerald-900/40 border-emerald-700/40" },
  intermediate: { label: "Intermediate", color: "text-amber-400",   bg: "bg-amber-900/40  border-amber-700/40"   },
  advanced:     { label: "Advanced",     color: "text-red-400",     bg: "bg-red-900/40    border-red-700/40"     },
};

const ENV_LABELS: Record<string, string> = {
  home:               "Home",
  home_with_equipment:"Home + Equipment",
  gym:                "Gym",
  outdoor:            "Outdoor",
};

//  Skeleton
const DetailSkeleton = () => (
  <div className="animate-pulse max-w-4xl mx-auto">
    <div className="w-full rounded-2xl bg-[#140b3a] mb-8" style={{ height: "400px" }} />
    <div className="h-8 w-1/3 bg-white/10 rounded-lg mb-3" />
    <div className="flex gap-2 mb-6">
      <div className="h-6 w-24 bg-white/10 rounded-full" />
      <div className="h-6 w-20 bg-white/10 rounded-full" />
    </div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => <div key={i} className="h-4 w-full bg-white/10 rounded" />)}
    </div>
  </div>
);

//  Section card helper
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-indigo-900/30 border border-purple-800/30 rounded-2xl p-6 backdrop-blur">
    <h2 className="text-purple-300 text-xs font-semibold uppercase tracking-widest mb-4">{title}</h2>
    {children}
  </div>
);

//  Page
const UserExerciseDetail = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const { data: exercise, loading, error } = useFetch<ExerciseRow>(
    useCallback(() => userServices.getExerciseById(exerciseId!).then((res) => res.data), [exerciseId]),
    !!exerciseId
  );

  const badge = exercise ? (DIFFICULTY_BADGE[exercise.difficulty] ?? DIFFICULTY_BADGE.beginner) : null;

  return (
    <div className="text-white min-h-screen">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-400 hover:text-white mb-6 transition text-sm"
      >
        <ArrowLeft size={18} />
        Back to Exercises
      </button>

      {/* Loading */}
      {loading && <DetailSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-24 text-red-400">
          Failed to load exercise. Please try again.
        </div>
      )}

      {/* Content */}
      {!loading && !error && exercise && (
        <div className="max-w-5xl mx-auto pb-16">
          
          {/*  Page Header */}
          <div className="mb-12 pt-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-5 drop-shadow-sm">
              {exercise.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {badge && (
                <span className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${badge.bg} ${badge.color}`}>
                  {badge.label}
                </span>
              )}
              {exercise.isCompound && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-400/30 text-purple-200">
                  <Zap size={12} className="text-purple-400" />
                  Compound
                </span>
              )}
            </div>
          </div>

          {/*  Media Showcase (Top Center)*/}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
            
            {/* 9:16 Vertical Video */}
            {exercise.media?.videoUrl && (
              <div className="relative w-full md:w-auto h-auto md:h-[480px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-[#0a0624] shrink-0">
                <video
                  src={exercise.media.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-wider uppercase text-white/90">Video</span>
                </div>
              </div>
            )}

            {/* 4:3 Reference Image */}
            {exercise.media?.image && (
              <div className="relative w-full md:w-auto h-auto md:h-[480px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-[#0a0624] shrink-0 group">
                <LazyImage
                  src={exercise.media.image}
                  alt={exercise.title}
                  containerClassName="absolute inset-0 w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
                  <span className="text-xs font-bold tracking-wider uppercase text-white/90">Reference</span>
                </div>
              </div>
            )}
            
          </div>

          {/*  Text Content Layout─ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: About & Instructions */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              {exercise.description && (
                <SectionCard title="About">
                  <p className="text-white/80 text-[15px] leading-relaxed">{exercise.description}</p>
                </SectionCard>
              )}

              {/* Instructions */}
              {exercise.instructions?.length > 0 && (
                <SectionCard title="Instructions">
                  <ol className="space-y-5">
                    {exercise.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-4 text-[15px] text-white/80">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="leading-relaxed pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </SectionCard>
              )}
            </div>

            {/* RIGHT: Details Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Workout Environments */}
              {exercise.workoutEnvironments?.length > 0 && (
                <SectionCard title="Environment">
                  <div className="flex flex-wrap gap-2">
                    {exercise.workoutEnvironments.map((env) => (
                      <span key={env} className="flex items-center gap-1.5 text-[13px] font-medium text-white/80 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                        <Globe size={13} className="text-blue-400" />
                        {ENV_LABELS[env] ?? env}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Target Muscles */}
              {(exercise.targetMuscles?.length ? exercise.targetMuscles : exercise.targetMuscleIds)?.length > 0 && (
                <SectionCard title="Target Muscles">
                  <div className="flex flex-wrap gap-2">
                    {(exercise.targetMuscles?.length ? exercise.targetMuscles : exercise.targetMuscleIds).map((muscle, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 text-[13px] font-medium text-purple-200 bg-purple-900/30 border border-purple-700/40 rounded-xl px-3 py-1.5 capitalize">
                        <Target size={13} className="text-purple-400" />
                        {muscle.length > 24 ? "Muscle" : muscle}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Equipment */}
              {(exercise.equipment?.length ? exercise.equipment : exercise.equipmentIds)?.length > 0 ? (
                <SectionCard title="Equipment">
                  <div className="flex flex-wrap gap-2">
                    {(exercise.equipment?.length ? exercise.equipment : exercise.equipmentIds).map((equip, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 text-[13px] font-medium text-indigo-200 bg-indigo-900/30 border border-indigo-700/40 rounded-xl px-3 py-1.5 capitalize">
                        <Package size={13} className="text-indigo-400" />
                        {equip.length > 24 ? "Equipment" : equip}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              ) : (
                <SectionCard title="Equipment">
                  <div className="flex items-center gap-2 text-[14px] font-medium text-emerald-400">
                    <CheckCircle2 size={16} />
                    No equipment needed
                  </div>
                </SectionCard>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default UserExerciseDetail;
