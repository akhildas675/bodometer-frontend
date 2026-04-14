import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userServices from "@/services/user/user.services";
import { useFetch } from "@/hooks/useFetch";
import { ApiResponse } from "@/interface/api-response.interface";
import { Skill } from "../ui/skills-listing.checkbox";
import { useUserOnboardingStore } from "@/stores/user-onboarding.store";
import { OnboardingOptionsResponse } from "@/interface/user.interface";

/* ---------- Label Formatter ---------- */
const formatGoalLabel = (value: string) => {
  const map: Record<string, string> = {
    muscle_gain: "Muscle Gain",
    fat_loss: "Fat Loss",
    endurance: "Endurance",
    flexibility: "Flexibility",
    body_recomposition: "Body Recomposition",
    stamina_and_energy: "Stamina & Energy",
    general_fitness: "General Fitness",
    stress_relief: "Stress Relief",
  };

  return map[value] || value;
};

const UserFitnessGoals = () => {
  const { fitnessProfile, setFitnessProfile } = useUserOnboardingStore();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    fitnessProfile.fitnessGoals || []
  );
  const navigate = useNavigate();

  const {
    data: metadataResponse,
    loading,
    error,
  } = useFetch<ApiResponse<OnboardingOptionsResponse>>(
    userServices.getOnboardingOptions,
    true
  );

  const goals: string[] = metadataResponse?.data?.fitnessGoals || [];

  /* ---------- Toggle Selection ---------- */
  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  /* ---------- Next ---------- */
  const handleNext = () => {
    if (selectedGoals.length === 0) {
      alert("Please select at least one goal");
      return;
    }

    console.log("Selected Goals:", selectedGoals);

    setFitnessProfile({ fitnessGoals: selectedGoals });
    navigate("/prefer-time");
  };

  /* ---------- Loading / Error ---------- */
  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">Failed to load goals</div>;
  }

  /* ---------- Split into 2 columns ---------- */
  const mid = Math.ceil(goals.length / 2);
  const leftColumn = goals.slice(0, mid);
  const rightColumn = goals.slice(mid);

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

        {/* Background blur */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">

          {/* TITLE */}
          <h1 className="text-white text-3xl font-bold mb-12 text-center">
            WHAT ARE YOUR FITNESS GOALS?
          </h1>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="space-y-4">
              {leftColumn.map((goal) => (
                <Skill
                  key={goal}
                  label={formatGoalLabel(goal)}
                  checked={selectedGoals.includes(goal)}
                  onClick={() => toggleGoal(goal)}
                />
              ))}
            </div>

            <div className="space-y-4">
              {rightColumn.map((goal) => (
                <Skill
                  key={goal}
                  label={formatGoalLabel(goal)}
                  checked={selectedGoals.includes(goal)}
                  onClick={() => toggleGoal(goal)}
                />
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            {/* PREVIOUS */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/select-workouts")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER (Step 2 of 6) */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            {/* NEXT */}
            <div className="flex-1 flex justify-end">
              <button
                disabled={selectedGoals.length === 0}
                onClick={handleNext}
                className={`border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                  selectedGoals.length > 0
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

export default UserFitnessGoals;