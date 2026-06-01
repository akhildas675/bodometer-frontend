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
  gender?: Gender;
  profilePic?: string;
  dateOfBirth?: Date | null;
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
  specializations: { _id: string; name: string }[];
}

export interface TrainerDetail {
  _id: string;
  name: string;
  profilePic: string | null;
  coverPhoto: string;
  bio: string;
  experienceInYears: number;
  specializations: { _id: string; name: string }[];
}

export interface CategoryListItem {
  categoryId: string;
  _id?: string;
  name: string;
  description: string;
  media?: { image?: { url: string } };
  image?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryDetail {
  categoryId: string;
  name: string;
  description: string;
  media?: { image?: { url: string } };
  image?: string;
  isActive: boolean;
}

export interface ActiveSubscription {
  subscriptionId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  daysRemaining: number;
}

export interface Question {
  questionId: string;
  text: string;
  questionType: string;
  options: Option[];
  isRequired: boolean;
  order: number;
  isActive: boolean;
  metadata: Metadata;
}

interface Option {
  optionId: string;
  text: string;
  mediaUrl: string | null;
  order: number;
}

interface Metadata {
  targetMuscleGroup: string;
}

export interface OnboardingAnswerItem {
  questionId: string;
  questionKey?: string;
  key?: string;
  answer?: string | number | string[] | number[];
  value?: string | number | string[] | number[];
}

export interface OnboardingAnswersResponse {
  answers: OnboardingAnswerItem[];
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export interface CalculateBmiPayload {
  height?: number | null;
  weight?: number | null;
  unit: "metric" | "imperial";
  heightFt?: string;
  heightIn?: string;
}

export interface BmiCalculationResult {
  bmi: number;
  heightCm: number;
  weightKg: number;
  category: {
    label: string;
    color: string;
    description: string;
    tips: string[];
  };
  healthyWeightRange: {
    minKg: number;
    maxKg: number;
  };
}