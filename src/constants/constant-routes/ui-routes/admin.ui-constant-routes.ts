export const ADMIN_UI_ROUTES = {
  DASHBOARD: "/admin",
  USERS: "/admin/users",
  TRAINERS: "/admin/trainers",
  WORKOUTS: "/admin/workouts",
  TRAINER_APPOINTMENT_LIST: "/admin/appointments",
  APPOINTMENT_DETAILS: (profileId: string) => `/admin/appointments/${profileId}`,
  APPOINTMENT_DETAILS_PATH: "/admin/appointments/:profileId",
  SUBSCRIPTIONS: "/admin/subscriptions",
  SUBSCRIPTIONS_CREATE: "/admin/subscriptions/create",                    
  SUBSCRIPTIONS_EDIT: (id: string) => `/admin/subscriptions/edit/${id}`,  
  SUBSCRIPTIONS_EDIT_PATH: "/admin/subscriptions/edit/:id",              
} as const;