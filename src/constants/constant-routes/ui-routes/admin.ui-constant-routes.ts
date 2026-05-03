export const ADMIN_UI_ROUTES = {
  DASHBOARD: "/admin",
  USERS: "/admin/users",
  TRAINERS: "/admin/trainers",

  TRAINER_APPOINTMENT_LIST: "/admin/appointments",
  APPOINTMENT_DETAILS: (profileId: string) => `/admin/appointments/${profileId}`,
  APPOINTMENT_DETAILS_PATH: "/admin/appointments/:profileId",

} as const;