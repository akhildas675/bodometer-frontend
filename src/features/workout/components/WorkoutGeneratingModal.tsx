import { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  Brain,
  Activity,
  Target,
  ListChecks,
  Dumbbell,
} from "lucide-react";

const PREMIUM_STEPS = [
  { icon: Brain,      label: "Analyzing your fitness profile…"    },
  { icon: Activity,   label: "Building your weekly structure…"     },
  { icon: Target,     label: "Selecting optimal exercises…"        },
  { icon: ListChecks, label: "Finalizing sets, reps & rest times…" },
  { icon: Sparkles,   label: "Polishing your personalized plan…"   },
];

const FREE_STEPS = [
  { icon: Activity,   label: "Selecting standard exercises…"       },
  { icon: Target,     label: "Building a basic weekly routine…"    },
  { icon: ListChecks, label: "Organizing your daily workout…"      },
  { icon: Dumbbell,   label: "Setting up your fitness plan…"       },
  { icon: Sparkles,   label: "Finalizing your free plan…"          },
];

export const WorkoutGeneratingModal = ({ isOpen, isPremium }: { isOpen: boolean; isPremium: boolean }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = isPremium ? PREMIUM_STEPS : FREE_STEPS;

  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(id);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  const CurrentIcon = steps[stepIdx].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-linear-to-br from-[#140b3a] to-[#0a0624] border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center gap-6">

        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
          <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <CurrentIcon className="w-7 h-7 text-purple-300 transition-all duration-500" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-white">
            {isPremium ? "Building Your AI Plan" : "Building Your Free Plan"}
          </h3>
          <p className="text-white/50 text-sm">
            {isPremium ? "Our AI is crafting a personalized week for you" : "We are preparing a basic workout plan for you"}
          </p>
        </div>

        <div className="w-full px-2">
          <div
            key={stepIdx}
            className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-purple-200 font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {steps[stepIdx].label}
          </div>
        </div>

        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === stepIdx
                  ? "w-8 bg-purple-500"
                  : i < stepIdx
                    ? "w-4 bg-purple-600/50"
                    : "w-4 bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-white/30 text-xs">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          This usually takes 10–20 seconds
        </div>
      </div>
    </div>
  );
};
