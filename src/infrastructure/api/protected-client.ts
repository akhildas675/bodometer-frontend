import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { baseUrl } from "@/infrastructure/api/base-url";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES, type Role } from "@/constants/roles.constants";
import { STATUS } from "@/constants/status-codes.constants";
import { authInstance } from "@/infrastructure/api/auth-client";
import type { ApiResponse } from "@/types/api.types";
import type { LoginResponseData } from "@/features/auth/types/auth.types";

const roleToRedirectPath: Record<Role, string> = {
  [ROLES.ADMIN]: "/admin/login",
  [ROLES.TRAINER]: "/trainer/login",
  [ROLES.USER]: "/login",
};

// ── Isolated refresh state for the generic `api` instance ────────────────────
// BUG 1 FIX: each axios instance must own its own isRefreshing / failedQueue so
// simultaneous 401s from different role instances cannot race against each other.
let apiIsRefreshing = false;
let apiFailedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processApiQueue = (error: Error | null = null) => {
  apiFailedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  apiFailedQueue = [];
};

// ── Role-specific axios factory ───────────────────────────────────────────────
// Each call to createProtectedAxios() returns an instance whose refresh state
// (isRefreshing / failedQueue) lives inside the closure — fully isolated.
export function createProtectedAxios(role: Role): AxiosInstance {
  // BUG 1 FIX: closure-scoped — NOT shared across role instances
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: Error | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve();
    });
    failedQueue = [];
  };

  const instance = axios.create({
    baseURL: `${baseUrl}/api/${role}`, // Keeps role-specific prefixes intact
    withCredentials: true,
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status !== STATUS.UNAUTHORIZED || originalRequest._retry) {
        if (error.response?.status === STATUS.UNAUTHORIZED) {
          useAuthStore.getState().clearAuth();
          window.location.href = `${roleToRedirectPath[role]}?expired=true`;
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const { accessToken } = useAuthStore.getState();
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest);
          })
          .catch((err: unknown) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await authInstance.post<ApiResponse<LoginResponseData>>("/refresh-token");
        if (response.data.success && response.data.data) {
          const { accessToken, user } = response.data.data;
          useAuthStore.getState().setAuth({ accessToken, user });
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null);
          return instance(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError: unknown) {
        const errorToPropagate =
          refreshError instanceof Error ? refreshError : new Error("Unknown error occurred");
        processQueue(errorToPropagate);
        useAuthStore.getState().clearAuth();
        window.location.href = `${roleToRedirectPath[role]}?expired=true`;
        return Promise.reject(errorToPropagate);
      } finally {
        isRefreshing = false;
      }
    },
  );

  return instance;
}

// ── Generic api instance (no role prefix) ────────────────────────────────────
export const api = axios.create({
  baseURL: `${baseUrl}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { user, clearAuth } = useAuthStore.getState();
    const role = user?.role || ROLES.USER;

    if (error.response?.status !== STATUS.UNAUTHORIZED || originalRequest._retry) {
      if (error.response?.status === STATUS.UNAUTHORIZED) {
        clearAuth();
        window.location.href = `${roleToRedirectPath[role]}?expired=true`;
      }
      return Promise.reject(error);
    }

    if (apiIsRefreshing) {
      return new Promise((resolve, reject) => {
        apiFailedQueue.push({ resolve, reject });
      })
        .then(() => {
          const { accessToken } = useAuthStore.getState();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        })
        .catch((err: unknown) => Promise.reject(err));
    }

    originalRequest._retry = true;
    apiIsRefreshing = true;

    try {
      const response = await authInstance.post<ApiResponse<LoginResponseData>>("/refresh-token");
      if (response.data.success && response.data.data) {
        const { accessToken, user: refreshedUser } = response.data.data;
        useAuthStore.getState().setAuth({ accessToken, user: refreshedUser });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processApiQueue(null);
        return api(originalRequest);
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (refreshError: unknown) {
      const errorToPropagate =
        refreshError instanceof Error ? refreshError : new Error("Unknown error occurred");
      processApiQueue(errorToPropagate);
      clearAuth();
      window.location.href = `${roleToRedirectPath[role]}?expired=true`;
      return Promise.reject(errorToPropagate);
    } finally {
      apiIsRefreshing = false;
    }
  },
);
