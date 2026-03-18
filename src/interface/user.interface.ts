import type { Gender } from "@/constants/identity";


export interface UserProfileInterface {
  id: string;
  name: string;
  userName: string;
  email: string;
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
  profilePic?: string;
  dateOfBirth: Date | null;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfileInterface;
}

export interface UploadProfilePictureResponse {
  url: string;
}

export interface UserWorkout {
  id: string;
  workoutName: string;
  workoutDescription: string;
  workoutImage: string;
}

export interface UserWorkout {
  id: string;
  workoutName: string;
  workoutDescription: string;
  workoutImage: string;
}

export interface RelatedTrainer {
  _id: string;
  name: string;
  profilePic: string | null;
  experienceInYears: number;
  bio: string;
}

export interface WorkoutDetailResponse {
  workout: UserWorkout;
  relatedTrainers: RelatedTrainer[];
  relatedWorkouts: UserWorkout[];
}


export interface SubscriptionPlan {
  id: string;
  subscriptionName: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  liveSessionCount: number;
  planType: "basic" | "pro" | "elite";
}

export interface ActiveSubscription {
  planId: string;
  subscriptionName: string;
  planType: "basic" | "pro" | "elite";
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface TrainerListItem {
  _id: string;
  name: string;
  profilePic: string | null;
  experienceInYears: number;
  bio: string;
  specializations: { _id: string; workoutName: string }[];
}