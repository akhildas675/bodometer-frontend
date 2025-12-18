import axios from "axios";
import { baseUrl } from "./baseUrl";
import { useAuthStore } from "../stores/authStore";

export const userInstance = axios.create({
  baseURL: `${baseUrl}/api/user`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
userInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle refresh token
userInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${baseUrl}/api/user/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.accessToken;

        const store = useAuthStore.getState();
        store.setAuth(newAccessToken, store.user!);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return userInstance(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  }
);
