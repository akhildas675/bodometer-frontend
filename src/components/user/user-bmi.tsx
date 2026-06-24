import { useNavigate } from "react-router-dom";
import { useStandaloneBmiStore } from "@/stores/bmi.store";
import { useAuthStore } from "@/stores/auth.store";
import { useMemo } from "react";
import { Loader2, ArrowLeft, CheckCircle2, Scale, Dumbbell, ShieldAlert, Award } from "lucide-react";
import { StepperInput } from "@/features/user/onboarding/components/stepper.input";

type Unit = "metric" | "imperial";

const getIndicatorPosition = (bmi: number): number => {
  const min = 10;
  const max = 40;
  const clamped = Math.min(Math.max(bmi, min), max);
  return ((clamped - min) / (max - min)) * 100;
};

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
    heightCm,
    weightKg,
    healthyWeightRange,
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

  // Format Healthy Weight Range based on units
  const formattedHealthyRange = useMemo(() => {
    if (!healthyWeightRange) return null;
    const { minKg, maxKg } = healthyWeightRange;
    if (unit === "metric") {
      return `${minKg} kg – ${maxKg} kg`;
    } else {
      const minLbs = minKg * 2.20462;
      const maxLbs = maxKg * 2.20462;
      return `${minLbs.toFixed(1)} lbs – ${maxLbs.toFixed(1)} lbs`;
    }
  }, [healthyWeightRange, unit]);

  // Determine category-specific CSS styling classes and icons
  const categoryGlow = useMemo(() => {
    if (!bmi) return null;
    if (bmi < 18.5) {
      return {
        icon: <ShieldAlert className="w-5 h-5 text-blue-400 animate-pulse" />,
        bgGlow: "bg-blue-500/5 border-blue-500/20"
      };
    } else if (bmi < 25) {
      return {
        icon: <Award className="w-5 h-5 text-green-400 animate-bounce" />,
        bgGlow: "bg-green-500/5 border-green-500/20"
      };
    } else if (bmi < 30) {
      return {
        icon: <ShieldAlert className="w-5 h-5 text-yellow-400 animate-pulse" />,
        bgGlow: "bg-yellow-500/5 border-yellow-500/20"
      };
    } else {
      return {
        icon: <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />,
        bgGlow: "bg-red-500/5 border-red-500/20"
      };
    }
  }, [bmi]);

  const containerClasses = isAuthenticated
    ? "max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6"
    : "min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center justify-center pt-24 pb-12 px-8 w-full";

  const cardClasses = isAuthenticated
    ? "bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 sm:p-12 shadow-xl border border-white/5 relative overflow-hidden w-full"
    : "max-w-6xl w-full bg-linear-to-b from-[#03000D] to-[#190473] rounded-3xl p-12 relative overflow-hidden border border-white/10";

  return (
    <div className={containerClasses}>
      {/* TOP BAR — BACK BUTTON */}
      {!isAuthenticated && (
        <div className="w-full max-w-6xl mb-6 flex items-center justify-start">
          <button
            onClick={handleBack}
            className="text-white/60 hover:text-white transition-all uppercase tracking-widest text-xs font-semibold flex items-center gap-1.5 hover:scale-105"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT — Inputs */}
            <div className="space-y-6">
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
            <div className="flex flex-col justify-center bg-white/5 rounded-2xl p-8 border border-white/10 min-h-[400px]">
              {!bmi ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
                  <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
                    <Scale size={32} className="text-white/30" />
                  </div>
                  <p className="text-white/30 text-sm max-w-xs">
                    Enter your height and weight on the left side to get a complete breakdown of your BMI health statistics.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* BMI Circle & Category Badge */}
                  <div className="text-center">
                    <div className="relative w-36 h-36 rounded-full border-2 border-white/10 flex flex-col items-center justify-center mx-auto bg-white/5 shadow-2xl overflow-hidden group">
                      <div className="absolute inset-0 bg-purple-500/5 group-hover:scale-110 transition duration-500" />
                      <span className="text-5xl font-extrabold text-white z-10">{bmi}</span>
                      <span className="text-white/50 text-xs mt-1 font-semibold tracking-wider uppercase z-10">BMI</span>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center gap-1.5">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                        bmi < 18.5 ? "bg-blue-400" : bmi < 25 ? "bg-green-400" : bmi < 30 ? "bg-yellow-400" : "bg-red-400"
                      }`} />
                      <h2 className={`text-xl font-bold uppercase tracking-wider ${category?.color}`}>
                        {category?.label}
                      </h2>
                    </div>
                  </div>

                  {/* Gauge Bar */}
                  <div className="px-2">
                    <div className="relative h-2.5 rounded-full bg-linear-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.9)] transition-all duration-500"
                        style={{ left: `calc(${getIndicatorPosition(bmi)}% - 9px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30 mt-1.5 font-semibold">
                      <span>10.0 (Under)</span>
                      <span>18.5</span>
                      <span>25.0</span>
                      <span>30.0 (Obese)</span>
                    </div>
                  </div>

                  {/* Stats Breakdowns */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-white/40 text-xs block uppercase tracking-wider mb-0.5">Calculated Height</span>
                      <span className="text-sm font-semibold">
                        {unit === "metric" ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in`}
                      </span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-white/40 text-xs block uppercase tracking-wider mb-0.5">Calculated Weight</span>
                      <span className="text-sm font-semibold">
                        {unit === "metric" ? `${weightKg} kg` : `${weight} lbs`}
                      </span>
                    </div>
                  </div>

                  {formattedHealthyRange && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between px-6">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-purple-400" />
                        <span className="text-white/40 text-xs uppercase tracking-wider">Healthy weight range:</span>
                      </div>
                      <span className="text-sm font-bold text-purple-300">
                        {formattedHealthyRange}
                      </span>
                    </div>
                  )}

                  {/* Personalized Actionable Feedback */}
                  {category?.description && categoryGlow && (
                    <div className={`p-5 rounded-2xl border ${categoryGlow.bgGlow} space-y-3`}>
                      <div className="flex items-center gap-2">
                        {categoryGlow.icon}
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{category.label} Advice</h3>
                      </div>
                      <p className="text-white/70 text-xs leading-relaxed">
                        {category.description}
                      </p>
                      {category.tips && category.tips.length > 0 && (
                        <div className="space-y-1.5 pt-1.5">
                          {category.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px] text-white/60">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recalculate */}
                  <button
                    onClick={reset}
                    className="w-full py-3 rounded-full border border-white/10 text-white/50 text-xs font-semibold uppercase tracking-wider hover:text-white hover:border-white/30 transition hover:bg-white/5"
                  >
                    Recalculate BMI
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