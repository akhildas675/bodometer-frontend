import { Gender } from "@/constants/identity"
import { create } from "zustand"

interface WorkoutStep {
  specializationIds: string[]
}

interface ProfileStep {
  experienceInYears: number
  bio: string
  dateOfBirth: string
  gender: Gender | ""
}

interface TrainerOnboardingForm {
  workout: WorkoutStep
  profile: ProfileStep
}

interface TrainerOnboardingStore {
  form: TrainerOnboardingForm
  setWorkouts: (ids: string[]) => void
  updateProfile: (data: Partial<ProfileStep>) => void
  reset: () => void
}

export const useTrainerOnboardingStore =
  create<TrainerOnboardingStore>((set) => ({
    form: {
      workout: {
        specializationIds: [],
      },
      profile: {
        experienceInYears: 0,
        bio: "",
        dateOfBirth: "",
        gender: "",
      },
    },
    setWorkouts: (ids) =>
  set((state) => ({
    form: {
      ...state.form,
      workout: {
        ...state.form.workout,
        specializationIds: ids,
      },
    },
  })),
    updateProfile: (data) =>
      set((state) => ({
        form: {
          ...state.form,
          profile: { ...state.form.profile, ...data },
        },
      })),
    reset: () =>
      set({
        form: {
          workout: { specializationIds: [] },
          profile: {
            experienceInYears: 0,
            bio: "",
            dateOfBirth: "",
            gender: "",
          },
        },
      }),
  }))