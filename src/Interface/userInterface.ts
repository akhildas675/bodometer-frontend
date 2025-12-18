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
