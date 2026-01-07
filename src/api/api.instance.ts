import { createProtectedAxios } from "./protected.instance";
import { ROLES } from "../constants/role";

export const userApi = createProtectedAxios(ROLES.USER);
export const trainerApi = createProtectedAxios(ROLES.TRAINER);
export const adminApi = createProtectedAxios(ROLES.ADMIN);
