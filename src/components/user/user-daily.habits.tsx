import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import userServices from "@/services/user/user.services";
import { useFetch } from "@/hooks/useFetch";
import { ApiResponse } from "@/interface/api-response.interface";
import { OnboardingQuestion } from "@/interface/onboarding.interface";
import { DAILY_HABITS_PAGE_KEYS } from "@/constants/schema-key.constant";
import { useOnboardingStore } from "@/stores/user-onboarding.store";

type FormValue = string | number | boolean;
type FormState = Record<string, FormValue>;
type ErrorState = Record<string, string>;


interface StepperProps {
  label: string;
  stateKey: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (key: string, value: number) => void;
}

const Stepper = ({
  label,
  stateKey,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: StepperProps) => (
  <div className="flex items-center justify-between">
    <span className="text-white/80 text-sm">{label}</span>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(stateKey, Math.max(min, value - step))}
        className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-purple-700/50 transition flex items-center justify-center"
      >
        −
      </button>
      <span className="text-white font-semibold w-24 text-center">
        {value} <span className="text-xs text-white/50">{unit}</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(stateKey, Math.min(max, value + step))}
        className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white text-lg font-bold hover:bg-purple-700/50 transition flex items-center justify-center"
      >
        +
      </button>
    </div>
  </div>
);

const BoolToggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-white/80 text-sm">{label}</span>
    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
      {(["Yes", "No"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt === "Yes")}
          className={`px-6 py-1.5 rounded-lg text-sm font-medium transition ${
            (opt === "Yes") === value
              ? "bg-purple-600 text-white"
              : "text-white/40 hover:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);



const UserDailyHabits = () => {
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);

  // ── Zustand ──
  const dailyHabits         = useOnboardingStore((s) => s.dailyHabits);
  const setWakeUpTime       = useOnboardingStore((s) => s.setWakeUpTime);
  const setSleepTime        = useOnboardingStore((s) => s.setSleepTime);
  const setMealsPerDay      = useOnboardingStore((s) => s.setMealsPerDay);
  const setAvgWaterLiters   = useOnboardingStore((s) => s.setAvgWaterLiters);
  const setAvgDailySteps    = useOnboardingStore((s) => s.setAvgDailySteps);
  const setCaffeine         = useOnboardingStore((s) => s.setCaffeine);
  const setAlcohol          = useOnboardingStore((s) => s.setAlcohol);
  const markDailyHabitsDone = useOnboardingStore((s) => s.markDailyHabitsDone);
  const getSubmitPayload    = useOnboardingStore((s) => s.getSubmitPayload);
  const resetStore          = useOnboardingStore((s) => s.resetStore);


  const [form, setForm] = useState<FormState>({
    wake_up_time:     dailyHabits.wakeUpTime,
    sleep_time:       dailyHabits.sleepTime,
    meals_per_day:    dailyHabits.mealsPerDay    || 3,
    avg_water_liters: dailyHabits.avgWaterLiters || 2,
    avg_daily_steps:  dailyHabits.avgDailySteps  || 5000,
    caffeine:         dailyHabits.caffeine,
    alcohol:          dailyHabits.alcohol,
  });

  const [errors, setErrors] = useState<ErrorState>({});

  // ── Fetch questions ──
  const { data: questionsRes, loading } = useFetch<ApiResponse<OnboardingQuestion[]>>(
    () => userServices.userOnboardingQuestions({ keys: DAILY_HABITS_PAGE_KEYS }),
    true,
  );

  const questions: OnboardingQuestion[] = questionsRes?.success ? questionsRes.data : [];

  // ── Helpers ──
  const handleChange = (key: string, value: FormValue): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // ── Validate & submit ──
  const handleFinish = async (): Promise<void> => {
    const newErrors: ErrorState = {};

    questions.forEach((question) => {
      const val = form[question.key];
      if (
        question.validation?.required &&
        (val === undefined || val === null || val === "")
      ) {
        newErrors[question.key] = "Required";
      }
    });

    if (!form.avg_water_liters && Number(form.avg_water_liters) <= 0) {
      newErrors.avg_water_liters = "Required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setWakeUpTime(String(form.wake_up_time ?? ""));
    setSleepTime(String(form.sleep_time ?? ""));
    setMealsPerDay(Number(form.meals_per_day ?? 0));
    setAvgWaterLiters(Number(form.avg_water_liters ?? 0));
    setAvgDailySteps(Number(form.avg_daily_steps ?? 0));
    setCaffeine(Boolean(form.caffeine));
    setAlcohol(Boolean(form.alcohol));
    markDailyHabitsDone();

    try {
      setSubmitLoading(true);
      const payload = getSubmitPayload();
      const res = await userServices.submitOnboarding(payload);

      if (!res.success) {
        toast.error("Failed to save your data. Please try again.");
        return;
      }

      resetStore();
      toast.success("Onboarding complete! Welcome to Bodometer 🎉");
      navigate("/onboarding-complete");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="text-white text-center">Loading...</div>
    </div>
  );

  // ── Partition questions by type ──
  const timeQuestions    = questions.filter((q) => q.type === "time");
  const stepperQuestions = questions.filter((q) => q.type === "number_stepper");
  const boolQuestions    = questions.filter((q) => q.type === "boolean");

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
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-wide">
            DAILY <span className="text-purple-400">HABITS</span>
          </h1>
          <p className="text-white/50 mb-8 text-sm">
            Tell us about your daily routine so we can personalise your plan.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">

            {/* LEFT — time + boolean */}
            <div className="space-y-4">
              {timeQuestions.map((question) => (
                <div key={question.key} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-3">
                    {question.question}
                  </label>
                  <input
                    type="time"
                    value={String(form[question.key] ?? "")}
                    onChange={(e) => handleChange(question.key, e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  />
                  {errors[question.key] && (
                    <p className="text-red-400 text-xs mt-2">{errors[question.key]}</p>
                  )}
                </div>
              ))}

              {boolQuestions.map((question) => (
                <div key={question.key} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <BoolToggle
                    label={question.question}
                    value={Boolean(form[question.key])}
                    onChange={(v) => handleChange(question.key, v)}
                  />
                  {errors[question.key] && (
                    <p className="text-red-400 text-xs mt-2">{errors[question.key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT — steppers + manual water */}
            <div className="space-y-4">
              {stepperQuestions.map((question) => (
                <div key={question.key} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <Stepper
                    label={question.question}
                    stateKey={question.key}
                    value={Number(form[question.key] ?? question.config?.min ?? 0)}
                    min={question.config?.min ?? 0}
                    max={question.config?.max ?? 100}
                    step={question.config?.step ?? 1}
                    unit={question.config?.unit ?? ""}
                    onChange={handleChange}
                  />
                  {errors[question.key] && (
                    <p className="text-red-400 text-xs mt-2">{errors[question.key]}</p>
                  )}
                </div>
              ))}

              {/* Manual water — not returned by API but required in submit payload */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Stepper
                  label="How many litres of water do you drink daily?"
                  stateKey="avg_water_liters"
                  value={Number(form.avg_water_liters ?? 2)}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="L"
                  onChange={handleChange}
                />
                {errors.avg_water_liters && (
                  <p className="text-red-400 text-xs mt-2">{errors.avg_water_liters}</p>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/health-details")}
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
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
            </div>

            <div className="flex-1 flex justify-end">
              <button
                onClick={handleFinish}
                disabled={submitLoading}
                className="border-2 border-white text-white px-8 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Saving..." : "Finish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDailyHabits;