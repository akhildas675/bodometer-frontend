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
  GET_WORKOUT_BY_ID: (id: string) => `/workout/${id}`,

  // Trainer Appointments
  GET_TRAINER_APPOINTMENTS: "/get-trainer-appointments",
  GET_TRAINER_BY_PROFILE_ID: (profileId: string) => `/trainers/profile/${profileId}`,
  APPROVE_TRAINER: (profileId: string) => `/trainers/${profileId}/approve`,
  REJECT_TRAINER: (profileId: string) => `/trainers/${profileId}/reject`,

  // Subscription
  ADD_SUBSCRIPTION: "/add-subscription",
  GET_ALL_SUBSCRIPTIONS: "/subscriptions",
  GET_SUBSCRIPTION_BY_ID: (id: string) => `/subscriptions/${id}`,
  UPDATE_SUBSCRIPTION: (id: string) => `/subscriptions/${id}`,
  DELETE_SUBSCRIPTION: (id: string) => `/subscriptions/${id}`,
  TOGGLE_SUBSCRIPTION_STATUS: (id: string) => `/subscriptions/${id}/toggle`,

  // Onboarding
  GET_ONBOARDING_QUESTIONS: "/onboarding/questions",
  GET_ONBOARDING_QUESTION_BY_ID: (id: string) => `/onboarding/questions/${id}`,
  CREATE_ONBOARDING_QUESTION: "/create-question",
  UPDATE_ONBOARDING_QUESTION: (id: string) => `/update-question/${id}`,
  DELETE_ONBOARDING_QUESTION: (id: string) => `/delete-question/${id}`,
  GET_ONBOARDING_SECTIONS: "/onboarding-sections",
  GET_SCHEMA_KEY: "/schema-keys",
  
} as const;