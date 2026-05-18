import { useState } from "react";
import { OnboardingQuestion } from "@/interface/onboarding.interface";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/stores/user-onboarding.store";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { useOnboardingStore as useDynamicOnboardingStore, OnboardingQuestion as DynamicQuestion } from "@/stores/onboarding.store";

const ONBOARDING_KEYS = {
  HEIGHT_CM: "height_cm",
  WEIGHT_KG: "weight_kg",
} as const;

const BMI_PAGE_KEYS = ["height_cm", "weight_kg"];

type Unit = "metric" | "imperial";

interface StepperConfig {
  min: number;
  max: number;
  step: number;
  unit?: string;
}

interface StepperInputProps {
  question: OnboardingQuestion | undefined;
  value: number | null;
  setter: (v: number) => void;
  unitLabel?: string;
  onReset: () => void;
}

const StepperInput = ({
  question,
  value,
  setter,
  unitLabel,
  onReset,
}: StepperInputProps) => {
  if (!question?.config) return null;

  const { min, max, step, unit }: StepperConfig = question.config;

  const display = value ?? min;
  const clampedDisplay = Math.min(Math.max(display, min), max);
  const progress = ((clampedDisplay - min) / (max - min)) * 100;

  const handleStep = (direction: "inc" | "dec") => {
    const next =
      direction === "inc"
        ? Math.min(display + step, max)
        : Math.max(display - step, min);
    setter(next);
    onReset();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            value={value !== null ? value : ""}
            onChange={(e) => {
              const val = e.target.value === "" ? min : Number(e.target.value);
              if (!isNaN(val)) {
                setter(val);
                onReset();
              }
            }}
            className="text-4xl font-bold text-white bg-transparent border-none outline-none w-24 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder={String(min)}
          />
          <span className="text-purple-400 text-sm">{unitLabel ?? unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleStep("dec")}
            className="w-9 h-9 rounded-full bg-white/10 border border-purple-500/50 text-white text-lg font-bold hover:bg-purple-700/50 transition flex items-center justify-center"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => handleStep("inc")}
            className="w-9 h-9 rounded-full bg-white/10 border border-purple-500/50 text-white text-lg font-bold hover:bg-purple-700/50 transition flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedDisplay}
          onChange={(e) => {
            setter(Number(e.target.value));
            onReset();
          }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500"
          style={{
            background: `linear-gradient(to right, #9333ea ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { label: "Normal Weight", color: "text-green-400" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
  return { label: "Obese", color: "text-red-400" };
};

const getIndicatorPosition = (bmi: number): number => {
  const min = 10;
  const max = 40;
  const clamped = Math.min(Math.max(bmi, min), max);
  return ((clamped - min) / (max - min)) * 100;
};

const BMI_CATEGORIES = [
  { range: "< 18.5", label: "Underweight", color: "bg-blue-400" },
  { range: "18.5 – 24.9", label: "Normal", color: "bg-green-400" },
  { range: "25 – 29.9", label: "Overweight", color: "bg-yellow-400" },
  { range: "≥ 30", label: "Obese", color: "bg-red-400" },
];

const UserBmi = () => {

  const medicalProfile = useOnboardingStore((state) => state.medicalProfile);


const [height, setHeight] = useState<number | null>(
  medicalProfile.heightCm > 0 ? medicalProfile.heightCm : null
);
const [weight, setWeight] = useState<number | null>(
  medicalProfile.weightKg > 0 ? medicalProfile.weightKg : null
);
const [bmi, setBmi] = useState<number | null>(
  medicalProfile.bmi > 0 ? medicalProfile.bmi : null
);
  const [unit, setUnit] = useState<Unit>("metric");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");


  const navigate = useNavigate();

  const setBodyMetrics = useOnboardingStore((state) => state.setBmi);
  const markBmiDone = useOnboardingStore((state) => state.markBmiDone);
  const setDynamicAnswer = useDynamicOnboardingStore((state) => state.setAnswer);

  const allQuestions = useDynamicOnboardingStore((state) => state.questions);
  const allGroups = useDynamicOnboardingStore((state) => state.groups);
  const loading = useDynamicOnboardingStore((state) => state.loading);

  // 1. Locate the BMI Group dynamically from stored collections
  const bmiGroup = allGroups.find(
    (g) => g.key?.startsWith("bmi") || g.title?.toLowerCase().includes("bmi")
  );

  // 2. Pull questions tied to that specific group
  const questions = allQuestions
    .filter((q) => {
      if (!bmiGroup) return false;
      return q.groupId === bmiGroup.groupId;
    })
    .map((q) => ({
      ...q,
      config: q.config || {
        min: q.numberConfig?.min ?? (q.key.includes("height") ? 100 : 30),
        max: q.numberConfig?.max ?? (q.key.includes("height") ? 250 : 200),
        step: q.numberConfig?.step ?? 1,
        unit: q.numberConfig?.unit ?? (q.key.includes("height") ? "cm" : "kg"),
      },
    })) as unknown as OnboardingQuestion[];

  // 3. Dynamically select height and weight questions by analyzing key and body text
  const heightQ = questions.find(
    (q) => q.key.includes("height") || q.question.toLowerCase().includes("height")
  ) || ({
    id: "fallback_height",
    key: "height_cm",
    config: { min: 100, max: 250, step: 1, unit: "cm" }
  } as unknown as OnboardingQuestion);

  const weightQ = questions.find(
    (q) => q.key.includes("weight") || q.question.toLowerCase().includes("weight")
  ) || ({
    id: "fallback_weight",
    key: "weight_kg",
    config: { min: 30, max: 200, step: 1, unit: "kg" }
  } as unknown as OnboardingQuestion);

  const resetBmi = () => setBmi(null);

  const reset = () => {
    setHeight(null);
    setHeightFt("");
    setHeightIn("");
    setWeight(null);
    setBmi(null);
  };



  const canGoNext =
    medicalProfile.bmi > 0 &&
    medicalProfile.heightCm > 0 &&
    medicalProfile.weightKg > 0;

  const handleNext = () => {
    if (!canGoNext) return;
    navigate(USER_UI_ROUTES.ONBOARDING_ASSESSMENT);
  };

  const calculateBMI = () => {
    let finalBmi = 0;
    let finalHeight = 0;
    let finalWeight = 0;

    if (unit === "metric") {
      if (!height || !weight) return;
      const h = height / 100;
      finalBmi = parseFloat((weight / (h * h)).toFixed(1));
      finalHeight = height;
      finalWeight = weight;
    } else {
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      if (!totalInches || !weight) return;
      finalBmi = parseFloat(
        ((weight / (totalInches * totalInches)) * 703).toFixed(1)
      );
      finalHeight = Math.round(totalInches * 2.54);
      finalWeight = parseFloat((weight * 0.453592).toFixed(1));
    }

    setBmi(finalBmi);
    setBodyMetrics(finalBmi, finalHeight, finalWeight);
    markBmiDone();

    // Sync mapped inputs with the dynamic onboarding store for final submission
    if (heightQ) setDynamicAnswer(heightQ.id, heightQ.key, finalHeight);
    if (weightQ) setDynamicAnswer(weightQ.id, weightQ.key, finalWeight);

    const bmiQ = allQuestions.find((q) => {
      if (!bmiGroup) return false;
      return q.groupId === bmiGroup.groupId && (q.key.includes("bmi") || q.question.toLowerCase().includes("bmi"));
    });
    if (bmiQ) setDynamicAnswer(bmiQ.questionId, bmiQ.key, finalBmi);
  };

  const isCalculateDisabled =
    unit === "metric"
      ? !height || !weight
      : (!heightFt && !heightIn) || !weight;

  const category = bmi ? getBMICategory(bmi) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-white text-center">Loading...</div>
      </div>
    );
  }

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
        {/* Background blobs — same as workout page */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-wide">
            CALCULATE YOUR <span className="text-purple-400">BMI</span>
          </h1>
          <p className="text-white/50 mb-8 text-sm">
            Body Mass Index helps understand your body weight relative to your height.
          </p>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {/* LEFT — Inputs */}
            <div className="space-y-5">
              {/* Unit Toggle */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-3">
                  Unit System
                </label>
                <div className="flex bg-white/5 rounded-xl p-1 w-fit border border-white/10">
                  {(["metric", "imperial"] as Unit[]).map((u) => (
                    <button
                      key={u}
                      onClick={() => {
                        setUnit(u);
                        reset();
                      }}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition capitalize ${
                        unit === u
                          ? "bg-purple-600 text-white"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {heightQ?.question ?? "What is your height?"}
                </label>
                {unit === "metric" ? (
                  <StepperInput
                    question={heightQ}
                    value={height}
                    setter={setHeight}
                    onReset={resetBmi}
                  />
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => {
                        setHeightFt(e.target.value);
                        resetBmi();
                      }}
                      placeholder="ft"
                      className="w-1/2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => {
                        setHeightIn(e.target.value);
                        resetBmi();
                      }}
                      placeholder="in"
                      className="w-1/2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <label className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {weightQ?.question ?? "What is your weight?"}
                </label>
                <StepperInput
                  question={weightQ}
                  value={weight}
                  setter={setWeight}
                  unitLabel={unit === "imperial" ? "lbs" : weightQ?.config?.unit}
                  onReset={resetBmi}
                />
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateBMI}
                disabled={isCalculateDisabled}
                className={`w-full border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                  !isCalculateDisabled
                    ? "border-white text-white hover:bg-white hover:text-purple-900"
                    : "border-white/20 text-white/30 cursor-not-allowed"
                }`}
              >
                Calculate BMI
              </button>
            </div>

            {/* RIGHT — Result */}
            <div className="flex flex-col justify-center">
              {!bmi ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <span className="text-4xl">⚖️</span>
                  </div>
                  <p className="text-white/30 text-sm">
                    Enter your height and weight to calculate your BMI
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* BMI Circle */}
                  <div className="text-center">
                    <div className="w-36 h-36 rounded-full border-2 border-white/20 flex flex-col items-center justify-center mx-auto bg-white/5">
                      <span className="text-5xl font-bold text-white">{bmi}</span>
                      <span className="text-white/50 text-xs mt-1">BMI</span>
                    </div>
                    <h2 className={`text-xl font-semibold mt-4 ${category?.color}`}>
                      {category?.label}
                    </h2>
                  </div>

                  {/* Gauge Bar */}
                  <div>
                    <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-purple-500 shadow-lg transition-all duration-500"
                        style={{ left: `calc(${getIndicatorPosition(bmi)}% - 6px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/30 mt-1">
                      <span>10</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40+</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2">
                    {BMI_CATEGORIES.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs text-white/40">
                          {item.range} — {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recalculate */}
                  <button
                    onClick={reset}
                    className="w-full py-2 rounded-full border border-white/20 text-white/50 text-sm hover:text-white hover:border-white/40 transition"
                  >
                    Recalculate
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            {/* PREVIOUS */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/intro")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER dots — same style as workout page */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            {/* NEXT */}
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

export default UserBmi;