import { create } from "zustand";
import type { Role } from "../constants/role";



interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setAuth: (payload: {
    accessToken: string;
    user: AuthUser;
  }) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: ({ accessToken, user }) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}));
