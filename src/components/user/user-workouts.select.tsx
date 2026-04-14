import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useFetch } from "@/hooks/useFetch";

import { Skill } from "@/components/ui/skills-listing.checkbox";
import { OnboardingWorkouts } from "@/interface/user.interface";
import userServices from "@/services/user/user.services";
import { ApiResponse } from "@/interface/api-response.interface";
import { useUserOnboardingStore } from "@/stores/user-onboarding.store";





const UserWorkoutSelect = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
  data: workoutResponse,
  loading,
  error,
} = useFetch<ApiResponse<OnboardingWorkouts[]>>(
  userServices.fetchWorkouts,
  true
);

const workouts = workoutResponse?.data || [];

  const handleSelect = (id: string) => {
    setSelectedWorkout(id);
  };

  const handleNext = async () => {
    if (!selectedWorkout) {
      alert("Please select a workout");
      return;
    }

    const setFitnessProfile = useUserOnboardingStore.getState().setFitnessProfile;
    setFitnessProfile({ preferredWorkoutCategories: [selectedWorkout] });
    
    navigate("/goals"); 
  };


  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-20">
        Failed to load workouts
      </div>
    );
  }


  const mid = Math.ceil(workouts.length / 2);
  const leftColumn = workouts.slice(0, mid);
  const rightColumn = workouts.slice(mid);

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
        {/* Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-white text-3xl font-bold mb-12 text-center">
            SELECT YOUR WORKOUT
          </h1>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="space-y-4">
              {leftColumn.map((workout) => (
                <Skill
                  key={workout.id}
                  label={workout.workoutName}
                  checked={selectedWorkout === workout.id}
                  onClick={() => handleSelect(workout.id)}
                />
              ))}
            </div>

            <div className="space-y-4">
              {rightColumn.map((workout) => (
                <Skill
                  key={workout.id}
                  label={workout.workoutName}
                  checked={selectedWorkout === workout.id}
                  onClick={() => handleSelect(workout.id)}
                />
              ))}
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

            {/* STEPPER (Step 1 of 6) */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            {/* NEXT */}
            <div className="flex-1 flex justify-end">
              <button
                disabled={!selectedWorkout}
                onClick={handleNext}
                className={`border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                  selectedWorkout
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

export default UserWorkoutSelect;
