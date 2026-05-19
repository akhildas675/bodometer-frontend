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

export function createProtectedAxios(role: Role): AxiosInstance {
  const instance = axios.create({
  baseURL: `${baseUrl}/api/${role}`,
  withCredentials: true,
});

  // Request interceptor
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor with token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is not unauthorized or request already retried, reject
      if (error.response?.status !== STATUS.UNAUTHORIZED || originalRequest._retry) {
        if (error.response?.status === STATUS.UNAUTHORIZED) {
          // Clear auth and redirect
          useAuthStore.getState().clearAuth();
          window.location.href = `${roleToRedirectPath[role]}?expired=true`;
        }
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const { accessToken } = useAuthStore.getState();
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await authInstance.post<ApiResponse<LoginResponseData>>(
          "/refresh-token"
        );

        if (response.data.success && response.data.data) {
          const { accessToken, user } = response.data.data;
          useAuthStore.getState().setAuth({ accessToken, user });

          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          processQueue(null);
          return instance(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError as Error);
        useAuthStore.getState().clearAuth();
        window.location.href = `${roleToRedirectPath[role]}?expired=true`;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return instance;
}