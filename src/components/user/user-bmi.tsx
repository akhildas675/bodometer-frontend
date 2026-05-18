import { useNavigate } from "react-router-dom";
import { useStandaloneBmiStore } from "@/stores/bmi.store";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2 } from "lucide-react";

type Unit = "metric" | "imperial";

interface StepperInputProps {
  value: number | null;
  setter: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unitLabel: string;
  onReset: () => void;
}

const StepperInput = ({
  value,
  setter,
  min,
  max,
  step,
  unitLabel,
  onReset,
}: StepperInputProps) => {
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
          <span className="text-purple-400 text-sm">{unitLabel}</span>
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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Standalone Bmi Store Integration
  const {
    height,
    weight,
    unit,
    heightFt,
    heightIn,
    bmi,
    category,
    loading: calculating,
    error,
    setHeight,
    setWeight,
    setUnit,
    setHeightFt,
    setHeightIn,
    reset,
    calculateBmi,
  } = useStandaloneBmiStore();

  const handleInputChange = () => {
    useStandaloneBmiStore.setState({ bmi: null, category: null });
  };

  const handleCalculate = async () => {
    await calculateBmi();
  };

  const isCalculateDisabled =
    unit === "metric"
      ? !height || !weight
      : (!heightFt && !heightIn) || !weight;

  const handleBack = () => {
    navigate("/");
  };

  const containerClasses = isAuthenticated
    ? "max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6"
    : "min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center justify-center pt-24 pb-12 px-8 w-full";

  const cardClasses = isAuthenticated
    ? "bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 sm:p-12 shadow-xl border border-white/5 relative overflow-hidden w-full"
    : "max-w-6xl w-full bg-linear-to-b from-[#03000D] to-[#190473] rounded-3xl p-12 relative overflow-hidden border border-white/10";

  return (
    <div className={containerClasses}>
      {/* TOP BAR — BACK BUTTON ONLY */}
      {!isAuthenticated && (
        <div className="w-full max-w-6xl mb-6 flex items-center justify-start">
          <button
            onClick={handleBack}
            className="text-white/60 hover:text-white transition-all uppercase tracking-widest text-xs font-semibold flex items-center gap-1.5 hover:scale-105"
          >
            ← Back
          </button>
        </div>
      )}

      <div className={cardClasses}>
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-wide uppercase">
            Calculate your <span className="text-purple-400">BMI</span>
          </h1>
          <p className="text-white/50 mb-8 text-sm">
            Body Mass Index helps understand your body weight relative to your height.
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                      onClick={() => setUnit(u)}
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
                  What is your height?
                </label>
                {unit === "metric" ? (
                  <StepperInput
                    value={height}
                    setter={setHeight}
                    min={100}
                    max={250}
                    step={1}
                    unitLabel="cm"
                    onReset={handleInputChange}
                  />
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => {
                        setHeightFt(e.target.value);
                        handleInputChange();
                      }}
                      placeholder="ft"
                      className="w-1/2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => {
                        setHeightIn(e.target.value);
                        handleInputChange();
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
                  What is your weight?
                </label>
                <StepperInput
                  value={weight}
                  setter={setWeight}
                  min={unit === "imperial" ? 50 : 30}
                  max={unit === "imperial" ? 450 : 200}
                  step={1}
                  unitLabel={unit === "imperial" ? "lbs" : "kg"}
                  onReset={handleInputChange}
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs mt-1 italic">{error}</p>
              )}

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={isCalculateDisabled || calculating}
                className={`w-full border-2 px-8 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                  (!isCalculateDisabled && !calculating)
                    ? "border-white text-white hover:bg-white hover:text-purple-900"
                    : "border-white/20 text-white/30 cursor-not-allowed"
                }`}
              >
                {calculating && <Loader2 className="w-4 h-4 animate-spin" />}
                Calculate BMI
              </button>
            </div>

            {/* RIGHT — Result */}
            <div className="flex flex-col justify-center bg-white/5 rounded-2xl p-8 border border-white/10">
              {!bmi ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
                  <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
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
                    <div className="w-36 h-36 rounded-full border-2 border-white/20 flex flex-col items-center justify-center mx-auto bg-white/5 shadow-2xl">
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
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all duration-500"
                        style={{ left: `calc(${getIndicatorPosition(bmi)}% - 8px)` }}
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
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {BMI_CATEGORIES.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-xs text-white/45">
                          {item.range} — {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recalculate */}
                  <button
                    onClick={reset}
                    className="w-full py-2.5 rounded-full border border-white/20 text-white/50 text-sm hover:text-white hover:border-white/40 transition"
                  >
                    Recalculate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBmi;