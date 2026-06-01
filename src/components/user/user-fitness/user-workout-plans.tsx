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
} from "lucide-react";
import userServices, { WorkoutPlanResponse, GenerateWorkoutDay, AiWorkoutExercise } from "@/services/user/user.services";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";



const AI_STEPS = [
  { icon: Brain,      label: "Analysing your fitness profile…"    },
  { icon: Activity,   label: "Building your weekly structure…"     },
  { icon: Target,     label: "Selecting optimal exercises…"        },
  { icon: ListChecks, label: "Finalising sets, reps & rest times…" },
  { icon: Sparkles,   label: "Polishing your personalised plan…"   },
];

const WorkoutGeneratingModal = ({ isOpen }: { isOpen: boolean }) => {
  const [stepIdx, setStepIdx] = useState(0);

  
  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % AI_STEPS.length);
    }, 2000);
    return () => clearInterval(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const CurrentIcon = AI_STEPS[stepIdx].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* No click-outside close — generation must finish first */}
      <div className="relative bg-linear-to-br from-[#140b3a] to-[#0a0624] border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center gap-6">

        {/* Animated orbit ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
          <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <CurrentIcon className="w-7 h-7 text-purple-300 transition-all duration-500" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-white">Building Your AI Plan</h3>
          <p className="text-white/50 text-sm">Our AI is crafting a personalised week for you</p>
        </div>

        {/* Step label */}
        <div className="w-full px-2">
          <div
            key={stepIdx}
            className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-purple-200 font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {AI_STEPS[stepIdx].label}
          </div>
        </div>

        {/* Step dots */}
        <div className="flex gap-2">
          {AI_STEPS.map((_, i) => (
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
  handleSetExerciseStatus,
  navigate
}: {
  ex: AiWorkoutExercise;
  planId: string;
  dayNumber: number;
  isLocked: boolean;
  isExToggling: boolean;
  handleSetExerciseStatus: (planId: string, dayNumber: number, exerciseId: string, status: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED") => void;
  navigate: (path: string) => void;
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restRemaining, setRestRemaining] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ex.status === "ACTIVE" && !isResting) {
      const start = ex.startedAt ? new Date(ex.startedAt).getTime() : Date.now();
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 1000));
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
  }, [ex.status, ex.startedAt, isResting, planId, dayNumber, ex.exerciseId]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isCompleted = ex.status === "COMPLETED";
  const isSkipped = ex.status === "SKIPPED";
  const isActive = ex.status === "ACTIVE";

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
          <p className="text-xs text-white/50 truncate w-full">
            {ex.sets} sets {ex.durationSeconds ? `× ${ex.durationSeconds}s` : ex.reps ? `× ${ex.reps} reps` : ""}
          </p>
          
          {ex.notes && (
            <div className="mt-1.5 flex items-start gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1.5 rounded-md w-full">
              <p className="text-[10px] text-purple-200/90 leading-relaxed whitespace-normal break-words text-left">
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
      <div className="flex items-center justify-end gap-2 w-full mt-auto pt-2 border-t border-white/5">
        {isActive && !isResting && (
          <div className="flex items-center gap-3 px-3 py-1.5 bg-purple-500/20 rounded-lg border border-purple-500/30 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-mono text-sm font-bold text-purple-300 w-12 text-center">{formatTime(elapsed)}</span>
            </div>
            <button
              onClick={() => {
                setIsResting(true);
                handleSetExerciseStatus(planId, dayNumber, ex.exerciseId, "COMPLETED");
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
            onClick={() => handleSetExerciseStatus(planId, dayNumber, ex.exerciseId, "ACTIVE")}
            disabled={isExToggling}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          >
            {isExToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Start
          </button>
        )}

        {/* Skip Button */}
        {ex.status !== "COMPLETED" && !isActive && !isLocked && (
          <button
            onClick={() => handleSetExerciseStatus(planId, dayNumber, ex.exerciseId, isSkipped ? "PENDING" : "SKIPPED")}
            disabled={isExToggling}
            className="p-2 rounded-full hover:bg-white/10 transition-colors group/skip"
            title={isSkipped ? "Undo Skip" : "Skip Exercise"}
          >
            <FastForward className={`w-4 h-4 transition-colors ${isSkipped ? "text-purple-400" : "text-white/20 group-hover/skip:text-purple-300"}`} />
          </button>
        )}

        {/* Completed Toggle */}
        {!isLocked && !isActive && (
          <button
            onClick={() => handleSetExerciseStatus(planId, dayNumber, ex.exerciseId, isCompleted ? "PENDING" : "COMPLETED")}
            disabled={isExToggling}
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
    </div>
  );
};

const UserWorkoutPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<WorkoutPlanResponse[]>([]);
  const [generating, setGenerating] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"plans" | "history">("plans");
  const [togglingDay, setTogglingDay] = useState<{ planId: string; dayNumber: number } | null>(null);
  const [togglingExercise, setTogglingExercise] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);

  const toggleDayExpansion = (dayId: string) => {
    setExpandedDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  const fetchPlansFn = useCallback(async () => {
    const response = await userServices.getWorkoutPlans();
    if (response.success && response.data) {
      setPlans(response.data);
      if (response.data.length > 0) {
        setExpandedPlanId(response.data[0].workoutPlanId);
      }
    }
    return response;
  }, []);

  const { loading } = useFetch(fetchPlansFn);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const response = await userServices.generateWorkout();
      if (response.success && response.data) {
        // Refresh the full list so the new week appears correctly
        const refreshed = await userServices.getWorkoutPlans();
        if (refreshed.success && refreshed.data) {
          setPlans(refreshed.data);
          setExpandedPlanId(refreshed.data[0]?.workoutPlanId ?? null);
        } else {
          setPlans((prev) => [response.data!, ...prev]);
          setExpandedPlanId(response.data.workoutPlanId);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleDayComplete = async (planId: string, dayNumber: number, currentStatus: string) => {
    try {
      setTogglingDay({ planId, dayNumber });
      const newStatus = currentStatus === "COMPLETED" ? false : true;
      const response = await userServices.markDayCompleted(planId, dayNumber, newStatus);
      if (response.success && response.data) {
        setPlans((prev) =>
          prev.map((p) => (p.workoutPlanId === planId ? response.data! : p))
        );
      }
    } catch (error) {
      console.error("Failed to toggle day completion:", error);
    } finally {
      setTogglingDay(null);
    }
  };

  const handleSetExerciseStatus = async (planId: string, dayNumber: number, exerciseId: string, status: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED") => {
    try {
      setTogglingExercise(exerciseId);
      const response = await userServices.markExerciseStatus(planId, dayNumber, exerciseId, status);
      if (response.success && response.data) {
        setPlans((prev) =>
          prev.map((p) => (p.workoutPlanId === planId ? response.data! : p))
        );
      }
    } catch (error) {
      console.error("Failed to set exercise status:", error);
    } finally {
      setTogglingExercise(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getCompletedDaysCount = (days: GenerateWorkoutDay[]) =>
    days.filter((d) => d.status === "COMPLETED").length;

  const getAllCompletedDays = () => {
    const allDays: { date: Date; planWeek: number; day: GenerateWorkoutDay }[] = [];
    plans.forEach((plan) => {
      plan.days.forEach((day) => {
        if (day.status === "COMPLETED" && day.completedAt) {
          allDays.push({
            date: new Date(day.completedAt),
            planWeek: plan.weekNumber,
            day,
          });
        }
      });
    });
    // Sort newest first
    return allDays.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const completedHistory = getAllCompletedDays();
  const todayStr = new Date().toDateString();
  const hasCompletedWorkoutToday = completedHistory.some(h => h.date.toDateString() === todayStr);

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
    
      <WorkoutGeneratingModal isOpen={generating} />

      <div className="max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-purple-400" />
            Workout Plans
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Track your progress and generate new weekly plans.
          </p>
        </div>

        {(() => {
          if (plans.length === 0) return null;
          const latestPlan = plans[0];
          const daysUntilEnd = latestPlan?.endDate
            ? Math.max(
                0,
                Math.ceil(
                  (new Date(latestPlan.endDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )
              )
            : 0;
          const canGenerate = daysUntilEnd === 0;

          return (
            <button
              onClick={handleGenerate}
              disabled={generating || !canGenerate}
              className={`inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all shrink-0 ${
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
                  Next Plan in {daysUntilEnd} {daysUntilEnd === 1 ? "day" : "days"}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate New Plan
                </>
              )}
            </button>
          );
        })()}
      </div>

      {/* ── Tabs ── */}
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
      </div>

      {/* ── Content ── */}
      {activeTab === "plans" ? (
        <div className="space-y-4">
          {plans.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <Dumbbell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Plans Yet</h3>
              <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">
                You haven't generated any workout plans yet. Create your first tailored plan to get started.
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
                {generating ? "Generating..." : "Generate Plan"}
              </button>
            </div>
          ) : (
            plans.map((plan) => {
              const isExpanded = expandedPlanId === plan.workoutPlanId;
              const completedCount = getCompletedDaysCount(plan.days);
              const progressPct = Math.round((completedCount / plan.days.length) * 100) || 0;
              const firstPendingDayNumber = plan.days.find(d => d.status === "PENDING")?.dayNumber;

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
                          {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                          {completedCount} / {plan.days.length} Days
                        </span>
                        <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-white/30 p-2">
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Days List */}
                  {isExpanded && (
                    <div className="border-t border-white/5 bg-black/20 p-6 space-y-3">
                      {plan.days.map((day) => {
                        const isCompleted = day.status === "COMPLETED";
                        const isToggling = togglingDay?.planId === plan.workoutPlanId && togglingDay?.dayNumber === day.dayNumber;
                        const isLocked = !isCompleted && (hasCompletedWorkoutToday || day.dayNumber !== firstPendingDayNumber);

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
                                  ) : day.type === "rest" && !isLocked ? (
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
                                    const isExToggling = togglingExercise === ex.exerciseId;
                                    const isExLocked = isLocked || ex.order > firstPendingExOrder;
                                    return (
                                      <ExerciseItem
                                        key={ex.exerciseId}
                                        ex={ex}
                                        planId={plan.workoutPlanId}
                                        dayNumber={day.dayNumber}
                                        isLocked={isExLocked}
                                        isExToggling={isExToggling}
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
                        {item.date.toLocaleDateString("en-GB", {
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
