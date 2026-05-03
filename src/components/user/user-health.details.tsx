import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "../ui/card.wrapper";
import { Radio } from "../ui/radio";
import { DescribeBox } from "../ui/describe.box";

import { useFetch } from "@/hooks/useFetch";
import { ApiResponse } from "@/interface/api-response.interface";
import { OnboardingQuestion } from "@/interface/user.interface";
import userServices from "@/services/user/user.services";
import { MEDICAL_PAGE_KEYS } from "@/constants/schema-key.constant";
import { useOnboardingStore } from "@/stores/user-onboarding.store";

type FormType = Record<string, string | boolean>;

const UserHealthDetails = () => {
  const navigate = useNavigate();

const medicalProfile = useOnboardingStore((state) => state.medicalProfile);

  const [form, setForm] = useState<FormType>({
  has_hypertension: medicalProfile.conditions.hypertension,
  has_diabetes:     medicalProfile.conditions.diabetes,
  has_joint_pain:   medicalProfile.conditions.jointPain,
  has_heart_issue:  medicalProfile.conditions.heartIssue,
  has_injuries:     medicalProfile.injuries.hasInjuries,
  has_injuries_notes: medicalProfile.injuries.notes,
  has_allergies:    medicalProfile.allergies.hasAllergies,
  has_allergies_notes: medicalProfile.allergies.notes,
});

  const setConditions = useOnboardingStore((state) => state.setConditions);
  const setInjuries = useOnboardingStore((state) => state.setInjuries);
  const setAllergies = useOnboardingStore((state) => state.setAllergies);
  const markMedicalDone = useOnboardingStore((state) => state.markMedicalDone);


  const { data: questionsRes, loading } =
    useFetch<ApiResponse<OnboardingQuestion[]>>(
      () => userServices.userOnboardingQuestions({ keys: MEDICAL_PAGE_KEYS }),
      true
    );


  const questions = questionsRes?.success ? questionsRes.data : [];

  const handleValueChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setConditions({
      hypertension: form.has_hypertension === true,
      diabetes: form.has_diabetes === true,
      jointPain: form.has_joint_pain === true,
      heartIssue: form.has_heart_issue === true,
    });

    setInjuries({
      hasInjuries: form.has_injuries === true,
      notes: String(form.has_injuries_notes || ""),
    });

    setAllergies({
      hasAllergies: form.has_allergies === true,
      notes: String(form.has_allergies_notes || ""),
    });

    markMedicalDone();
    navigate("/daily-habits");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-white text-center">Loading...</div>
      </div>
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
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-wide">
            BASIC <span className="text-purple-400">HEALTH</span> DETAILS
          </h1>
          <p className="text-white/50 mb-8 text-sm">
            Help us understand your health so we can keep your plan safe and effective.
          </p>

          {/* QUESTIONS */}
          <div className="space-y-4 mb-12">
            {questions.map((q) => (
              <Card key={q.key} title={q.question}>
                {/* YES / NO */}
                <div className="flex gap-4">
                  <Radio
                    label="Yes"
                    active={form[q.key] === true}
                    onClick={() => handleValueChange(q.key, true)}
                  />
                  <Radio
                    label="No"
                    active={form[q.key] === false}
                    onClick={() => handleValueChange(q.key, false)}
                  />
                </div>

                {/* FOLLOW UP */}
                {q.followUp && form[q.key] === true && (
                  <div className="mt-4">
                    <DescribeBox
                      value={String(form[`${q.key}_notes`] || "")}
                      onChange={(e) =>
                        handleValueChange(`${q.key}_notes`, e.target.value)
                      }
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            {/* BACK */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/workout-history")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER dots */}
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>

            {/* NEXT */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleNext}
                className="border-2 border-white text-white px-8 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-900 transition-all"
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

export default UserHealthDetails;