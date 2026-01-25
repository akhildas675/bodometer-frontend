import type { Gender } from "../constants/identity";

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