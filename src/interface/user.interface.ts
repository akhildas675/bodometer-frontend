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
  coverPhoto: string;
  introVideo: string;
  targetMuscles: string[];
  equipment: string[];
  benefits: string[];
  isActive: boolean;
  createdAt?: Date;
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
  profileId: string; 
  name: string;
  profilePic: string | null;
  experienceInYears: number;
  coverPhoto:string| null;
  bio: string;
  specializations: { _id: string; workoutName: string }[];
}

export interface TrainerDetail {
  _id: string;
  name: string;
  profilePic: string | null;
  coverPhoto: string;
  bio: string;
  experienceInYears: number;
  specializations: { _id: string; workoutName: string }[];
}