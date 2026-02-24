import { create } from "zustand";
import type { Role } from "../constants/role";
import type { VerificationStatus } from "../constants/verification.status";

interface AuthUser {
  id: string;
  email: string;
  role: Role;
  verificationStatus?: VerificationStatus | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean; 

  setAuth: (payload: { accessToken: string; user: AuthUser }) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void; 
  setVerificationStatus: (status: VerificationStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: ({ accessToken, user }) =>
    set({
      accessToken,
      user,
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

  setInitialized: (value) =>
    set({
      isInitialized: value,
    }),
    
    setVerificationStatus: (status) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, verificationStatus: status }
        : null,
    })),
}));