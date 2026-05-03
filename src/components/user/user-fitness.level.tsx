import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Skill } from "@/components/ui/skills-listing.checkbox";
import { useFetch } from "@/hooks/useFetch";
import userServices from "@/services/user/user.services";
import { ApiResponse } from "@/interface/api-response.interface";
import { OnboardingQuestion } from "@/interface/onboarding.interface";
import { FITNESS_LEVEL_PAGE_KEYS } from "@/constants/schema-key.constant";
import { useOnboardingStore } from "@/stores/user-onboarding.store";

const UserFitnessLevel = () => {
  const navigate = useNavigate();

  // ── Zustand ──
  const storedLevel          = useOnboardingStore((s) => s.fitnessProfile.fitnessLevel);
  const setFitnessLevel      = useOnboardingStore((s) => s.setFitnessLevel);
  const markFitnessLevelDone = useOnboardingStore((s) => s.markFitnessLevelDone);

  // ── Pre-fill from store so back navigation restores selection ──
  const [selected, setSelected] = useState<string>(storedLevel ?? "");

  // ── Fetch question ──
  const { data: questionsRes, loading } = useFetch<ApiResponse<OnboardingQuestion[]>>(
    () => userServices.userOnboardingQuestions({ keys: FITNESS_LEVEL_PAGE_KEYS }),
    true
  );

  const question = questionsRes?.success ? questionsRes.data[0] : null;
  const options  = question?.options ?? [];

  // Split into two columns exactly like WorkoutSelect
  const mid         = Math.ceil(options.length / 2);
  const leftColumn  = options.slice(0, mid);
  const rightColumn = options.slice(mid);

  const handleNext = () => {
    if (!selected) return;
    setFitnessLevel(selected);
    markFitnessLevelDone();
    navigate("/prefer-time");
  };

  if (loading) return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
      <div className="text-white text-center">Loading...</div>
    </div>
  );

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
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-wide">
            FITNESS <span className="text-purple-400">LEVEL</span>
          </h1>
          <p className="text-white/50 mb-8 text-sm">
            {question?.question ?? "What is your current fitness level?"}
          </p>

          {/* GRID — same pattern as WorkoutSelect & FitnessGoals */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="space-y-4">
              {leftColumn.map((opt) => (
                <Skill
                  key={opt.value}
                  label={opt.label}
                  checked={selected === opt.value}
                  onClick={() => setSelected(opt.value)}
                />
              ))}
            </div>
            <div className="space-y-4">
              {rightColumn.map((opt) => (
                <Skill
                  key={opt.value}
                  label={opt.label}
                  checked={selected === opt.value}
                  onClick={() => setSelected(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/goals")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            <div className="flex-1 flex justify-end">
              <button
                disabled={!selected}
                onClick={handleNext}
                className={`border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                  selected
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

export default UserFitnessLevel;