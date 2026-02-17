export const ADMIN_UI_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  USERS: "/admin/users",
  TRAINERS: "/admin/trainers",
  WORKOUTS: "/admin/workouts",
  TRAINER_APPOINTMENT_LIST: "/admin/trainer-appointment-list",
  APPOINTMENT_DETAILS: (profileId: string) => `/admin/appointment-details/${profileId}`,
  APPOINTMENT_DETAILS_PATH: "/admin/appointment-details/:profileId",
} as const;
