import type { Role } from "@/constants/role";
import { SubscriptionStatus } from "@/constants/subscription.constant";
import type { VerificationStatus } from "@/constants/verification.status";


export interface User {
  createdAt: string | number | Date;
  isActive: boolean;
  id: string;
  name: string;
  email: string;
  role:Role
  profilePic: string | null;
  subscription: {
    status: SubscriptionStatus;
    endDate: string | null;
  };
}

export interface RegisterPayload{
    name:string,
    email:string,
    phoneNumber:string,
    password:string,
    confirmPassword:string,
}



export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: Role
}


export interface LoginPayload{
    email:string,
    password:string
}

export interface TrainerStatus {
  profileExists: boolean;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string | null;
}

export interface LoginResponseData {
  accessToken: string;
  user: User;
  trainerStatus?: TrainerStatus;
}




export interface AuthRegisterPageProps {
  role: Exclude<Role, "admin">;
}

export interface AuthOtpPageProps{
  role:Exclude<Role,"admin">
}


export interface ForgotPasswordPayload{
  email:string;
}

export interface ForgotPasswordResponse {
  role: Role
  success: true;
  message: string;
  data: {
    role: Exclude<Role,"admin"> | null;
  };
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  purpose: "FORGET_PASSWORD";
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface GoogleLoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  accessToken: string;
  trainerStatus?: TrainerStatus;
}
