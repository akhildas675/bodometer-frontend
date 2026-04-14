import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card.wrapper";
import { Checkbox } from "../ui/checkbox";
import { Radio } from "../ui/radio";

import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { useUserOnboardingStore } from "@/stores/user-onboarding.store";
import { ApiResponse } from "@/interface/api-response.interface";
import { OnboardingOptionsResponse } from "@/interface/user.interface";

// ─── Option maps (for legacy/enum formatting) ──────────────────────────────────
const LBL_MAP: Record<string, string> = {
  // Experience
  "new_0_1_month": "I am totally new (0–1 months)",
  "m1_6": "1–6 months",
  "m6_12": "6–12 months",
  "y1_3": "1–3 years",
  "y3_plus": "3+ years",
  // Strength
  "struggle_basic": "I struggle with basic exercises",
  "bodyweight_ok": "I can do most bodyweight exercises",
  "weights_confident": "I can do weighted exercises confidently",
  "advanced_heavy": "I lift heavy / advanced movements",
  // Training
  "gym": "Gym / Strength training",
  "bodyweight": "Bodyweight / Home workouts",
  "cardio": "Running / Cardio",
  "sports": "Sports (football, cricket, badminton, etc.)",
  "yoga": "Yoga / Pilates",
  "none": "None",
  // Consistency
  "never": "Never consistent",
  "m1_3": "1–3 months consistent",
  "m3_6": "3–6 months consistent",
  "years": "Consistent for years",
  // Weekly
  "0": "0 days",
  "1_2": "1–2 days",
  "3_4": "3–4 days",
  "5_6": "5–6 days",
  "everyday": "Everyday",
  // Duration
  "lt_20": "<20 minutes",
  "20_40": "20–40 minutes",
  "40_60": "40–60 minutes",
  "60_plus": "60+ minutes",
  // Intensity
  "easy": "Easy / Light",
  "moderate": "Moderate",
  "challenging": "Challenging",
  "intense": "Very intense",
};

const formatLabel = (v: string) => LBL_MAP[v] || v;

// ─── Component ────────────────────────────────────────────────────────────────

const UserWorkoutHistory = () => {
  const navigate = useNavigate();
  const { workoutHistory, setWorkoutHistory } = useUserOnboardingStore();

  const [form, setForm] = useState({
    experienceDuration: workoutHistory.experienceDuration || "",
    strengthLevel:      workoutHistory.strengthLevel || "",
    trainedWithCoach:   workoutHistory.trainedWithCoach,
    trainingTypes:      workoutHistory.trainingTypes || ([] as string[]),
    consistencyLevel:   workoutHistory.consistencyLevel || "",
    weeklyTrainingDays: workoutHistory.weeklyTrainingDays || "",
    avgSessionDuration: workoutHistory.avgSessionDuration || "",
    goalIntensity:      workoutHistory.goalIntensity || "",
  });

  const { data: metadataResponse, loading } = useFetch<ApiResponse<OnboardingOptionsResponse>>(userServices.getOnboardingOptions, true);
  const metadata = metadataResponse?.data || {} as Partial<OnboardingOptionsResponse>;

  /* ---------- Handlers ---------- */

  const setSingle = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleTrainingType = (value: string) =>
    setForm((prev) => ({
      ...prev,
      trainingTypes: prev.trainingTypes.includes(value)
        ? prev.trainingTypes.filter((t) => t !== value)
        : [...prev.trainingTypes, value],
    }));

  /* ---------- Submit ---------- */

  const handleNext = () => {
    console.log("Workout History:", form);
    setWorkoutHistory(form);
    navigate("/health-details");
  };

  const isValid =
    form.experienceDuration &&
    form.strengthLevel &&
    form.trainedWithCoach !== null &&
    form.trainingTypes.length > 0 &&
    form.consistencyLevel &&
    form.weeklyTrainingDays &&
    form.avgSessionDuration &&
    form.goalIntensity;

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
        {/* Background orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-white text-3xl font-bold mb-2 text-center">
            PAST WORKOUT DETAILS
          </h1>
          <p className="text-white/40 text-sm text-center mb-10">Step 5 of 5</p>

          {/* TWO COLUMN GRID */}
          <div className="grid grid-cols-2 gap-6">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-6">

              {/* Experience duration */}
              <Card title="How long have you been consistently working out?">
                {(metadata.experienceDurations || []).map((val: string) => (
                  <Checkbox
                    key={val}
                    label={formatLabel(val)}
                    checked={form.experienceDuration === val}
                    onChange={() => setSingle("experienceDuration", val)}
                  />
                ))}
              </Card>

              {/* Strength level */}
              <Card title="What strength level best describes you?">
                {(metadata.strengthLevels || []).map((val: string) => (
                  <Checkbox
                    key={val}
                    label={formatLabel(val)}
                    checked={form.strengthLevel === val}
                    onChange={() => setSingle("strengthLevel", val)}
                  />
                ))}
              </Card>

              {/* Trained with coach */}
              <Card title="Have you trained with a personal coach before?">
                <Radio
                  label="Yes"
                  active={form.trainedWithCoach === true}
                  onClick={() => setForm((p) => ({ ...p, trainedWithCoach: true }))}
                />
                <Radio
                  label="No"
                  active={form.trainedWithCoach === false}
                  onClick={() => setForm((p) => ({ ...p, trainedWithCoach: false }))}
                />
              </Card>

              {/* Training types */}
              <Card title="What type of training have you done before?">
                {(metadata.trainingTypes || []).map((val: string) => (
                  <Checkbox
                    key={val}
                    label={formatLabel(val)}
                    checked={form.trainingTypes.includes(val)}
                    onChange={() => toggleTrainingType(val)}
                  />
                ))}
              </Card>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-6">

              {/* Consistency */}
              <Card title="Any periods of serious consistency?">
                {(metadata.consistencyLevels || []).map((val: string) => (
                  <Checkbox
                    key={val}
                    label={formatLabel(val)}
                    checked={form.consistencyLevel === val}
                    onChange={() => setSingle("consistencyLevel", val)}
                  />
                ))}
              </Card>

              {/* Weekly training days */}
              <Card title="How many days per week did you train on average?">
                {(metadata.weeklyTrainingDays || []).map((val: string) => (
                  <Checkbox
                    key={val}
                    label={formatLabel(val)}
                    checked={form.weeklyTrainingDays === val}
                    onChange={() => setSingle("weeklyTrainingDays", val)}
                  />
                ))}
              </Card>

              {/* Avg session duration */}
              <Card title="How long was your average workout session?">
                {(metadata.avgSessionDurations || []).map((val: string) => (
                  <Checkbox
                    key={val}
                    label={formatLabel(val)}
                    checked={form.avgSessionDuration === val}
                    onChange={() => setSingle("avgSessionDuration", val)}
                  />
                ))}
              </Card>

              {/* Goal intensity */}
              <Card title="What is your goal intensity?">
                {(metadata.goalIntensities || []).map((val: string) => (
                  <Checkbox
                    key={val}
                    label={formatLabel(val)}
                    checked={form.goalIntensity === val}
                    onChange={() => setSingle("goalIntensity", val)}
                  />
                ))}
              </Card>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between mt-12">
            {/* PREVIOUS */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/prefer-time")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER (Step 4 of 6) */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            {/* NEXT */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!isValid}
                className={`border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                  isValid
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