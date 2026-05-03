import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import userServices from "@/services/user/user.services";
import {
  BMI_PAGE_KEYS,
  FITNESS_GOALS_PAGE_KEYS,
  WORKOUT_TIME_PAGE_KEYS,
  WORKOUT_HISTORY_PAGE_KEYS,
  DAILY_HABITS_PAGE_KEYS,
  MEDICAL_PAGE_KEYS,
} from "@/constants/schema-key.constant";
import { DailyHabits, FitnessProfile, MedicalProfile, OnboardingQuestions, ProfileData, QuestionOption, WorkoutHistory } from "@/interface/user.interface";



/* ─────────────────────────────────────────────────────────────────────────────
   OPTION LOOKUP HELPER  — build value→label map from question options array
───────────────────────────────────────────────────────────────────────────── */

const buildLookup = (options: QuestionOption[]): Record<string, string> =>
  options.reduce<Record<string, string>>((acc, o) => {
    acc[o.value] = o.label;
    return acc;
  }, {});

const labelOf = (lookup: Record<string, string>, value: string) =>
  lookup[value] ?? value;

const labelsOf = (lookup: Record<string, string>, values: string[]) =>
  values.map((v) => lookup[v] ?? v);

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL UI PRIMITIVES
───────────────────────────────────────────────────────────────────────────── */

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { label: "Normal weight", color: "text-green-400" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
  return { label: "Obese", color: "text-red-400" };
};

const Pill = ({
  label,
  color = "purple",
}: {
  label: string;
  color?: "purple" | "teal" | "blue";
}) => {
  const styles = {
    purple: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    teal: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
    blue: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  };
  return (
    <span className={`inline-block text-xs px-3 py-1 rounded-full mr-1 mb-1 ${styles[color]}`}>
      {label}
    </span>
  );
};

const YesNo = ({ value }: { value: boolean }) => (
  <span className={value ? "text-green-400" : "text-white/50"}>{value ? "Yes" : "No"}</span>
);

const FieldRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">{label}</span>
    <div className="text-white text-sm font-medium">{children}</div>
  </div>
);

/* Single-select pill group — built from QuestionOption[] */
const PickOne = ({
  options,
  value,
  onChange,
}: {
  options: QuestionOption[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
          value === opt.value
            ? "border-purple-500 bg-purple-500/20 text-purple-300"
            : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

/* Multi-select pill group */
const PickMany = ({
  options,
  value,
  onChange,
}: {
  options: QuestionOption[];
  value: string[];
  onChange: (v: string[]) => void;
}) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {options.map((opt) => {
      const active = value.includes(opt.value);
      return (
        <button
          key={opt.value}
          onClick={() =>
            onChange(
              active ? value.filter((x) => x !== opt.value) : [...value, opt.value]
            )
          }
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            active
              ? "border-purple-500 bg-purple-500/20 text-purple-300"
              : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

/* Yes / No toggle */
const BoolToggle = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex bg-white/5 rounded-xl p-1 w-fit border border-white/10 mt-1">
    {(["Yes", "No"] as const).map((label) => {
      const active = label === "Yes" ? value : !value;
      return (
        <button
          key={label}
          onClick={() => onChange(label === "Yes")}
          className={`px-6 py-1.5 rounded-lg text-xs font-medium transition ${
            active ? "bg-purple-600 text-white" : "text-white/40 hover:text-white"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

/* Section card with view / edit toggle */
const Section = ({
  icon,
  title,
  subtitle,
  editMode,
  saving,
  onEdit,
  onCancel,
  onSave,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  editMode: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-base">
          {icon}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{title}</p>
          <p className="text-white/40 text-xs">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {editMode ? (
          <>
            <button
              onClick={onCancel}
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest font-semibold transition px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full border-2 border-white text-white hover:bg-white hover:text-purple-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="text-white/50 hover:text-white text-xs uppercase tracking-widest font-semibold transition px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30"
          >
            Edit
          </button>
        )}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);



const ALL_QUESTION_KEYS = [
  ...BMI_PAGE_KEYS,
  ...FITNESS_GOALS_PAGE_KEYS,
  ...WORKOUT_TIME_PAGE_KEYS,
  ...WORKOUT_HISTORY_PAGE_KEYS,
  ...DAILY_HABITS_PAGE_KEYS,
  ...MEDICAL_PAGE_KEYS,
];



const UserOnboardingProfile = () => {
  const navigate = useNavigate();

  /* ── Remote data ── */
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [questions, setQuestions] = useState<OnboardingQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Edit state ── */
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ── Draft state ── */
  const [draftFitness, setDraftFitness] = useState<FitnessProfile | null>(null);
  const [draftWorkout, setDraftWorkout] = useState<WorkoutHistory | null>(null);
  const [draftMedical, setDraftMedical] = useState<MedicalProfile | null>(null);
  const [draftHabits, setDraftHabits] = useState<DailyHabits | null>(null);


  useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);

      const [profileRes, questionsRes] = await Promise.all([
        userServices.getOnboardingProfile(),
        userServices.userOnboardingQuestions({
          keys: ALL_QUESTION_KEYS
        }),
      ]);
console.log("onboarding Profile response ",profileRes)
console.log("onboarding Question response ",questionsRes)

    } catch {
      setError("Failed to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  /* ── Helper: find a question by key ── */
  const q = (key: string): OnboardingQuestions | undefined =>
    questions.find((item) => item.key === key);

  /* ── Pre-built option lookup maps (memoised) ── */
  const lookups = useMemo(() => {
    const get = (key: string) => buildLookup(q(key)?.options ?? []);
    return {
      workoutTime: get("preferred_workout_time"),
      experienceDuration: get("experience_duration"),
      strengthLevel: get("strength_level"),
      consistencyLevel: get("consistency_level"),
      weeklyTrainingDays: get("weekly_training_days"),
      avgSessionDuration: get("avg_session_duration"),
      goalIntensity: get("goal_intensity"),
      trainingTypes: get("training_types"),
      fitnessGoals: get("fitness_goals"),
    };
 
  }, [questions]);


  const openEdit = (section: string) => {
    if (!profile) return;
    setEditing(section);
    if (section === "fitness") setDraftFitness({ ...profile.fitnessProfile });
    if (section === "workout") setDraftWorkout({ ...profile.workoutHistory });
    if (section === "medical")
      setDraftMedical({
        ...profile.medicalProfile,
        conditions: { ...profile.medicalProfile.conditions },
        medications: { ...profile.medicalProfile.medications },
        injuries: { ...profile.medicalProfile.injuries },
        allergies: { ...profile.medicalProfile.allergies },
      });
    if (section === "habits") setDraftHabits({ ...profile.dailyHabits });
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraftFitness(null);
    setDraftWorkout(null);
    setDraftMedical(null);
    setDraftHabits(null);
  };


  const saveSection = async (section: string) => {
    setSaving(true);
    try {
      if (section === "fitness" && draftFitness) {
        await userServices.updateFitnessProfile(draftFitness);
        setProfile((p) => p && { ...p, fitnessProfile: draftFitness });
      }
      if (section === "workout" && draftWorkout) {
        await userServices.updateWorkoutHistory(draftWorkout);
        setProfile((p) => p && { ...p, workoutHistory: draftWorkout });
      }
      if (section === "medical" && draftMedical) {
        await userServices.updateMedicalProfile(draftMedical);
        setProfile((p) => p && { ...p, medicalProfile: draftMedical });
      }
      if (section === "habits" && draftHabits) {
        await userServices.updateDailyHabits(draftHabits);
        setProfile((p) => p && { ...p, dailyHabits: draftHabits });
      }
      cancelEdit();
    } catch {
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading / error ── */
  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-white text-center">Loading your profile…</div>
      </div>
    );

  if (error || !profile)
    return (
      <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
        <div className="text-red-400 text-center">{error}</div>
      </div>
    );

  const { fitnessProfile, workoutHistory, medicalProfile, dailyHabits } = profile;
  const bmiCat = getBMICategory(medicalProfile.bmi);
  const bmiPos = Math.min(Math.max(((medicalProfile.bmi - 10) / 30) * 100, 0), 100);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#03000D] to-[#190473] flex flex-col items-center p-8">
      {/* TOP BAR */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <img
          src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/Bodometer+Logo+corrected+1.png"
          alt="Bodometer"
          className="h-10 object-contain"
        />
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold"
        >
          ← Dashboard
        </button>
      </div>

      <div className="max-w-4xl w-full relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-white tracking-wide">
              YOUR <span className="text-purple-400">PROFILE</span>
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Review and update your onboarding answers at any time.
            </p>
          </div>

          {/* ── 1. BODY METRICS ── */}
          <Section
            icon="⚖️"
            title="Body metrics"
            subtitle="Height, weight & BMI"
            editMode={editing === "medical"}
            saving={saving}
            onEdit={() => openEdit("medical")}
            onCancel={cancelEdit}
            onSave={() => saveSection("medical")}
          >
            {editing === "medical" && draftMedical ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-2">
                      {q("height_cm")?.question ?? "Height (cm)"}
                    </label>
                    <input
                      type="number"
                      value={draftMedical.heightCm}
                      onChange={(e) =>
                        setDraftMedical((d) => d && { ...d, heightCm: Number(e.target.value) })
                      }
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-2">
                      {q("weight_kg")?.question ?? "Weight (kg)"}
                    </label>
                    <input
                      type="number"
                      value={draftMedical.weightKg}
                      onChange={(e) =>
                        setDraftMedical((d) => d && { ...d, weightKg: Number(e.target.value) })
                      }
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* conditions — each question fetched from backend */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">
                    Medical conditions
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      [
                        { key: "has_hypertension", field: "hypertension" },
                        { key: "has_diabetes",     field: "diabetes" },
                        { key: "has_joint_pain",   field: "jointPain" },
                        { key: "has_heart_issue",  field: "heartIssue" },
                      ] as const
                    ).map(({ key, field }) => (
                      <div key={key}>
                        <label className="text-white/60 text-xs block mb-1">
                          {q(key)?.question ?? key}
                        </label>
                        <BoolToggle
                          value={draftMedical.conditions[field]}
                          onChange={(v) =>
                            setDraftMedical((d) =>
                              d && { ...d, conditions: { ...d.conditions, [field]: v } }
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs block mb-1">
                      {q("has_injuries")?.question ?? "Injuries"}
                    </label>
                    <BoolToggle
                      value={draftMedical.injuries.hasInjuries}
                      onChange={(v) =>
                        setDraftMedical((d) =>
                          d && { ...d, injuries: { ...d.injuries, hasInjuries: v } }
                        )
                      }
                    />
                    {draftMedical.injuries.hasInjuries && (
                      <textarea
                        value={draftMedical.injuries.notes}
                        onChange={(e) =>
                          setDraftMedical((d) =>
                            d && { ...d, injuries: { ...d.injuries, notes: e.target.value } }
                          )
                        }
                        placeholder="Describe your injuries…"
                        rows={2}
                        className="mt-2 w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-white/60 text-xs block mb-1">
                      {q("has_allergies")?.question ?? "Allergies"}
                    </label>
                    <BoolToggle
                      value={draftMedical.allergies.hasAllergies}
                      onChange={(v) =>
                        setDraftMedical((d) =>
                          d && { ...d, allergies: { ...d.allergies, hasAllergies: v } }
                        )
                      }
                    />
                    {draftMedical.allergies.hasAllergies && (
                      <textarea
                        value={draftMedical.allergies.notes}
                        onChange={(e) =>
                          setDraftMedical((d) =>
                            d && { ...d, allergies: { ...d.allergies, notes: e.target.value } }
                          )
                        }
                        placeholder="Describe your allergies…"
                        rows={2}
                        className="mt-2 w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <FieldRow label="Height">{medicalProfile.heightCm} cm</FieldRow>
                  <FieldRow label="Weight">{medicalProfile.weightKg} kg</FieldRow>
                  <FieldRow label="BMI">
                    <span className={bmiCat.color}>
                      {medicalProfile.bmi} — {bmiCat.label}
                    </span>
                  </FieldRow>
                </div>
                <div>
                  <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-purple-500"
                      style={{ left: `calc(${bmiPos}% - 6px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-1">
                    <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-1">
                  <FieldRow label="Hypertension"><YesNo value={medicalProfile.conditions.hypertension} /></FieldRow>
                  <FieldRow label="Diabetes"><YesNo value={medicalProfile.conditions.diabetes} /></FieldRow>
                  <FieldRow label="Joint pain"><YesNo value={medicalProfile.conditions.jointPain} /></FieldRow>
                  <FieldRow label="Heart issue"><YesNo value={medicalProfile.conditions.heartIssue} /></FieldRow>
                  <FieldRow label="Injuries">
                    <YesNo value={medicalProfile.injuries.hasInjuries} />
                    {medicalProfile.injuries.hasInjuries && medicalProfile.injuries.notes && (
                      <p className="text-white/40 text-xs mt-1">{medicalProfile.injuries.notes}</p>
                    )}
                  </FieldRow>
                  <FieldRow label="Allergies">
                    <YesNo value={medicalProfile.allergies.hasAllergies} />
                    {medicalProfile.allergies.hasAllergies && medicalProfile.allergies.notes && (
                      <p className="text-white/40 text-xs mt-1">{medicalProfile.allergies.notes}</p>
                    )}
                  </FieldRow>
                </div>
              </div>
            )}
          </Section>

          {/* ── 2. FITNESS PROFILE ── */}
          <Section
            icon="🎯"
            title="Fitness profile"
            subtitle="Goals & preferred workout time"
            editMode={editing === "fitness"}
            saving={saving}
            onEdit={() => openEdit("fitness")}
            onCancel={cancelEdit}
            onSave={() => saveSection("fitness")}
          >
            {editing === "fitness" && draftFitness ? (
              <div className="space-y-5">
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-1">
                    {q("fitness_goals")?.question ?? "Fitness goals"}
                  </label>
                  <PickMany
                    options={q("fitness_goals")?.options ?? []}
                    value={draftFitness.fitnessGoals}
                    onChange={(v) => setDraftFitness((d) => d && { ...d, fitnessGoals: v })}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-1">
                    {q("preferred_workout_time")?.question ?? "Preferred workout time"}
                  </label>
                  <PickOne
                    options={q("preferred_workout_time")?.options ?? []}
                    value={draftFitness.preferredWorkoutTime}
                    onChange={(v) =>
                      setDraftFitness((d) => d && { ...d, preferredWorkoutTime: v })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Fitness goals">
                  <div className="mt-1">
                    {labelsOf(lookups.fitnessGoals, fitnessProfile.fitnessGoals).map((label) => (
                      <Pill key={label} label={label} color="purple" />
                    ))}
                  </div>
                </FieldRow>
                <FieldRow label="Preferred workout time">
                  {labelOf(lookups.workoutTime, fitnessProfile.preferredWorkoutTime)}
                </FieldRow>
              </div>
            )}
          </Section>

          {/* ── 3. WORKOUT HISTORY ── */}
          <Section
            icon="📋"
            title="Workout history"
            subtitle="Experience, training types & intensity"
            editMode={editing === "workout"}
            saving={saving}
            onEdit={() => openEdit("workout")}
            onCancel={cancelEdit}
            onSave={() => saveSection("workout")}
          >
            {editing === "workout" && draftWorkout ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  {(
                    [
                      { key: "experience_duration", field: "experienceDuration" },
                      { key: "strength_level",       field: "strengthLevel" },
                      { key: "consistency_level",    field: "consistencyLevel" },
                      { key: "weekly_training_days", field: "weeklyTrainingDays" },
                      { key: "avg_session_duration", field: "avgSessionDuration" },
                      { key: "goal_intensity",       field: "goalIntensity" },
                    ] as const
                  ).map(({ key, field }) => (
                    <div key={key}>
                      <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-1">
                        {q(key)?.question ?? key}
                      </label>
                      <PickOne
                        options={q(key)?.options ?? []}
                        value={draftWorkout[field]}
                        onChange={(v) =>
                          setDraftWorkout((d) => d && { ...d, [field]: v })
                        }
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-1">
                      {q("trained_with_coach")?.question ?? "Trained with coach?"}
                    </label>
                    <BoolToggle
                      value={draftWorkout.trainedWithCoach}
                      onChange={(v) =>
                        setDraftWorkout((d) => d && { ...d, trainedWithCoach: v })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-1">
                    {q("training_types")?.question ?? "Training types"}
                  </label>
                  <PickMany
                    options={q("training_types")?.options ?? []}
                    value={draftWorkout.trainingTypes}
                    onChange={(v) =>
                      setDraftWorkout((d) => d && { ...d, trainingTypes: v })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Experience">
                  {labelOf(lookups.experienceDuration, workoutHistory.experienceDuration)}
                </FieldRow>
                <FieldRow label="Strength level">
                  {labelOf(lookups.strengthLevel, workoutHistory.strengthLevel)}
                </FieldRow>
                <FieldRow label="Trained with coach">
                  <YesNo value={workoutHistory.trainedWithCoach} />
                </FieldRow>
                <FieldRow label="Consistency">
                  {labelOf(lookups.consistencyLevel, workoutHistory.consistencyLevel)}
                </FieldRow>
                <FieldRow label="Days per week">
                  {labelOf(lookups.weeklyTrainingDays, workoutHistory.weeklyTrainingDays)}
                </FieldRow>
                <FieldRow label="Session duration">
                  {labelOf(lookups.avgSessionDuration, workoutHistory.avgSessionDuration)}
                </FieldRow>
                <FieldRow label="Goal intensity">
                  {labelOf(lookups.goalIntensity, workoutHistory.goalIntensity)}
                </FieldRow>
                <FieldRow label="Training types">
                  <div className="mt-1">
                    {labelsOf(lookups.trainingTypes, workoutHistory.trainingTypes).map((label) => (
                      <Pill key={label} label={label} color="blue" />
                    ))}
                  </div>
                </FieldRow>
              </div>
            )}
          </Section>

          {/* ── 4. DAILY HABITS ── */}
          <Section
            icon="🌿"
            title="Daily habits"
            subtitle="Sleep, meals, hydration & lifestyle"
            editMode={editing === "habits"}
            saving={saving}
            onEdit={() => openEdit("habits")}
            onCancel={cancelEdit}
            onSave={() => saveSection("habits")}
          >
            {editing === "habits" && draftHabits ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* time fields — fetched question label used */}
                  {(
                    [
                      { key: "wake_up_time", field: "wakeUpTime", type: "time" },
                      { key: "sleep_time",   field: "sleepTime",  type: "time" },
                    ] as const
                  ).map(({ key, field, type }) => (
                    <div key={key}>
                      <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-2">
                        {q(key)?.question ?? key}
                      </label>
                      <input
                        type={type}
                        value={String(draftHabits[field])}
                        onChange={(e) =>
                          setDraftHabits((d) => d && { ...d, [field]: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}

                  {/* number stepper fields */}
                  {(
                    [
                      { key: "meals_per_day",    field: "mealsPerDay",      min: 1,  max: 10,  step: 1   },
                      { key: "avg_water_liters", field: "avgWaterLiters",   min: 0,  max: 10,  step: 0.1 },
                      { key: "avg_daily_steps",  field: "avgDailySteps",    min: 0,  max: 50000, step: 500 },
                    ] as const
                  ).map(({ key, field, min, max, step }) => (
                    <div key={key}>
                      <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-2">
                        {q(key)?.question ?? key}
                      </label>
                      <input
                        type="number"
                        min={q(key)?.config?.min ?? min}
                        max={q(key)?.config?.max ?? max}
                        step={q(key)?.config?.step ?? step}
                        value={Number(draftHabits[field])}
                        onChange={(e) =>
                          setDraftHabits((d) => d && { ...d, [field]: Number(e.target.value) })
                        }
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      { key: "uses_caffeine", field: "caffeine" },
                      { key: "uses_alcohol",  field: "alcohol" },
                    ] as const
                  ).map(({ key, field }) => (
                    <div key={key}>
                      <label className="text-white/40 text-xs uppercase tracking-widest font-semibold block mb-1">
                        {q(key)?.question ?? key}
                      </label>
                      <BoolToggle
                        value={draftHabits[field]}
                        onChange={(v) =>
                          setDraftHabits((d) => d && { ...d, [field]: v })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <FieldRow label="Wake up">{dailyHabits.wakeUpTime}</FieldRow>
                <FieldRow label="Sleep time">{dailyHabits.sleepTime}</FieldRow>
                <FieldRow label="Meals per day">{dailyHabits.mealsPerDay}</FieldRow>
                <FieldRow label="Water intake">{dailyHabits.avgWaterLiters} L</FieldRow>
                <FieldRow label="Daily steps">{dailyHabits.avgDailySteps.toLocaleString()}</FieldRow>
                <FieldRow label="Caffeine"><YesNo value={dailyHabits.caffeine} /></FieldRow>
                <FieldRow label="Alcohol"><YesNo value={dailyHabits.alcohol} /></FieldRow>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default UserOnboardingProfile;