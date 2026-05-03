import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio } from "../ui/radio";

import userServices from "@/services/user/user.services";
import { useFetch } from "@/hooks/useFetch";
import { ApiResponse } from "@/interface/api-response.interface";
import { OnboardingQuestion } from "@/interface/onboarding.interface";
import { WORKOUT_TIME_PAGE_KEYS } from "@/constants/schema-key.constant";
import { useOnboardingStore } from "@/stores/user-onboarding.store";

/* ---------- TYPES ---------- */

interface QuestionOption {
  label: string;
  value: string;
  _id?: string;
}

const UserWorkoutPreferenceTime = () => {
  const fitnessProfile = useOnboardingStore((state) => state.fitnessProfile);
  const setPreferredWorkoutTime = useOnboardingStore(
    (state) => state.setPreferredWorkoutTime,
  );
  const markWorkoutTimeDone = useOnboardingStore(
    (state) => state.markWorkoutTimeDone,
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    fitnessProfile.preferredWorkoutTime,
  );

  const navigate = useNavigate();

  const { data: questionsRes, loading } = useFetch<
    ApiResponse<OnboardingQuestion[]>
  >(
    () =>
      userServices.userOnboardingQuestions({
        keys: WORKOUT_TIME_PAGE_KEYS,
      }),
    true,
  );
  

  const questions: OnboardingQuestion[] = questionsRes?.success
    ? questionsRes.data
    : [];

  const timeQuestion = questions.find(
    (q) => q.key === "preferred_workout_time",
  );

  const times: QuestionOption[] = timeQuestion?.options ?? [];

  const handleNext = (): void => {
    if (!selectedTime) {
      alert("Please select workout time");
      return;
    }

    setPreferredWorkoutTime(selectedTime);
    markWorkoutTimeDone();

    navigate("/workout-history");
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
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
        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-white text-3xl font-bold mb-4 text-center uppercase">
            {timeQuestion?.question ?? "When do you prefer to work out?"}
          </h1>

          {/* OPTIONS */}
          <div className="flex flex-col gap-5 max-w-md mx-auto mb-12 border border-white/10 bg-white/5 rounded-2xl p-8">
            {times.map((time) => (
              <Radio
                key={time.value}
                label={time.label}
                active={selectedTime === time.value}
                onClick={() => setSelectedTime(time.value)}
              />
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            {/* BACK */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/fitness-level")}
                className="text-white/50"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
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
                className={`border-2 px-8 py-2 rounded-full ${
                  selectedTime
                    ? "border-white text-white"
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
