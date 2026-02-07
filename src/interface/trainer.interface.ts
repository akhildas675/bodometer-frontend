import type { Gender } from "../constants/identity";

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


export interface TrainerProfileInterface {
  id: string;
  name: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  gender: Gender;
  profilePic: string | null;
  dateOfBirth: Date | null;
}

export interface ProfileUpdatePayload {
  name: string;
  userName: string;
  phoneNumber: string | null;
  gender: Gender;
  dateOfBirth: Date | null;
  profilePic?: string;
}

export interface UploadProfilePictureResponse {
  url: string;
}
