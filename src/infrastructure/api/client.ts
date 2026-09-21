import { createProtectedAxios,api } from "@/infrastructure/api/protected-client";
import { ROLES } from "@/constants/roles.constants";

export const userApi = createProtectedAxios(ROLES.USER);
export const trainerApi = createProtectedAxios(ROLES.TRAINER);
export const adminApi = createProtectedAxios(ROLES.ADMIN);

export {api}
