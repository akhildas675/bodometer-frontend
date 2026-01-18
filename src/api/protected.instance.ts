import axios, { type AxiosInstance } from "axios";
import { baseUrl } from "./base.url";
import { useAuthStore } from "../stores/auth.store";
import { ROLES, type Role } from "../constants/role";

const roleToRedirectPath: Record<Role, string> = {
  [ROLES.ADMIN]: "/admin/login",
  [ROLES.TRAINER]: "/trainer/login",
  [ROLES.USER]: "/user/login",
};

export function createProtectedAxios(role: Role): AxiosInstance {
  const instance = axios.create({
    baseURL: `${baseUrl}/api/${role}`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    console.log("Access token from protected.instance....",accessToken)

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = roleToRedirectPath[role];
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
