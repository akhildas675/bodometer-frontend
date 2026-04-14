import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserOnboardingStore } from "@/stores/user-onboarding.store";
import userServices from "@/services/user/user.services";
import { toast } from "sonner";

/* ---------- SUB-COMPONENTS (outside main component) ---------- */

const InputField = ({
  label,
  stateKey,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  stateKey: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (key: string, value: number) => void;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-white/80 text-sm">{label}</span>
    <div className="flex items-center gap-3">
      <button
        onClick={() =>
          onChange(stateKey, Math.max(min, +(value - step).toFixed(1)))
        }
        className="w-8 h-8 rounded-full border border-white/20 text-white/70 hover:border-white/60 hover:text-white transition-all flex items-center justify-center text-lg leading-none"
      >
        −
      </button>
      <span className="text-white font-semibold w-20 text-center">
        {value}{" "}
        <span className="text-white/50 text-xs font-normal">{unit}</span>
      </span>
      <button
        onClick={() =>
          onChange(stateKey, Math.min(max, +(value + step).toFixed(1)))
        }
        className="w-8 h-8 rounded-full border border-white/20 text-white/70 hover:border-white/60 hover:text-white transition-all flex items-center justify-center text-lg leading-none"
      >
        +
      </button>
    </div>
  </div>
);

const Toggle = ({
  label,
  stateKey,
  value,
  onChange,
}: {
  label: string;
  stateKey: string;
  value: boolean;
  onChange: (key: string, value: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-white/80 text-sm">{label}</span>
    <button
      onClick={() => onChange(stateKey, !value)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        value ? "bg-purple-500" : "bg-white/10 border border-white/20"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
          value ? "left-7" : "left-1"
        }`}
      />
    </button>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */

const UserDailyHabits = () => {
  const navigate = useNavigate();
  const { setDailyHabits } = useUserOnboardingStore();

  const [form, setForm] = useState({
    wakeUpTime: "",
    sleepTime: "",
    mealsPerDay: 3,
    avgWaterLiters: 2,
    avgDailySteps: 5000,
    caffeine: false,
    alcohol: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------- HANDLERS ---------- */
  const handleChange = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateTime = (value: string) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

  /* ---------- NEXT ---------- */
  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    if (!form.wakeUpTime) newErrors.wakeUpTime = "Required";
    else if (!validateTime(form.wakeUpTime))
      newErrors.wakeUpTime = "Use HH:MM format (e.g. 06:30)";

    if (!form.sleepTime) newErrors.sleepTime = "Required";
    else if (!validateTime(form.sleepTime))
      newErrors.sleepTime = "Use HH:MM format (e.g. 22:00)";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Daily Habits:", form);

    const habitsPayload = {
      dietPreference: "Not Specified",
      dailyMeals: form.mealsPerDay.toString(),
      waterIntake: `${form.avgWaterLiters} Liters`,
      sleepDuration: `${form.sleepTime} to ${form.wakeUpTime}`,
      stressLevel: "Not Specified",
      workType: `Daily Steps: ${form.avgDailySteps}`,
      smokingDrinking: `Caffeine: ${form.caffeine ? 'Yes' : 'No'}, Alcohol: ${form.alcohol ? 'Yes' : 'No'}`,
    };

    setDailyHabits(habitsPayload);

    try {
      const state = useUserOnboardingStore.getState();
      
      const payload = {
        fitnessProfile: state.fitnessProfile,
        workoutHistory: state.workoutHistory,
        medicalProfile: state.medicalProfile,
        dailyHabits: habitsPayload,
      };

      await userServices.submitPremiumOnboarding(payload);
      
      toast.success("Ready to crush your goals! Generating your dashboard...");
      
      // Clear store memory
      state.resetOnboarding();
      
      navigate("/onboarding-complete"); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to save onboarding data");
    }
  };

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
          <h1 className="text-white text-3xl font-bold mb-12 text-center">
            YOUR <span className="text-purple-400">DAILY HABITS</span>
          </h1>

          <div className="grid grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">

              {/* SLEEP SCHEDULE */}
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 space-y-5">
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                  Sleep Schedule
                </p>

                <div className="space-y-1">
                  <label className="text-white/70 text-sm">Wake up time</label>
                  <input
                    type="time"
                    value={form.wakeUpTime}
                    onChange={(e) => handleChange("wakeUpTime", e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-purple-400 transition-colors [color-scheme:dark] ${
                      errors.wakeUpTime ? "border-red-500" : "border-white/10"
                    }`}
                  />
                  {errors.wakeUpTime && (
                    <p className="text-red-400 text-xs">{errors.wakeUpTime}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 text-sm">Sleep time</label>
                  <input
                    type="time"
                    value={form.sleepTime}
                    onChange={(e) => handleChange("sleepTime", e.target.value)}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-purple-400 transition-colors [color-scheme:dark] ${
                      errors.sleepTime ? "border-red-500" : "border-white/10"
                    }`}
                  />
                  {errors.sleepTime && (
                    <p className="text-red-400 text-xs">{errors.sleepTime}</p>
                  )}
                </div>
              </div>

              {/* LIFESTYLE TOGGLES */}
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 space-y-5">
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                  Lifestyle
                </p>
                <Toggle
                  label="Do you consume caffeine?"
                  stateKey="caffeine"
                  value={form.caffeine}
                  onChange={handleChange}
                />
                <div className="border-t border-white/5" />
                <Toggle
                  label="Do you consume alcohol?"
                  stateKey="alcohol"
                  value={form.alcohol}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

              {/* DAILY METRICS */}
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 space-y-5">
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                  Daily Metrics
                </p>
                <InputField
                  label="Meals per day"
                  stateKey="mealsPerDay"
                  value={form.mealsPerDay}
                  min={1}
                  max={10}
                  unit="meals"
                  onChange={handleChange}
                />
                <div className="border-t border-white/5" />
                <InputField
                  label="Water intake"
                  stateKey="avgWaterLiters"
                  value={form.avgWaterLiters}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="liters"
                  onChange={handleChange}
                />
                <div className="border-t border-white/5" />
                <InputField
                  label="Daily steps"
                  stateKey="avgDailySteps"
                  value={form.avgDailySteps}
                  min={0}
                  max={30000}
                  step={500}
                  unit="steps"
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between mt-12">
            {/* PREVIOUS */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/health-details")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER (Step 6 of 6) */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
            </div>

            {/* NEXT */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleNext}
                className="border-2 border-white text-white px-8 py-2 rounded-full font-semibold transition-all hover:bg-white hover:text-purple-900"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDailyHabits;