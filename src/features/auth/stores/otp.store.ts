import { create } from "zustand";
import type { Role } from "@/constants/roles.constants";
import type { RegisterPayload } from "@/features/auth/types/auth.types";

type OtpPurpose = "USER_REGISTER" | "TRAINER_REGISTER" | "FORGET_PASSWORD";

interface OtpState {
  email: string | null;
  role: Role | null;
  purpose: OtpPurpose | null;
  registerData: RegisterPayload | null;

  setOtpContext: (data: {
    email: string;
    role: Role;
    purpose: OtpPurpose;
    registerData?: RegisterPayload;
  }) => void;

  clearOtpContext: () => void;
}

export const useOtpStore = create<OtpState>((set) => ({
  email: null,
  role: null,
  purpose: null,
  registerData: null,

  setOtpContext: (data) =>
    set({
      email: data.email,
      role: data.role,
      purpose: data.purpose,
      registerData: data.registerData ?? null,
    }),

  clearOtpContext: () =>
    set({
      email: null,
      role: null,
      purpose: null,
      registerData: null,
    }),
}));
