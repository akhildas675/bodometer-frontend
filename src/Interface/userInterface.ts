export type Role = "user" | "trainer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
  profilePic?: string | null;
}

/* -------- Requests -------- */

export interface RegisterPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload{
  email:string | null,
  otp:string | null;
  userData:RegisterPayload | null;
}

/* -------- Responses -------- */

export interface RegisterSuccessData {
  id: string;
  name: string;
  email: string;
}

export interface LoginSuccessData {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: "user" | "trainer" | "admin";
    profilePic?: string | null;
  };
}


export interface ResendOtpResponse {
  success: boolean;
  message: string;
}




