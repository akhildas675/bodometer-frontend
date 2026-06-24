import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import {
  Sparkles,
  Loader2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Dumbbell,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  Moon,
  Zap,
  FastForward,
  Brain,
  Activity,
  Target,
  ListChecks,
  Lock,
  Crown,
  ArrowRight,
} from "lucide-react";

import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { AiWorkoutExercise, GenerateWorkoutDay, GetWorkoutPlansResponse, WorkoutPlanResponse, WorkoutExerciseStatus, CompletedHistoryItem } from "@/interface/workout.interface";
import userServices from "@/services/user/user.services";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";



const PREMIUM_STEPS = [
  { icon: Brain,      label: "Analyzing your fitness profile…"    },
  { icon: Activity,   label: "Building your weekly structure…"     },
  { icon: Target,     label: "Selecting optimal exercises…"        },
  { icon: ListChecks, label: "Finalizing sets, reps & rest times…" },
  { icon: Sparkles,   label: "Polishing your personalized plan…"   },
];

const FREE_STEPS = [
  { icon: Activity,   label: "Selecting standard exercises…"       },
  { icon: Target,     label: "Building a basic weekly routine…"    },
  { icon: ListChecks, label: "Organizing your daily workout…"      },
  { icon: Dumbbell,   label: "Setting up your fitness plan…"       },
  { icon: Sparkles,   label: "Finalizing your free plan…"          },
];

const WorkoutGeneratingModal = ({ isOpen, isPremium }: { isOpen: boolean; isPremium: boolean }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = isPremium ? PREMIUM_STEPS : FREE_STEPS;

  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(id);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  const CurrentIcon = steps[stepIdx].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-linear-to-br from-[#140b3a] to-[#0a0624] border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center gap-6">

        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
          <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <CurrentIcon className="w-7 h-7 text-purple-300 transition-all duration-500" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-white">
            {isPremium ? "Building Your AI Plan" : "Building Your Free Plan"}
          </h3>
          <p className="text-white/50 text-sm">
            {isPremium ? "Our AI is crafting a personalized week for you" : "We are preparing a basic workout plan for you"}
          </p>
        </div>

        <div className="w-full px-2">
          <div
            key={stepIdx}
            className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-purple-200 font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {steps[stepIdx].label}
          </div>
        </div>

        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === stepIdx ? "w-6 bg-purple-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        <p className="text-white/30 text-xs">This usually takes 10–20 seconds</p>
      </div>
    </div>
  );
};


const ExerciseItem = ({
  ex,
  planId,
  dayNumber,
  isLocked,
  isExToggling,
  isGlobalResting,
  setGlobalResting,
  handleSetExerciseStatus,
  navigate,
  planType
}: {
  ex: AiWorkoutExercise;
  planId: string;
  dayNumber: number;
  isLocked: boolean;
  isExToggling: boolean;
  isGlobalResting: boolean;
  setGlobalResting: (resting: boolean) => void;
  handleSetExerciseStatus: (planId: string, dayNumber: number, instanceId: string, status: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED") => void;
  navigate: (path: string) => void;
  planType: "FREE" | "PREMIUM";
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restRemaining, setRestRemaining] = useState(ex.restSeconds || 30);

  const estimatedTime = ex.estimatedDurationSeconds || (ex.durationSeconds || (ex.reps ? ex.reps * 4 : 60));

  useEffect(() => {
    setGlobalResting(isResting);
    return () => {
      if (isResting) setGlobalResting(false);
    };
  }, [isResting, setGlobalResting]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ex.status === "ACTIVE" && !isResting) {
      const start = ex.startedAt ? new Date(ex.startedAt).getTime() : Date.now();
      interval = setInterval(() => {
        const diffSeconds = Math.floor((Date.now() - start) / 1000);
        setElapsed(diffSeconds);
        
        if (diffSeconds >= estimatedTime) {
          clearInterval(interval);
          setIsResting(true);
          handleSetExerciseStatus(planId, dayNumber, ex.instanceId, "COMPLETED");
        }
      }, 1000);
    } else if (isResting) {
      interval = setInterval(() => {
        setRestRemaining((prev: number) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ex.status, ex.startedAt, isResting, planId, dayNumber, ex.instanceId, estimatedTime, handleSetExerciseStatus]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isCompleted = ex.status === "COMPLETED";
  const isSkipped = ex.status === "SKIPPED";
  const isActive = ex.status === "ACTIVE";
  const activeRemaining = Math.max(estimatedTime - elapsed, 0);

  return (
    <div
      className={`rounded-lg p-3 flex flex-col gap-3 border transition-colors relative overflow-hidden group h-full ${
        isCompleted
          ? "bg-emerald-500/5 border-emerald-500/30"
          : isSkipped
          ? "bg-white/5 border-white/20 opacity-60"
          : isActive
          ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          : "bg-white/5 border-white/5"
      }`}
    >
      {/* Top Section: Info */}
      <div className="flex items-start gap-3 w-full">
        {/* Image */}
        <div className="w-12 h-12 bg-white/10 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
          {ex.exerciseImage ? (
            <img src={ex.exerciseImage} alt={ex.exerciseTitle || "Exercise"} className="w-full h-full object-cover" />
          ) : (
            <Dumbbell className="w-5 h-5 text-white/20" />
          )}
        </div>

        {/* Text (Clickable) */}
        <button
          onClick={() => navigate(USER_UI_ROUTES.USER_EXERCISE_DETAIL.replace(":exerciseId", ex.exerciseId))}
          className={`flex flex-col flex-1 min-w-0 text-left hover:opacity-80 transition-opacity ${isSkipped ? "grayscale" : ""}`}
        >
          <p className={`text-sm font-bold text-white truncate w-full ${isSkipped ? "line-through" : ""}`}>
            {ex.exerciseTitle || "Exercise"}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-white/50 truncate">
              {ex.sets} sets {ex.durationSeconds ? `× ${ex.durationSeconds}s` : ex.reps ? `× ${ex.reps} reps` : ""}
            </p>
            {estimatedTime > 0 && !isCompleted && !isActive && (
              <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded-sm border border-white/10">
                ~{formatTime(estimatedTime)}
              </span>
            )}
          </div>
          
          {ex.targetMuscles && ex.targetMuscles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {ex.targetMuscles.map((muscle, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {muscle}
                </span>
              ))}
            </div>
          )}
          
          {ex.notes && (
            <div className="mt-1.5 flex items-start gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1.5 rounded-md w-full">
              <p className="text-[10px] text-purple-200/90 leading-relaxed whitespace-normal wrap-break-word text-left">
                {ex.notes}
              </p>
            </div>
          )}

          {isCompleted && ex.timeTakenSeconds !== undefined && (
            <p className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Completed in {formatTime(ex.timeTakenSeconds)}
            </p>
          )}
        </button>
      </div>

      {/* Bottom Section: Actions */}
      {planType !== "FREE" ? (
      <div className="flex items-center justify-end gap-2 w-full mt-auto pt-2 border-t border-white/5">
        {isActive && !isResting && (
          <div className="flex items-center gap-3 px-3 py-1.5 bg-purple-500/20 rounded-lg border border-purple-500/30 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-mono text-sm font-bold text-purple-300 w-12 text-center">{formatTime(activeRemaining)}</span>
            </div>
            <button
              onClick={() => {
                setIsResting(true);
                handleSetExerciseStatus(planId, dayNumber, ex.instanceId, "COMPLETED");
              }}
              disabled={isExToggling}
              className="text-xs font-bold bg-white text-purple-900 px-4 py-1 rounded-md hover:bg-white/90 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {isCompleted && isResting && (
          <div className="flex items-center gap-3 px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Rest</span>
              <span className="font-mono text-sm font-bold text-white w-12 text-center">{formatTime(restRemaining)}</span>
            </div>
            <button
              onClick={() => setIsResting(false)}
              className="text-xs font-bold text-white/50 hover:text-white transition-colors underline px-2"
            >
              Skip
            </button>
          </div>
        )}

        {!isActive && !isCompleted && !isLocked && !isSkipped && (
          <button
            onClick={() => handleSetExerciseStatus(planId, dayNumber, ex.instanceId, "ACTIVE")}
            disabled={isExToggling || isGlobalResting}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-xs transition-colors ${
              isGlobalResting
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            }`}
          >
            {isExToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Start
          </button>
        )}

        {/* Skip Button */}
        {ex.status !== "COMPLETED" && !isActive && !isLocked && (
          <button
            onClick={() => handleSetExerciseStatus(planId, dayNumber, ex.instanceId, isSkipped ? "PENDING" : "SKIPPED")}
            disabled={isExToggling || isGlobalResting}
            className="p-2 rounded-full hover:bg-white/10 transition-colors group/skip"
            title={isSkipped ? "Undo Skip" : "Skip Exercise"}
          >
            <FastForward className={`w-4 h-4 transition-colors ${isSkipped ? "text-purple-400" : "text-white/20 group-hover/skip:text-purple-300"}`} />
          </button>
        )}

        {/* Completed Toggle */}
        {!isLocked && !isActive && (
          <button
            onClick={() => {
              if (!isCompleted) {
                setIsResting(true);
              } else {
                setIsResting(false);
              }
              handleSetExerciseStatus(planId, dayNumber, ex.instanceId, isCompleted ? "PENDING" : "COMPLETED");
            }}
            disabled={isExToggling || isGlobalResting}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title={isCompleted ? "Mark Pending" : "Mark Completed"}
          >
            {isExToggling ? (
              <Loader2 className="w-5 h-5 animate-spin text-white/50" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5 text-white/20 hover:text-white/80 transition-colors" />
            )}
          </button>
        )}
      </div>
      ) : (
        /* Fix 6: Free plan — show "Track with Premium" lock prompt instead of nothing */
        <div className="mt-auto pt-2 border-t border-white/5">
          <button
            onClick={() => navigate("/subscriptions")}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold text-yellow-400/70 hover:text-yellow-300 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/15 hover:border-yellow-500/30 transition-all group"
          >
            <Lock className="w-3 h-3" />
            Track progress with Premium
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}
    </div>
  );
};

const UserWorkoutPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isPremium, setIsPremium] = useState(user?.hasActiveSubscription ?? false);
  const [plans, setPlans] = useState<WorkoutPlanResponse[]>([]);
  const [completedHistory, setCompletedHistory] = useState<CompletedHistoryItem[]>([]);

  useEffect(() => {
    if (user?.hasActiveSubscription !== undefined) {
      setIsPremium(user.hasActiveSubscription);
    }
  }, [user?.hasActiveSubscription]);

  const [generationStatus, setGenerationStatus] = useState<GetWorkoutPlansResponse["generationStatus"]>({
    canGenerate: false,
    isInactive: false,
    pendingDaysCount: 0,
    hasCompletedWorkoutToday: false,
    firstPendingDayNumber: -1
  });
  const [generating, setGenerating] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"plans" | "history">("plans");
  const [togglingDay, setTogglingDay] = useState<{ planId: string; dayNumber: number } | null>(null);
  const [togglingExercise, setTogglingExercise] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [globalResting, setGlobalResting] = useState(false);

  const toggleDayExpansion = (dayId: string) => {
    setExpandedDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  const fetchPlansFn = useCallback(async () => {
    const response = await userServices.getWorkoutPlans();
    if (response.success && response.data) {
      const currentIsPremium = response.data.isPremium !== undefined ? response.data.isPremium : (user?.hasActiveSubscription ?? false);
      setIsPremium(currentIsPremium);
      if (user && user.hasActiveSubscription !== currentIsPremium) {
        useAuthStore.getState().updateUser({ hasActiveSubscription: currentIsPremium });
      }

      const targetPlanType = currentIsPremium ? "PREMIUM" : "FREE";
      const filteredPlans = response.data.plans.filter(p => p.planType === targetPlanType);

      setPlans(filteredPlans);
      setGenerationStatus(response.data.generationStatus);
      if (response.data.completedHistory) {
        setCompletedHistory(response.data.completedHistory);
      }
      
      if (filteredPlans.length > 0) {
        if (!expandedPlanId || !filteredPlans.some(p => p.workoutPlanId === expandedPlanId)) {
          setExpandedPlanId(filteredPlans[0].workoutPlanId);
        }
      } else {
        setExpandedPlanId(null);
      }
    }
    return response;
  }, [expandedPlanId, user]);

  const { loading } = useFetch(fetchPlansFn);

  const handleGenerate = async () => {
    if (!user?.onboardingComplete) {
      toast.error("Please complete your fitness profile to generate a workout plan.");
      navigate(USER_UI_ROUTES.ONBOARDING_INTRO);
      return;
    }

    try {
      setGenerating(true);
      const response = await userServices.generateWorkout();
      if (response.success && response.data) {
        await fetchPlansFn();
      } else if (response.message) {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err?.response?.data?.message || "Failed to generate workout plan";
      toast.error(errorMessage);
      
      if (errorMessage.toLowerCase().includes("complete onboarding")) {
        navigate(USER_UI_ROUTES.ONBOARDING_INTRO);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleDayComplete = async (planId: string, dayNumber: number, currentStatus: string) => {
    try {
      setTogglingDay({ planId, dayNumber });
      const newStatus = currentStatus === "COMPLETED" ? false : true;
      const response = await userServices.markDayCompleted({ planId, dayNumber, completed: newStatus });
      if (response.success) {
        await fetchPlansFn();
      }
    } catch (error) {
      console.error("Failed to toggle day completion:", error);
    } finally {
      setTogglingDay(null);
    }
  };

  const handleSetExerciseStatus = async (planId: string, dayNumber: number, exerciseId: string, status: WorkoutExerciseStatus) => {
    try {
      setTogglingExercise(exerciseId);
      const response = await userServices.markExerciseStatus({ planId, dayNumber, exerciseId, status });
      if (response.success) {
        await fetchPlansFn();
      }
    } catch (error) {
      console.error("Failed to set exercise status:", error);
    } finally {
      setTogglingExercise(null);
    }
  };

  const getCompletedDaysCount = (days: GenerateWorkoutDay[]) =>
    days.filter((d) => d.status === "COMPLETED").length;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/50">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          <p className="text-sm font-medium tracking-wide">Loading workout history…</p>
        </div>
      </div>
    );
  }

  return (
    <>
    
      <WorkoutGeneratingModal isOpen={generating} isPremium={isPremium} />

      <div className="max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6 space-y-8">
      {/*  Header  */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-black uppercase tracking-wide bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <CalendarDays className="w-8 h-8 text-purple-400" />
              Workout Plans
            </h1>
            {/* Clear plan tier badge so there is no confusion */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                isPremium
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-blue-500/15 text-blue-400 border-blue-500/30"
              }`}
            >
              {isPremium ? "✦ Premium" : "Free Plan"}
            </span>
          </div>
          <p className="text-white/50 text-sm mt-1">
            {isPremium
              ? "AI-personalized weekly plans based on your fitness profile. Track progress and generate each week."
              : "Basic weekly workout plans. Upgrade to Premium for personalized AI coaching and progress tracking."}
          </p>
        </div>

        {(() => {
          if (plans.length === 0) return null;
          
          // Pure backend-driven logic
          const { canGenerate, pendingDaysCount } = generationStatus;

          return (
            <div className="flex flex-col items-end gap-2 shrink-0">
              {isPremium && (
                <button
                  onClick={() => navigate(USER_UI_ROUTES.ONBOARDING_INTRO)}
                  className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 font-medium transition-colors"
                >
                  Update Fitness Profile
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={generating || !canGenerate}
                className={`inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all ${
                  generating || !canGenerate
                    ? "bg-purple-950/40 border border-purple-500/30 text-purple-300 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.02]"
                }`}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : !canGenerate ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Complete {pendingDaysCount} more {pendingDaysCount === 1 ? "day" : "days"}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {isPremium ? "Generate AI Plan" : "Generate Free Plan"}
                  </>
                )}
              </button>
            </div>
          );
        })()}
      </div>

      {/*  Tabs  */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "plans"
              ? "bg-white/10 text-white"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Weekly Plans
        </button>
        {isPremium && (
          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
            }`}
          >
            <History className="w-4 h-4" />
            Completed History
            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
              {completedHistory.length}
            </span>
          </button>
        )}
      </div>

      {/*  Content  */}
      {activeTab === "plans" ? (
        <div className="space-y-4">
          {plans.length === 0 ? (
            /* Fix 4: Separate empty state messaging for Free vs Premium */
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <Dumbbell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">
                {isPremium ? "No Plans Yet" : "Start Your Free Plan"}
              </h3>
              <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">
                {isPremium
                  ? "Generate your first AI-personalized weekly plan based on your fitness profile."
                  : "Generate a free beginner-friendly workout plan to get started. Upgrade anytime for AI-personalized coaching."}
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold transition-colors"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {generating ? "Generating..." : isPremium ? "Generate AI Plan" : "Generate Free Plan"}
              </button>
              {!isPremium && (
                <button
                  onClick={() => navigate("/subscriptions")}
                  className="mt-4 flex items-center gap-2 mx-auto text-sm text-yellow-400 hover:text-yellow-300 font-semibold underline underline-offset-4 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Unlock Premium for a personalized plan
                </button>
              )}
            </div>
          ) : (
            plans.map((plan) => {
              const isExpanded = expandedPlanId === plan.workoutPlanId;
              const displayedDays = plan.days.slice(0, 7);
              const completedCount = getCompletedDaysCount(displayedDays);
              const progressPct = Math.round((completedCount / displayedDays.length) * 100) || 0;

              return (
                <div
                  key={plan.workoutPlanId}
                  className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-2xl border border-white/10 overflow-hidden shadow-xl"
                >
                  {/* Plan Header */}
                  <div
                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.workoutPlanId)}
                    className="p-6 cursor-pointer hover:bg-white/2 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-500/20 border border-purple-500/30 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg font-black text-purple-300">
                          W{plan.weekNumber}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                            Week {plan.weekNumber} Plan
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              plan.planType === "FREE"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            }`}
                          >
                            {plan.planType} WORKOUT PLAN
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              plan.status === "ACTIVE"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/10 text-white/50 border border-white/10"
                            }`}
                          >
                            {plan.status}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm mt-0.5 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {plan.formattedStartDate || plan.startDate} — {plan.formattedEndDate || plan.endDate || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {plan.planType !== "FREE" && (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                            {completedCount} / {displayedDays.length} Days
                          </span>
                          <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="text-white/30 p-2">
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Days List */}
                  {isExpanded && (
                    <div className="border-t border-white/5 bg-black/20 p-6 space-y-3">
                      {displayedDays.map((day) => {
                        const isCompleted = day.status === "COMPLETED";
                        const isToggling = togglingDay?.planId === plan.workoutPlanId && togglingDay?.dayNumber === day.dayNumber;
                        const isLocked = plan.planType !== "FREE" && !isCompleted && (generationStatus.hasCompletedWorkoutToday || day.dayNumber !== generationStatus.firstPendingDayNumber);

                        return (
                          <div
                            key={day.dayNumber}
                            className={`flex flex-col p-4 rounded-xl border transition-all gap-4 ${
                              isCompleted
                                ? "bg-emerald-500/5 border-emerald-500/20"
                                : isLocked
                                ? "bg-white/5 border-white/5 opacity-50"
                                : "bg-white/5 border-white/5"
                            }`}
                          >
                            {/* Day Header - Clickable for toggle */}
                            <div 
                              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${day.type === "workout" && day.exercises.length > 0 ? "cursor-pointer group" : ""}`}
                              onClick={() => {
                                if (day.type === "workout" && day.exercises.length > 0) {
                                  toggleDayExpansion(`${plan.workoutPlanId}-${day.dayNumber}`);
                                }
                              }}
                            >
                              <div className="flex items-start sm:items-center gap-4">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    isCompleted
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-white/10 text-white/40"
                                  }`}
                                >
                                  {day.type === "rest" ? (
                                    <Moon className="w-5 h-5" />
                                  ) : (
                                    <Dumbbell className="w-5 h-5" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-base">
                                    Day {day.dayNumber}
                                  </h4>
                                  <p className="text-sm text-white/60 mt-0.5">
                                    {day.type === "workout"
                                      ? `Focus: ${day.focus} • ${day.exercises.length} exercises`
                                      : "Rest & Recovery"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-end shrink-0 gap-4">
                                {isLocked && (
                                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    <Clock className="w-3 h-3" />
                                    Available Tomorrow
                                  </div>
                                )}
                                  {isCompleted ? (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      <CheckCircle2 className="w-4 h-4" />
                                      Completed
                                    </div>
                                  ) : day.type === "rest" && !isLocked && plan.planType !== "FREE" ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleDayComplete(plan.workoutPlanId, day.dayNumber, day.status);
                                      }}
                                      disabled={isToggling}
                                      className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                                    >
                                      {isToggling ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Circle className="w-4 h-4" />
                                      )}
                                      Finish Rest Day
                                    </button>
                                  ) : null}

                                  {day.type === "workout" && day.exercises.length > 0 && (
                                    <div className="text-white/30 group-hover:text-white/50 transition-colors ml-2">
                                      {expandedDays.includes(`${plan.workoutPlanId}-${day.dayNumber}`) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </div>
                                  )}
                              </div>
                            </div>
                            
                            {/* Exercise List */}
                            {day.type === "workout" && day.exercises.length > 0 && expandedDays.includes(`${plan.workoutPlanId}-${day.dayNumber}`) && (
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(() => {
                                  const firstPendingExOrder = day.exercises.find(e => e.status !== "COMPLETED" && e.status !== "SKIPPED")?.order ?? 9999;
                                  return day.exercises.map((ex) => {
                                    const isExToggling = togglingExercise === ex.instanceId;
                                    const isExLocked = isLocked || ex.order > firstPendingExOrder;
                                    return (
                                      <ExerciseItem
                                        key={ex.instanceId}
                                        ex={ex}
                                        planId={plan.workoutPlanId}
                                        dayNumber={day.dayNumber}
                                        planType={plan.planType}
                                        isLocked={isExLocked}
                                        isExToggling={isExToggling}
                                        isGlobalResting={globalResting}
                                        setGlobalResting={setGlobalResting}
                                        handleSetExerciseStatus={handleSetExerciseStatus}
                                        navigate={navigate}
                                      />
                                    );
                                  });
                                })()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
          {/* Fix 5: Show upgrade CTA below the free plan list for non-premium users */}
          {plans.length > 0 && !isPremium && (
            <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/3 to-transparent pointer-events-none" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Unlock Your Full Potential</h4>
                  <p className="text-white/50 text-xs mt-0.5 max-w-xs">
                    Upgrade to Premium for AI-personalized plans, progress tracking, analytics, and more.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/subscriptions")}
                className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.25)]"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Premium
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {completedHistory.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
              <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No History Yet</h3>
              <p className="text-white/50 text-sm max-w-sm mx-auto">
                Mark days as completed in your weekly plans to build up your workout history.
              </p>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-xs uppercase tracking-wider text-white/40">
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Plan Week</th>
                    <th className="p-4 font-bold">Day & Focus</th>
                    <th className="p-4 font-bold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {completedHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/2 transition-colors">
                      <td className="p-4 whitespace-nowrap text-sm text-white/80">
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full">
                          Week {item.planWeek}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">Day {item.day.dayNumber}</div>
                        <div className="text-xs text-white/50">{item.day.type === "workout" ? item.day.focus : "Rest"}</div>
                      </td>
                      <td className="p-4 text-right">
                        {item.day.type === "workout" ? (
                          <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-md">
                            {item.day.exercises.length} exercises
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-400/60 bg-emerald-500/5 px-2 py-1 rounded-md">
                            Recovery
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      </div>{/* end max-w-7xl */}
    </>
  );
};

export default UserWorkoutPlans;
