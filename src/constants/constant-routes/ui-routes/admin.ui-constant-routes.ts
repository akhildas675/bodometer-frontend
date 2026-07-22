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

  // coaching
  COACHING: "/admin/coaching",
  COACHING_CREATE: "/admin/coaching/create",
  COACHING_EDIT: (id: string) => `/admin/coaching/edit/${id}`,
  COACHING_EDIT_PATH: "/admin/coaching/edit/:id",

  SUBSCRIPTIONS: "/admin/subscription",
  SUBSCRIPTION_FEATURES: "/admin/subscription/features",
  SUBSCRIPTION_FEATURE_CREATE: "/admin/subscription/features/create",
  SUBSCRIPTION_FEATURE_EDIT: (id: string) => `/admin/subscription/features/edit/${id}`,
  SUBSCRIPTION_FEATURE_EDIT_PATH: "/admin/subscription/features/edit/:id",

  SUBSCRIPTION_PLANS: "/admin/subscription/plans",
  SUBSCRIPTION_PLAN_CREATE: "/admin/subscription/plans/create",
  SUBSCRIPTION_PLAN_EDIT: (id: string) => `/admin/subscription/plans/edit/${id}`,
  SUBSCRIPTION_PLAN_EDIT_PATH: "/admin/subscription/plans/edit/:id",

  SUBSCRIPTION_TRANSACTIONS: "/admin/subscription/transactions",

  QUESTIONS_SECTION: "/admin/questions",
  QUESTION_GROUPS: "/admin/questions/groups",
  QUESTION_GROUPS_CREATE: "/admin/questions/groups/create",
  QUESTION_GROUPS_EDIT: (id: string) => `/admin/questions/groups/edit/${id}`,
  QUESTION_GROUPS_EDIT_PATH: "/admin/questions/groups/edit/:id",

  QUESTIONS_LIST: "/admin/questions/list",
  QUESTION_CREATE: "/admin/questions/list/create",
  QUESTION_EDIT: (id: string) => `/admin/questions/list/edit/${id}`,
  QUESTION_EDIT_PATH: "/admin/questions/list/edit/:id",

  TARGET_MUSCLES: "/admin/target-muscles",
  TARGET_MUSCLES_FORM: "/admin/target-muscles-form",

  EQUIPMENT: "/admin/equipment",
  EQUIPMENT_FORM: "/admin/equipment-form",

  EXERCISES: "/admin/exercises",
  EXERCISES_FORM: "/admin/exercises-form",

  MEAL_CATEGORY:"/admin/meal-category",
  MEAL_CATEGORY_FORM:"/admin/meal-category/create",

  BOOKINGS: "/admin/bookings",
} as const;