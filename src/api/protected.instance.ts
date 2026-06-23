import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { baseUrl } from "./base.url";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES, type Role } from "@/constants/role";
import { STATUS } from "@/constants/statuscode";
import { authInstance } from "./auth.instance";
import type { ApiResponse } from "@/interface/api-response.interface";
import type { LoginResponseData } from "@/interface/auth.interface";

const roleToRedirectPath: Record<Role, string> = {
  [ROLES.ADMIN]: "/admin/login",
  [ROLES.TRAINER]: "/trainer/login",
  [ROLES.USER]: "/login",
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// ----------------------------------------------------
// A. RESTORE ORIGINAL ROLE-SPECIFIC AXIOS INSTANCES
// ----------------------------------------------------
export function createProtectedAxios(role: Role): AxiosInstance {
  const instance = axios.create({
    baseURL: `${baseUrl}/api/${role}`, // Keeps role-specific prefixes intact!
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
        const errorToPropagate = refreshError instanceof Error ? refreshError : new Error("Unknown error occurred");
        processQueue(errorToPropagate);
        useAuthStore.getState().clearAuth();
        window.location.href = `${roleToRedirectPath[role]}?expired=true`;
        return Promise.reject(errorToPropagate);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return instance;
}


export const api = axios.create({
  baseURL: `${baseUrl}/api`, // Prefixed with just /api
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

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          const { accessToken } = useAuthStore.getState();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        })
        .catch((err: unknown) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await authInstance.post<ApiResponse<LoginResponseData>>("/refresh-token");
      if (response.data.success && response.data.data) {
        const { accessToken, user: refreshedUser } = response.data.data;
        useAuthStore.getState().setAuth({ accessToken, user: refreshedUser });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null);
        return api(originalRequest);
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (refreshError: unknown) {
      const errorToPropagate = refreshError instanceof Error ? refreshError : new Error("Unknown error occurred");
      processQueue(errorToPropagate);
      clearAuth();
      window.location.href = `${roleToRedirectPath[role]}?expired=true`;
      return Promise.reject(errorToPropagate);
    } finally {
      isRefreshing = false;
    }
  }
);
