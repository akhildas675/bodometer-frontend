import axios from "axios";
import { baseUrl } from "./base.url";

export const authInstance = axios.create({
  baseURL: `${baseUrl}/api/auth`,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

authInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

  
    if (
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/register")
    ) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);