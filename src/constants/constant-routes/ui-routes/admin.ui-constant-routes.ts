export const ADMIN_UI_ROUTES = {
  DASHBOARD: "/admin",
  USERS: "/admin/users",
  TRAINERS: "/admin/trainers",

  TRAINER_APPOINTMENT_LIST: "/admin/appointments",
  APPOINTMENT_DETAILS: (profileId: string) => `/admin/appointments/${profileId}`,
  APPOINTMENT_DETAILS_PATH: "/admin/appointments/:profileId",

  //category

  CATEGORY: "/admin/category",
  CATEGORY_CREATE: "/admin/category/create",
  CATEGORY_EDIT: (id: string) => `/admin/category/edit/${id}`,
  CATEGORY_EDIT_PATH: "/admin/category/edit/:id",

} as const;