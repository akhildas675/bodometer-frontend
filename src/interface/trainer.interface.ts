export interface WorkoutList{
    id:string,
    workoutName:string
}

export interface TrainerOnboardingPayload {
  experienceInYears: number;
  bio: string;
  certificate: File;
}

export interface TrainerOnboardingResponse {
  success: boolean;
  message: string;
}
