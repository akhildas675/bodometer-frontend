import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio } from "../ui/radio";
import userServices from "@/services/user/user.services";
import { useFetch } from "@/hooks/useFetch";
import { useUserOnboardingStore } from "@/stores/user-onboarding.store";

const formatLabel = (value: string) => {
  switch (value) {
    case "early_morning":
      return "Early Morning (5 AM – 8 AM)";
    case "late_morning":
      return "Late Morning (8 AM – 11 AM)";
    case "afternoon":
      return "Afternoon (12 PM – 4 PM)";
    case "evening":
      return "Evening (5 PM – 8 PM)";
    case "late_night":
      return "Late Night (8 PM – 11 PM)";
    case "flexible":
      return "Flexible / No Fixed Time";
    default:
      return value;
  }
};

const UserWorkoutPreferenceTime = () => {
  const { fitnessProfile, setFitnessProfile } = useUserOnboardingStore();
  const [selectedTime, setSelectedTime] = useState<string | null>(
    fitnessProfile.preferredWorkoutTime || null
  );
  const navigate = useNavigate();

  const {
    data: metadataResponse,
    loading,
    error,
  } = useFetch(userServices.getOnboardingOptions, true);

  const times: string[] = metadataResponse?.data?.preferredWorkoutTimes || [];

  const handleNext = () => {
    if (!selectedTime) {
      alert("Please select a workout time");
      return;
    }
    console.log("Selected Time:", selectedTime);
    setFitnessProfile({ preferredWorkoutTime: selectedTime });
    navigate("/workout-history");
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-20">Failed to load data</div>
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
        {/* Background orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-white text-3xl font-bold mb-4 text-center">
            WHEN{" "}
            <span className="text-purple-400">DO YOU PREFER TO WORKOUT?</span>
          </h1>

          {/* SUBTITLE */}
          <p className="text-slate-300 text-center mb-12">
            What time of day do you usually prefer for your workouts?
          </p>

          {/* OPTIONS */}
          <div className="flex flex-col gap-5 max-w-md mx-auto mb-12 border border-white/10 bg-white/5 rounded-2xl p-8 shadow-2xl">
            {times.length === 0 ? (
              <p className="text-slate-400 text-center">No options available</p>
            ) : (
              times.map((time) => (
                <Radio
                  key={time}
                  label={formatLabel(time)}
                  active={selectedTime === time}
                  onClick={() => setSelectedTime(time)}
                />
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            {/* PREVIOUS */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/goals")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER (Step 3 of 6) */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            {/* NEXT */}
            <div className="flex-1 flex justify-end">
              <button
                disabled={!selectedTime}
                onClick={handleNext}
                className={`border-2 px-8 py-2 rounded-full font-semibold transition-all ${
                  selectedTime
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

export default UserWorkoutPreferenceTime;