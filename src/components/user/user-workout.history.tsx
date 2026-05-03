import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { ApiResponse } from "@/interface/api-response.interface";

import { WORKOUT_HISTORY_PAGE_KEYS } from "@/constants/schema-key.constant";
import { useOnboardingStore } from "@/stores/user-onboarding.store";



/** Single-select radio card */
const OptionCard = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-3 rounded-xl border transition-all text-sm font-medium ${
      active
        ? "border-purple-500 bg-purple-500/20 text-white"
        : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
    }`}
  >
    {label}
  </button>
);

/** Multi-select chip card */
const MultiCard = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-3 rounded-xl border transition-all text-sm font-medium flex items-center justify-between ${
      active
        ? "border-purple-500 bg-purple-500/20 text-white"
        : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
    }`}
  >
    <span>{label}</span>
    {active && (
      <span className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">✓</span>
    )}
  </button>
);

/** Yes / No boolean toggle */
const BooleanToggle = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex bg-white/5 rounded-xl p-1 w-fit border border-white/10">
    {(["Yes", "No"] as const).map((label) => {
      const isActive = label === "Yes" ? value === true : value === false;
      return (
        <button
          key={label}
          onClick={() => onChange(label === "Yes")}
          className={`px-8 py-2 rounded-lg text-sm font-medium transition ${
            isActive ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);



const UserWorkoutHistory = () => {
  const navigate = useNavigate();


  const storeHistory = useOnboardingStore((state) => state.workoutHistory);

  const setExperienceDuration  = useOnboardingStore((s) => s.setExperienceDuration);
  const setStrengthLevel       = useOnboardingStore((s) => s.setStrengthLevel);
  const setTrainedWithCoach    = useOnboardingStore((s) => s.setTrainedWithCoach);
  const setTrainingTypes       = useOnboardingStore((s) => s.setTrainingTypes);
  const setConsistencyLevel    = useOnboardingStore((s) => s.setConsistencyLevel);
  const setWeeklyTrainingDays  = useOnboardingStore((s) => s.setWeeklyTrainingDays);
  const setAvgSessionDuration  = useOnboardingStore((s) => s.setAvgSessionDuration);
  const setGoalIntensity       = useOnboardingStore((s) => s.setGoalIntensity);
  const markWorkoutHistoryDone = useOnboardingStore((s) => s.markWorkoutHistoryDone);


  const [experienceDuration, setLocalExperienceDuration] = useState<string>(storeHistory.experienceDuration);
  const [strengthLevel,      setLocalStrengthLevel]      = useState<string>(storeHistory.strengthLevel);
  const [trainedWithCoach,   setLocalTrainedWithCoach]   = useState<boolean>(storeHistory.trainedWithCoach);
  const [trainingTypes,      setLocalTrainingTypes]      = useState<string[]>(storeHistory.trainingTypes);
  const [consistencyLevel,   setLocalConsistencyLevel]   = useState<string>(storeHistory.consistencyLevel);
  const [weeklyTrainingDays, setLocalWeeklyTrainingDays] = useState<string>(storeHistory.weeklyTrainingDays);
  const [avgSessionDuration, setLocalAvgSessionDuration] = useState<string>(storeHistory.avgSessionDuration);
  const [goalIntensity,      setLocalGoalIntensity]      = useState<string>(storeHistory.goalIntensity);





  const q = (key: string) => questions.find((item) => item.key === key);


  const toggleMulti = (value: string) => {
    setLocalTrainingTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const canGoNext =
    !!experienceDuration &&
    !!strengthLevel &&
    trainingTypes.length > 0 &&
    !!consistencyLevel &&
    !!weeklyTrainingDays &&
    !!avgSessionDuration &&
    !!goalIntensity;

  const handleNext = () => {
    if (!canGoNext) return;

    // Persist everything to Zustand
    setExperienceDuration(experienceDuration);
    setStrengthLevel(strengthLevel);
    setTrainedWithCoach(trainedWithCoach);
    setTrainingTypes(trainingTypes);
    setConsistencyLevel(consistencyLevel);
    setWeeklyTrainingDays(weeklyTrainingDays);
    setAvgSessionDuration(avgSessionDuration);
    setGoalIntensity(goalIntensity);
    markWorkoutHistoryDone();

    navigate("/health-details");
  };


  /* ── Render ── */
  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center justify-center p-8">
      {/* TOP BAR */}
      <div className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <img
          src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/Bodometer+Logo+corrected+1.png"
          alt="Bodometer"
          className="h-10 object-contain"
        />
      </div>

      <div className="max-w-6xl w-full bg-linear-to-b from-[#03000D] to-[#190473] rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-wide">
            WORKOUT <span className="text-purple-400">HISTORY</span>
          </h1>
          <p className="text-white/50 mb-8 text-sm">
            Tell us about your training background so we can personalise your plan.
          </p>

          {/* ── QUESTIONS GRID ── */}
          <div className="grid grid-cols-2 gap-6 mb-12">

            {/* LEFT COLUMN */}
            <div className="space-y-6">

              {/* Q1 — experience_duration (single_select) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("experience_duration")?.question ?? "How long have you been training?"}
                </label>
                <div className="space-y-2">
                  {q("experience_duration")?.options?.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      active={experienceDuration === opt.value}
                      onClick={() => setLocalExperienceDuration(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Q3 — trained_with_coach (boolean) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("trained_with_coach")?.question ?? "Have you trained with a coach before?"}
                </label>
                <BooleanToggle value={trainedWithCoach} onChange={setLocalTrainedWithCoach} />
              </div>

              {/* Q5 — consistency_level (single_select) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("consistency_level")?.question ?? "How consistent have you been with training?"}
                </label>
                <div className="space-y-2">
                  {q("consistency_level")?.options?.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      active={consistencyLevel === opt.value}
                      onClick={() => setLocalConsistencyLevel(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Q7 — avg_session_duration (single_select) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("avg_session_duration")?.question ?? "How long is your average workout session?"}
                </label>
                <div className="space-y-2">
                  {q("avg_session_duration")?.options?.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      active={avgSessionDuration === opt.value}
                      onClick={() => setLocalAvgSessionDuration(opt.value)}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

              {/* Q2 — strength_level (single_select) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("strength_level")?.question ?? "How would you rate your current strength level?"}
                </label>
                <div className="space-y-2">
                  {q("strength_level")?.options?.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      active={strengthLevel === opt.value}
                      onClick={() => setLocalStrengthLevel(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Q4 — training_types (multi_select) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("training_types")?.question ?? "What type of training have you done?"}
                </label>
                <div className="space-y-2">
                  {q("training_types")?.options?.map((opt) => (
                    <MultiCard
                      key={opt.value}
                      label={opt.label}
                      active={trainingTypes.includes(opt.value)}
                      onClick={() => toggleMulti(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Q6 — weekly_training_days (single_select) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("weekly_training_days")?.question ?? "How many days do you train per week?"}
                </label>
                <div className="space-y-2">
                  {q("weekly_training_days")?.options?.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      active={weeklyTrainingDays === opt.value}
                      onClick={() => setLocalWeeklyTrainingDays(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Q8 — goal_intensity (single_select) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {q("goal_intensity")?.question ?? "How intense do you want your training to be?"}
                </label>
                <div className="space-y-2">
                  {q("goal_intensity")?.options?.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      active={goalIntensity === opt.value}
                      onClick={() => setLocalGoalIntensity(opt.value)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/prefer-time")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            <div className="flex-1 flex justify-end">
              <button
                disabled={!canGoNext}
                onClick={handleNext}
                className={`border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                  canGoNext
                    ? "border-white text-white hover:bg-white hover:text-purple-900"
                    : "border-white/20 text-white/30 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWorkoutHistory;