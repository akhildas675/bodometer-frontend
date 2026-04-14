import { create } from "zustand";

interface FitnessProfileData {
  fitnessGoals: string[];
  preferredWorkoutTime: string;
  preferredWorkoutCategories: string[];
}

interface WorkoutHistoryData {
  experienceDuration: string;
  strengthLevel: string;
  trainedWithCoach: boolean | null;
  trainingTypes: string[];
  consistencyLevel: string;
  weeklyTrainingDays: string;
  avgSessionDuration: string;
  goalIntensity: string;
}

interface MedicalProfileData {
  hasMedicalConditions: boolean | null;
  medicalConditions: string[];
  hasPastInjuries: boolean | null;
  pastInjuries: string[];
  hasAllergies: boolean | null;
  allergies: string[];
  takingMedication: boolean | null;
  medications: string[];
  bloodPressure: string;
  clearanceFromDoctor: boolean | null;
}

interface DailyHabitsData {
  dietPreference: string;
  dailyMeals: string;
  waterIntake: string;
  sleepDuration: string;
  stressLevel: string;
  workType: string;
  smokingDrinking: string;
}

interface UserOnboardingState {
  fitnessProfile: FitnessProfileData;
  workoutHistory: WorkoutHistoryData;
  medicalProfile: MedicalProfileData;
  dailyHabits: DailyHabitsData;

  setFitnessProfile: (data: Partial<FitnessProfileData>) => void;
  setWorkoutHistory: (data: Partial<WorkoutHistoryData>) => void;
  setMedicalProfile: (data: Partial<MedicalProfileData>) => void;
  setDailyHabits: (data: Partial<DailyHabitsData>) => void;
  resetOnboarding: () => void;
}

const initialState = {
  fitnessProfile: {
    fitnessGoals: [],
    preferredWorkoutTime: "",
    preferredWorkoutCategories: [],
  },
  workoutHistory: {
    experienceDuration: "",
    strengthLevel: "",
    trainedWithCoach: null,
    trainingTypes: [],
    consistencyLevel: "",
    weeklyTrainingDays: "",
    avgSessionDuration: "",
    goalIntensity: "",
  },
  medicalProfile: {
    hasMedicalConditions: null,
    medicalConditions: [],
    hasPastInjuries: null,
    pastInjuries: [],
    hasAllergies: null,
    allergies: [],
    takingMedication: null,
    medications: [],
    bloodPressure: "",
    clearanceFromDoctor: null,
  },
  dailyHabits: {
    dietPreference: "",
    dailyMeals: "",
    waterIntake: "",
    sleepDuration: "",
    stressLevel: "",
    workType: "",
    smokingDrinking: "",
  },
};

export const useUserOnboardingStore = create<UserOnboardingState>((set) => ({
  ...initialState,

  setFitnessProfile: (data) =>
    set((state) => ({
      fitnessProfile: { ...state.fitnessProfile, ...data },
    })),

  setWorkoutHistory: (data) =>
    set((state) => ({
      workoutHistory: { ...state.workoutHistory, ...data },
    })),

  setMedicalProfile: (data) =>
    set((state) => ({
      medicalProfile: { ...state.medicalProfile, ...data },
    })),

  setDailyHabits: (data) =>
    set((state) => ({
      dailyHabits: { ...state.dailyHabits, ...data },
    })),

  resetOnboarding: () => set(initialState),
}));
