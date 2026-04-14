import { useState } from "react";

type Unit = "metric" | "imperial";

const UserBmi = () => {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    if (unit === "metric") {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      if (!h || !w) return;
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    } else {
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      const w = parseFloat(weight);
      if (!totalInches || !w) return;
      setBmi(parseFloat(((w / (totalInches * totalInches)) * 703).toFixed(1)));
    }
  };

  const reset = () => {
    setHeight("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
    setBmi(null);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400", bg: "bg-blue-400" };
    if (bmi < 25) return { label: "Normal Weight", color: "text-green-400", bg: "bg-green-400" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-400", bg: "bg-yellow-400" };
    return { label: "Obese", color: "text-red-400", bg: "bg-red-400" };
  };

  const getIndicatorPosition = (bmi: number) => {
    // Map BMI 10-40 to 0-100%
    const min = 10;
    const max = 40;
    const clamped = Math.min(Math.max(bmi, min), max);
    return ((clamped - min) / (max - min)) * 100;
  };

  const category = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="min-h-screen bg-[#050017] flex items-center justify-center">
      <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden bg-gradient-to-br from-[#04001a] via-[#07002a] to-[#12043b] text-white px-16 py-12">
        <div className="relative z-10">

          {/* Title */}
          <h1 className="text-3xl font-semibold mb-2 tracking-wide">
            CALCULATE YOUR{" "}
            <span className="text-purple-400">BMI</span>
          </h1>
          <p className="text-slate-300 mb-8 text-sm">
            Body Mass Index helps understand your body weight relative to your height.
          </p>

          <div className="grid grid-cols-2 gap-12">

            {/* LEFT — Inputs */}
            <div className="space-y-6">

              {/* Unit Toggle */}
              <div>
                <label className="text-purple-200 text-sm block mb-3">Unit System</label>
                <div className="flex bg-white/5 rounded-xl p-1 w-fit">
                  <button
                    onClick={() => { setUnit("metric"); reset(); }}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                      unit === "metric"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => { setUnit("imperial"); reset(); }}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                      unit === "imperial"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="text-purple-200 text-sm block mb-2">
                  Height {unit === "metric" ? "(cm)" : "(ft / in)"}
                </label>
                {unit === "metric" ? (
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => { setHeight(e.target.value); setBmi(null); }}
                    placeholder="e.g. 175"
                    className="w-full bg-indigo-800/50 border border-purple-600 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                  />
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => { setHeightFt(e.target.value); setBmi(null); }}
                      placeholder="ft"
                      className="w-1/2 bg-indigo-800/50 border border-purple-600 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                    />
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => { setHeightIn(e.target.value); setBmi(null); }}
                      placeholder="in"
                      className="w-1/2 bg-indigo-800/50 border border-purple-600 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="text-purple-200 text-sm block mb-2">
                  Weight {unit === "metric" ? "(kg)" : "(lbs)"}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setBmi(null); }}
                  placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
                  className="w-full bg-indigo-800/50 border border-purple-600 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateBMI}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Calculate BMI
              </button>

            </div>

            {/* RIGHT — Result */}
            <div className="flex flex-col justify-center">
              {!bmi ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-40">
                  <div className="w-24 h-24 rounded-full border-4 border-purple-600/40 flex items-center justify-center">
                    <span className="text-4xl">⚖️</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Enter your height and weight to calculate your BMI
                  </p>
                </div>
              ) : (
                <div className="space-y-6">

                  {/* BMI Value */}
                  <div className="text-center">
                    <div className="w-36 h-36 rounded-full border-4 border-purple-500/50 flex flex-col items-center justify-center mx-auto bg-purple-500/10">
                      <span className="text-5xl font-bold text-white">{bmi}</span>
                      <span className="text-purple-300 text-xs mt-1">BMI</span>
                    </div>
                    <h2 className={`text-xl font-semibold mt-4 ${category?.color}`}>
                      {category?.label}
                    </h2>
                  </div>

                  {/* BMI Gauge Bar */}
                  <div>
                    <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-purple-600 shadow-lg transition-all duration-500"
                        style={{ left: `calc(${getIndicatorPosition(bmi)}% - 6px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>10</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40+</span>
                    </div>
                  </div>

                  {/* BMI Categories Legend */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { range: "< 18.5", label: "Underweight", color: "bg-blue-400" },
                      { range: "18.5 – 24.9", label: "Normal", color: "bg-green-400" },
                      { range: "25 – 29.9", label: "Overweight", color: "bg-yellow-400" },
                      { range: "≥ 30", label: "Obese", color: "bg-red-400" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs text-slate-400">
                          {item.range} — {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recalculate */}
                  <button
                    onClick={reset}
                    className="w-full py-2 rounded-xl border border-purple-600/40 text-purple-300 text-sm hover:bg-purple-600/10 transition"
                  >
                    Recalculate
                  </button>

                </div>
              )}
            </div>
          </div>

          {/* Stepper */}
           <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

          {/* Next */}
          <div className="flex justify-end mt-4">
            <button
              disabled={!bmi}
              className="px-5 py-1 rounded-full bg-[#1c1550] text-xs hover:bg-[#2a2075] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserBmi;