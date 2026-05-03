import { create } from "zustand";


interface MedicalConditions {
  hypertension: boolean;
  diabetes: boolean;
  jointPain: boolean;
  heartIssue: boolean;
  other: string;
}

interface MedicalMedications {
  taking: boolean;
  notes: string;
}

interface MedicalInjuries {
  hasInjuries: boolean;
  notes: string;
}

interface MedicalAllergies {
  hasAllergies: boolean;
  notes: string;
}

// Layer 1 — matches IUserFitnessProfile
export interface FitnessProfileData {
  preferredWorkout: string[];       
  fitnessGoals: string[];
  preferredWorkoutTime: string;
  fitnessLevel: string;
}

// Layer 1 — matches IUserWorkoutHistory
export interface WorkoutHistoryData {
  experienceDuration: string;
  strengthLevel: string;
  trainedWithCoach: boolean;
  trainingTypes: string[];
  consistencyLevel: string;
  weeklyTrainingDays: string;
  avgSessionDuration: string;
  goalIntensity: string;
}

// Layer 1 — matches IUserMedicalProfile
export interface MedicalProfileData {
  conditions: MedicalConditions;
  medications: MedicalMedications;
  injuries: MedicalInjuries;
  allergies: MedicalAllergies;
  bmi: number;
  heightCm: number;
  weightKg: number;
}

// Layer 1 — matches IUserDailyHabits
export interface DailyHabitsData {
  wakeUpTime: string;
  sleepTime: string;
  mealsPerDay: number;
  avgWaterLiters: number;
  avgDailySteps: number;
  caffeine: boolean;
  alcohol: boolean;
}

// Full onboarding submit payload
export interface OnboardingSubmitPayload {
  fitnessProfile: FitnessProfileData;
  workoutHistory: WorkoutHistoryData;
  medicalProfile: MedicalProfileData;
  dailyHabits: DailyHabitsData;
}

// Track which pages are completed
interface OnboardingProgress {
  bmiDone: boolean;
  dailyHabitsDone: boolean;
  fitnessGoalsDone: boolean;
  fitnessLevelDone: boolean;
  workoutTimeDone: boolean;
  workoutCategoryDone: boolean;
  workoutHistoryDone: boolean;
  medicalDone: boolean;
}

// Store State

interface OnboardingState {
  // Data
  fitnessProfile: FitnessProfileData;
  workoutHistory: WorkoutHistoryData;
  medicalProfile: MedicalProfileData;
  dailyHabits: DailyHabitsData;
  progress: OnboardingProgress;

  // Fitness Profile
  setFitnessGoals: (goals: string[]) => void;
  setFitnessLevel: (level: string) => void;
  setPreferredWorkoutTime: (time: string) => void;
  setPreferredWorkout: (ids: string[]) => void;

  // Workout History 
  setExperienceDuration: (value: string) => void;
  setStrengthLevel: (value: string) => void;
  setTrainedWithCoach: (value: boolean) => void;
  setTrainingTypes: (value: string[]) => void;
  setConsistencyLevel: (value: string) => void;
  setWeeklyTrainingDays: (value: string) => void;
  setAvgSessionDuration: (value: string) => void;
  setGoalIntensity: (value: string) => void;

  // Medical Profile
  setBmi: (bmi: number, heightCm: number, weightKg: number) => void;
  setConditions: (conditions: Partial<MedicalConditions>) => void;
  setMedications: (medications: Partial<MedicalMedications>) => void;
  setInjuries: (injuries: Partial<MedicalInjuries>) => void;
  setAllergies: (allergies: Partial<MedicalAllergies>) => void;

  // Daily Habits
  setWakeUpTime: (value: string) => void;
  setSleepTime: (value: string) => void;
  setMealsPerDay: (value: number) => void;
  setAvgWaterLiters: (value: number) => void;
  setAvgDailySteps: (value: number) => void;
  setCaffeine: (value: boolean) => void;
  setAlcohol: (value: boolean) => void;

  // Progress 
  markBmiDone: () => void;
  markDailyHabitsDone: () => void;
  markFitnessGoalsDone: () => void;
  markFitnessLevelDone: () => void;
  markWorkoutTimeDone: () => void;
  markWorkoutCategoryDone: () => void;
  markWorkoutHistoryDone: () => void;
  markMedicalDone: () => void;


  getSubmitPayload: () => OnboardingSubmitPayload;
  isOnboardingComplete: () => boolean;
  resetStore: () => void;
}



const initialFitnessProfile: FitnessProfileData = {
  preferredWorkout: [],
  fitnessGoals: [],
  preferredWorkoutTime: "",
  fitnessLevel: "",
};

const initialWorkoutHistory: WorkoutHistoryData = {
  experienceDuration: "",
  strengthLevel: "",
  trainedWithCoach: false,
  trainingTypes: [],
  consistencyLevel: "",
  weeklyTrainingDays: "",
  avgSessionDuration: "",
  goalIntensity: "",
};

const initialMedicalProfile: MedicalProfileData = {
  conditions: {
    hypertension: false,
    diabetes: false,
    jointPain: false,
    heartIssue: false,
    other: "",
  },
  medications: {
    taking: false,
    notes: "",
  },
  injuries: {
    hasInjuries: false,
    notes: "",
  },
  allergies: {
    hasAllergies: false,
    notes: "",
  },
  bmi: 0,
  heightCm: 0,
  weightKg: 0,
};

const initialDailyHabits: DailyHabitsData = {
  wakeUpTime: "",
  sleepTime: "",
  mealsPerDay: 0,
  avgWaterLiters: 0,
  avgDailySteps: 0,
  caffeine: false,
  alcohol: false,
};

const initialProgress: OnboardingProgress = {
  bmiDone: false,
  dailyHabitsDone: false,
  fitnessGoalsDone: false,
  fitnessLevelDone: false,
  workoutTimeDone: false,
  workoutCategoryDone: false,
  workoutHistoryDone: false,
  medicalDone: false,
};

// Store

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  fitnessProfile: initialFitnessProfile,
  workoutHistory: initialWorkoutHistory,
  medicalProfile: initialMedicalProfile,
  dailyHabits: initialDailyHabits,
  progress: initialProgress,

  // FITNESS PROFILE
  setFitnessGoals: (goals) =>
    set((state) => ({
      fitnessProfile: { ...state.fitnessProfile, fitnessGoals: goals },
    })),
    

  setFitnessLevel: (level) =>
    set((state) => ({
      fitnessProfile: { ...state.fitnessProfile, fitnessLevel: level },
    })),

  setPreferredWorkoutTime: (time) =>
    set((state) => ({
      fitnessProfile: { ...state.fitnessProfile, preferredWorkoutTime: time },
    })),

  setPreferredWorkout: (ids) =>
    set((state) => ({
      fitnessProfile: { ...state.fitnessProfile, preferredWorkout: ids },
    })),


  setExperienceDuration: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, experienceDuration: value },
    })),

  setStrengthLevel: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, strengthLevel: value },
    })),

  setTrainedWithCoach: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, trainedWithCoach: value },
    })),

  setTrainingTypes: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, trainingTypes: value },
    })),

  setConsistencyLevel: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, consistencyLevel: value },
    })),

  setWeeklyTrainingDays: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, weeklyTrainingDays: value },
    })),

  setAvgSessionDuration: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, avgSessionDuration: value },
    })),

  setGoalIntensity: (value) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, goalIntensity: value },
    })),

  // ─── MEDICAL PROFILE 
  setBmi: (bmi, heightCm, weightKg) =>
    set((state) => ({
      medicalProfile: { ...state.medicalProfile, bmi, heightCm, weightKg },
    })),

  setConditions: (conditions) =>
    set((state) => ({
      medicalProfile: {
        ...state.medicalProfile,
        conditions: { ...state.medicalProfile.conditions, ...conditions },
      },
    })),

  setMedications: (medications) =>
    set((state) => ({
      medicalProfile: {
        ...state.medicalProfile,
        medications: { ...state.medicalProfile.medications, ...medications },
      },
    })),

  setInjuries: (injuries) =>
    set((state) => ({
      medicalProfile: {
        ...state.medicalProfile,
        injuries: { ...state.medicalProfile.injuries, ...injuries },
      },
    })),

  setAllergies: (allergies) =>
    set((state) => ({
      medicalProfile: {
        ...state.medicalProfile,
        allergies: { ...state.medicalProfile.allergies, ...allergies },
      },
    })),

  // ─── DAILY HABITS ──────────────────────────────────────────────────────────
  setWakeUpTime: (value) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, wakeUpTime: value },
    })),

  setSleepTime: (value) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, sleepTime: value },
    })),

  setMealsPerDay: (value) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, mealsPerDay: value },
    })),

  setAvgWaterLiters: (value) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, avgWaterLiters: value },
    })),

  setAvgDailySteps: (value) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, avgDailySteps: value },
    })),

  setCaffeine: (value) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, caffeine: value },
    })),

  setAlcohol: (value) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, alcohol: value },
    })),


  markBmiDone:           () => set((state) => ({ progress: { ...state.progress, bmiDone: true } })),
  markDailyHabitsDone:   () => set((state) => ({ progress: { ...state.progress, dailyHabitsDone: true } })),
  markFitnessGoalsDone:  () => set((state) => ({ progress: { ...state.progress, fitnessGoalsDone: true } })),
  markFitnessLevelDone: () =>  set((state) => ({ progress: { ...state.progress, fitnessLevelDone: true } })),
  markWorkoutTimeDone:   () => set((state) => ({ progress: { ...state.progress, workoutTimeDone: true } })),
  markWorkoutCategoryDone: () => set((state) => ({ progress: { ...state.progress, workoutCategoryDone: true } })),
  markWorkoutHistoryDone:() => set((state) => ({ progress: { ...state.progress, workoutHistoryDone: true } })),
  markMedicalDone:       () => set((state) => ({ progress: { ...state.progress, medicalDone: true } })),


  getSubmitPayload: (): OnboardingSubmitPayload => {
    const { fitnessProfile, workoutHistory, medicalProfile, dailyHabits } = get();
    return { fitnessProfile, workoutHistory, medicalProfile, dailyHabits };
  },

  isOnboardingComplete: (): boolean => {
    const { progress } = get();
    return (
      progress.bmiDone &&
      progress.dailyHabitsDone &&
      progress.fitnessGoalsDone &&
      progress.fitnessLevelDone && 
      progress.workoutTimeDone &&
      progress.workoutCategoryDone &&
      progress.workoutHistoryDone &&
      progress.medicalDone
    );
  },

  resetStore: () =>
    set({
      fitnessProfile: initialFitnessProfile,
      workoutHistory: initialWorkoutHistory,
      medicalProfile: initialMedicalProfile,
      dailyHabits: initialDailyHabits,
      progress: initialProgress,
    }),
}));