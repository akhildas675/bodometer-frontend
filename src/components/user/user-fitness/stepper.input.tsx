import React from "react";
import { OnboardingQuestion } from "@/stores/onboarding.store";

interface StepperInputProps {
  question?: OnboardingQuestion;
  value: number | null;
  onChange?: (v: number) => void;
  // Generic Props for reuse
  setter?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unitLabel?: string;
  onReset?: () => void;
}

export const StepperInput = ({
  question,
  value,
  onChange,
  setter,
  min: propsMin,
  max: propsMax,
  step: propsStep,
  unitLabel: propsUnit,
  onReset,
}: StepperInputProps) => {
  const min = question?.numberConfig?.min ?? propsMin ?? 0;
  const max = question?.numberConfig?.max ?? propsMax ?? 100;
  const step = question?.numberConfig?.step ?? propsStep ?? 1;
  const unit = question?.numberConfig?.unit ?? propsUnit ?? "";

  const isTimeType = unit.toLowerCase().includes("hour") || unit.toLowerCase().includes("hr") || unit.toLowerCase() === "h";
  const actualStep = isTimeType ? 1 / 60 : step;

  const display = value ?? min;
  const progress = ((display - min) / (max - min)) * 100;

  const triggerChange = (nextVal: number) => {
    const clampedVal = Math.min(Math.max(nextVal, min), max);
    if (onChange) {
      onChange(clampedVal);
    } else if (setter) {
      setter(clampedVal);
    }
    if (onReset) {
      onReset();
    }
  };

  const handleAdjust = (direction: "inc" | "dec") => {
    let next =
      direction === "inc"
        ? display + actualStep
        : display - actualStep;
    
    if (isTimeType) {
      next = Math.round(next * 60) / 60;
    }
    
    triggerChange(next);
  };

  const formatDisplayValue = (val: number) => {
    if (isTimeType) {
      const h = Math.floor(val);
      const m = Math.round((val - h) * 60);
      if (h === 0) return `${m} min`;
      if (m === 0) return `${h} hr`;
      return `${h} hr ${m} min`;
    }
    return String(val);
  };

  return (
    <div className="space-y-4 mt-2 bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          {isTimeType ? (
            <div className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
              {formatDisplayValue(display)}
            </div>
          ) : (
            <>
              <input
                type="number"
                value={value !== null ? value : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? min : Number(e.target.value);
                  if (!isNaN(val)) triggerChange(val);
                }}
                className="text-4xl font-bold text-white bg-transparent border-none outline-none w-28 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder={String(min)}
              />
              <span className="text-purple-400 text-sm tracking-wide">{unit}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAdjust("dec")}
            className="w-10 h-10 rounded-full bg-white/10 border border-purple-500/40 text-white text-xl font-bold hover:bg-purple-700/50 transition flex items-center justify-center shadow-lg"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => handleAdjust("inc")}
            className="w-10 h-10 rounded-full bg-white/10 border border-purple-500/40 text-white text-xl font-bold hover:bg-purple-700/50 transition flex items-center justify-center shadow-lg"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative pt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={actualStep}
          value={display}
          onChange={(e) => triggerChange(Number(e.target.value))}
          className="w-full h-2.5 rounded-full appearance-none cursor-pointer accent-purple-500 transition"
          style={{
            background: `linear-gradient(to right, #9333ea ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
          }}
        />
        <div className="flex justify-between text-[11px] text-white/30 mt-2 uppercase tracking-widest font-medium">
          <span>{isTimeType ? formatDisplayValue(min) : `${min} ${unit}`}</span>
          <span>{isTimeType ? formatDisplayValue(max) : `${max} ${unit}`}</span>
        </div>
      </div>
    </div>
  );
};