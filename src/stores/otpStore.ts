import { create } from "zustand";
import type { RegisterPayload } from "../interface/userInterface";

interface OtpState {
  email: string | null;
  userData: RegisterPayload | null;
  setOtpSession: (email: string, userData: RegisterPayload) => void;
  clearOtpSession: () => void;
}

export const useOtpStore = create<OtpState>((set) => ({
  email: null,
  userData: null,

  setOtpSession: (email, userData) =>
    set({ email, userData }),

  clearOtpSession: () =>
    set({ email: null, userData: null }),
}));
