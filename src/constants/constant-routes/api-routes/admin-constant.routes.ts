export const ADMIN_API_ROUTES = {
  // User Management
  GET_USERS: "/get-users",
  BLOCK_USER: (userId: string) => `/users/${userId}/block`,
  UNBLOCK_USER: (userId: string) => `/users/${userId}/unblock`,

  // Trainer Management
  GET_TRAINERS: "/get-trainers",
  BLOCK_TRAINER: (trainerId: string) => `/trainer/${trainerId}/block`,
  UNBLOCK_TRAINER: (trainerId: string) => `/trainer/${trainerId}/unblock`,

  // Workouts
  GET_WORKOUTS: "/get-workouts",
  ADD_WORKOUT: "/add-workout",
  TOGGLE_WORKOUT_STATUS: (id: string) => `/toggle-workout/${id}`,
  UPDATE_WORKOUT: (id: string) => `/update-workout/${id}`,

  // Trainer Appointments
  GET_TRAINER_APPOINTMENTS: "/get-trainer-appointments",
  GET_TRAINER_BY_PROFILE_ID: (profileId: string) => `/trainers/profile/${profileId}`,
  APPROVE_TRAINER: (profileId: string) => `/trainers/${profileId}/approve`,
  REJECT_TRAINER: (profileId: string) => `/trainers/${profileId}/reject`,

  //subscription

  ADD_SUBSCRIPTION: "/add-subscription",
  GET_ALL_SUBSCRIPTIONS: "/subscriptions",
  GET_SUBSCRIPTION_BY_ID: (id: string) => `/subscriptions/${id}`,
  UPDATE_SUBSCRIPTION: (id: string) => `/subscriptions/${id}`,
  DELETE_SUBSCRIPTION: (id: string) => `/subscriptions/${id}`,
  TOGGLE_SUBSCRIPTION_STATUS: (id: string) => `/subscriptions/${id}/toggle`,
} as const;