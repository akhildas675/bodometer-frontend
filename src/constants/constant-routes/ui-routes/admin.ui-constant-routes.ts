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

  SUBSCRIPTIONS: "/admin/subscription",
  SUBSCRIPTION_FEATURES: "/admin/subscription/features",
  SUBSCRIPTION_FEATURE_CREATE: "/admin/subscription/features/create",
  SUBSCRIPTION_FEATURE_EDIT: (id: string) => `/admin/subscription/features/edit/${id}`,
  SUBSCRIPTION_FEATURE_EDIT_PATH: "/admin/subscription/features/edit/:id",

  SUBSCRIPTION_PLANS: "/admin/subscription/plans",
  SUBSCRIPTION_PLAN_CREATE: "/admin/subscription/plans/create",
  SUBSCRIPTION_PLAN_EDIT: (id: string) => `/admin/subscription/plans/edit/${id}`,
  SUBSCRIPTION_PLAN_EDIT_PATH: "/admin/subscription/plans/edit/:id",

} as const;