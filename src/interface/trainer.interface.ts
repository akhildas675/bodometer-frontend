import type { Gender } from "@/constants/identity";
import type { VerificationStatus } from "@/constants/verification.status";
import type { UsersListRequest, UsersListResponse, UserProfileInterface } from "./user.interface";

export interface TrainerListRequest extends UsersListRequest {
  role?: "trainer";
}

export interface TrainerListResponse extends UsersListResponse {
  role: "trainer";
}

// Backward compatible aliases
export type AdminGetTrainersRequest = TrainerListRequest;
export type AdminGetTrainersResponse = TrainerListResponse;

export interface TrainerProfileInterface extends UserProfileInterface {
  experienceInYears?: number;
  bio?: string;
  specializations?: string[];
  coverPhoto?: string;
  certifications?: string[];
}

export interface TrainerProfileForm {
  experience: number | "";
  gender: Gender;
  dateOfBirth: string;
  bio: string;
  certificate: File | null;
  profileImage: File | null;
}

export interface TrainerOnboardingResponse {
  success: boolean;
  message: string;
}

export interface TrainerProfileStatus {
  name: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
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

export interface RelatedTrainer {
  _id: string;
  name: string;
  profilePic: string | null;
  experienceInYears: number;
  bio: string;
}

export interface TrainerDetail {
  _id: string;
  name: string;
  profilePic: string | null;
  coverPhoto: string;
  bio: string;
  experienceInYears: number;
  specializations: { _id: string; name: string }[];
  relatedTrainers?: RelatedTrainer[];
}
