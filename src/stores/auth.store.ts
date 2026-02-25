import { create } from "zustand";
import type { Role } from "@/constants/role";
import type { VerificationStatus } from "@/constants/verification.status";

interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name?: string;
  verificationStatus?: VerificationStatus | null;
  profileExists?: boolean | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (payload: {
    accessToken: string;
    user: AuthUser;
    trainerStatus?: { verificationStatus?: VerificationStatus | null; profileExists?: boolean | null };
  }) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: ({ accessToken, user, trainerStatus }) =>
    set({
      accessToken,
      user: {
        ...user,
        
        verificationStatus: trainerStatus?.verificationStatus ?? user.verificationStatus ?? null,
        profileExists: trainerStatus?.profileExists ?? null,
      },
      isAuthenticated: true,
      isInitialized: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    }),

  setInitialized: (value) => set({ isInitialized: value }),

  setVerificationStatus: (status) =>
    set((state) => ({
      user: state.user ? { ...state.user, verificationStatus: status } : null,
    })),
}));