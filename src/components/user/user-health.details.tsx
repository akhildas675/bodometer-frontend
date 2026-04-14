import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card.wrapper";
import { Checkbox } from "../ui/checkbox";
import { DescribeBox } from "../ui/describe.box";
import { Radio } from "../ui/radio";
import { useUserOnboardingStore } from "@/stores/user-onboarding.store";

const UserHealthDetails = () => {
  const navigate = useNavigate();
  const { medicalProfile, setMedicalProfile } = useUserOnboardingStore();

  /* ---------- STATE ---------- */
  const [form, setForm] = useState({
    conditions: {
      hypertension: medicalProfile.medicalConditions.includes("High Blood Pressure"),
      diabetes: medicalProfile.medicalConditions.includes("Diabetes"),
      jointPain: medicalProfile.medicalConditions.includes("Joint / Back Pain"),
      heartIssue: medicalProfile.medicalConditions.includes("Heart / Breathing Issues"),
      other: medicalProfile.medicalConditions.find(c => !["High Blood Pressure", "Diabetes", "Joint / Back Pain", "Heart / Breathing Issues"].includes(c)) || "",
    },
    medications: {
      taking: medicalProfile.takingMedication || false,
      notes: medicalProfile.medications[0] || "",
    },
    injuries: {
      hasInjuries: medicalProfile.hasPastInjuries || false,
      notes: medicalProfile.pastInjuries[0] || "",
    },
    allergies: {
      hasAllergies: medicalProfile.hasAllergies || false,
      notes: medicalProfile.allergies[0] || "",
    },
  });

  /* ---------- HANDLERS ---------- */
  const toggleCondition = (key: keyof typeof form.conditions) => {
    setForm((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [key]: !prev.conditions[key],
      },
    }));
  };

  const handleRadio = (
    section: "medications" | "injuries" | "allergies",
    value: boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...(section === "medications"
          ? { taking: value }
          : section === "injuries"
          ? { hasInjuries: value }
          : { hasAllergies: value }),
      },
    }));
  };

  const handleNotes = (
    section: "conditions" | "medications" | "injuries" | "allergies",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...(section === "conditions" ? { other: value } : { notes: value }),
      },
    }));
  };

  /* ---------- NEXT ---------- */
  const handleNext = () => {
    const medicalConditions: string[] = [];
    if (form.conditions.hypertension) medicalConditions.push("High Blood Pressure");
    if (form.conditions.diabetes) medicalConditions.push("Diabetes");
    if (form.conditions.jointPain) medicalConditions.push("Joint / Back Pain");
    if (form.conditions.heartIssue) medicalConditions.push("Heart / Breathing Issues");
    if (form.conditions.other) medicalConditions.push(form.conditions.other);

    setMedicalProfile({
      hasMedicalConditions: medicalConditions.length > 0,
      medicalConditions,
      takingMedication: form.medications.taking,
      medications: form.medications.taking && form.medications.notes ? [form.medications.notes] : [],
      hasPastInjuries: form.injuries.hasInjuries,
      pastInjuries: form.injuries.hasInjuries && form.injuries.notes ? [form.injuries.notes] : [],
      hasAllergies: form.allergies.hasAllergies,
      allergies: form.allergies.hasAllergies && form.allergies.notes ? [form.allergies.notes] : [],
      bloodPressure: "",
      clearanceFromDoctor: true,
    });

    console.log("Health Data Saved");
    navigate("/daily-habits");
  };

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
          <h1 className="text-white text-3xl font-bold mb-12 text-center">
            BASIC <span className="text-purple-400">HEALTH</span> DETAILS
          </h1>

          <div className="space-y-6">
            {/* CONDITIONS */}
            <Card title="Do you have any medical conditions?">
              <Checkbox
                label="High Blood Pressure"
                checked={form.conditions.hypertension}
                onChange={() => toggleCondition("hypertension")}
              />
              <Checkbox
                label="Diabetes"
                checked={form.conditions.diabetes}
                onChange={() => toggleCondition("diabetes")}
              />
              <Checkbox
                label="Joint / Back Pain"
                checked={form.conditions.jointPain}
                onChange={() => toggleCondition("jointPain")}
              />
              <Checkbox
                label="Heart / Breathing Issues"
                checked={form.conditions.heartIssue}
                onChange={() => toggleCondition("heartIssue")}
              />
              <DescribeBox
                value={form.conditions.other}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleNotes("conditions", e.target.value)
                }
              />
            </Card>

            {/* MEDICATIONS */}
            <Card title="Are you currently taking any medications?">
              <Radio
                label="Yes"
                active={form.medications.taking === true}
                onClick={() => handleRadio("medications", true)}
              />
              <Radio
                label="No"
                active={form.medications.taking === false}
                onClick={() => handleRadio("medications", false)}
              />
              {form.medications.taking && (
                <DescribeBox
                  value={form.medications.notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNotes("medications", e.target.value)
                  }
                />
              )}
            </Card>

            {/* INJURIES */}
            <Card title="Any previous injuries or surgeries?">
              <Radio
                label="Yes"
                active={form.injuries.hasInjuries === true}
                onClick={() => handleRadio("injuries", true)}
              />
              <Radio
                label="No"
                active={form.injuries.hasInjuries === false}
                onClick={() => handleRadio("injuries", false)}
              />
              {form.injuries.hasInjuries && (
                <DescribeBox
                  value={form.injuries.notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNotes("injuries", e.target.value)
                  }
                />
              )}
            </Card>

            {/* ALLERGIES */}
            <Card title="Allergies (Food/Other)">
              <Radio
                label="Yes"
                active={form.allergies.hasAllergies === true}
                onClick={() => handleRadio("allergies", true)}
              />
              <Radio
                label="No"
                active={form.allergies.hasAllergies === false}
                onClick={() => handleRadio("allergies", false)}
              />
              {form.allergies.hasAllergies && (
                <DescribeBox
                  value={form.allergies.notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNotes("allergies", e.target.value)
                  }
                />
              )}
            </Card>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between mt-12">
            {/* PREVIOUS */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => navigate("/workout-history")}
                className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                ← Back
              </button>
            </div>

            {/* STEPPER (Step 5 of 6) */}
            <div className="flex gap-2">
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
                className="border-2 border-white text-white px-8 py-2 rounded-full font-semibold transition-all hover:bg-white hover:text-purple-900"
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