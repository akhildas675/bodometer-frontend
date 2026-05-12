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


export interface TrainerListItem {
  _id: string;
  profileId: string;
  name: string;
  profilePic: string | null;
  experienceInYears: number;
  coverPhoto: string | null;
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
}

export interface CategoryListItem {
  categoryId: string;
  name: string;
  description: string;
  media?: { image?: { url: string } };
  isActive: boolean;
  createdAt: string;
}

export interface CategoryDetail {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface ActiveSubscription{
  subscriptionId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  daysRemaining: number;
}