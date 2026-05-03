import type { Gender } from "@/constants/identity";
import type { VerificationStatus } from "@/constants/verification.status";


export interface TrainerProfileForm {
  experience: number | ""
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
  profilePic?: string;
  dateOfBirth: Date | null;
}

export interface UploadProfilePictureResponse {
  url: string;
}


export interface TrainerProfileStatus{
  name: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null
}


