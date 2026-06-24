export const ADMIN_API_ROUTES = {
  // User Management
  GET_USERS: "/get-users",
  BLOCK_USER: (userId: string) => `/users/${userId}/block`,
  UNBLOCK_USER: (userId: string) => `/users/${userId}/unblock`,

  // Trainer Management
  GET_TRAINERS: "/get-trainers",
  BLOCK_TRAINER: (trainerId: string) => `/trainer/${trainerId}/block`,
  UNBLOCK_TRAINER: (trainerId: string) => `/trainer/${trainerId}/unblock`,


  // Trainer Appointments
  GET_TRAINER_APPOINTMENTS: "/get-trainer-appointments",
  GET_TRAINER_BY_PROFILE_ID: (profileId: string) => `/trainers/profile/${profileId}`,
  APPROVE_TRAINER: (profileId: string) => `/trainers/${profileId}/approve`,
  REJECT_TRAINER: (profileId: string) => `/trainers/${profileId}/reject`,

  //Category 
  GET_CATEGORIES: "/get-categories",
  CREATE_CATEGORY: "/create-category",
  GET_CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
  UPDATE_CATEGORY: (id: string) => `/update-category/${id}`,
  DELETE_CATEGORY: (id: string) => `/delete-category/${id}`,
  TOGGLE_CATEGORY_STATUS: (id: string) => `/categories/${id}/toggle`,
  GET_ALL_CATEGORIES: "/get-all-categories",


  //Subscription features

  GET_SUBSCRIPTION_FEATURES: "/get-subscription-features",
  CREATE_SUBSCRIPTION_FEATURE: "/create-subscription-feature",
  GET_SUBSCRIPTION_FEATURE_BY_ID: (id: string) => `/get-subscription-feature/${id}`,
  UPDATE_SUBSCRIPTION_FEATURE: (id: string) => `/update-subscription-feature/${id}`,
  DELETE_SUBSCRIPTION_FEATURE: (id: string) => `/delete-subscription-feature/${id}`,
  TOGGLE_SUBSCRIPTION_FEATURE_STATUS: (id: string) => `/toggle-subscription-features/${id}`,

  //Subscription plans
  GET_SUBSCRIPTION_PLANS: "/get-subscription-plans",
  CREATE_SUBSCRIPTION_PLAN: "/create-subscription-plan",
  GET_SUBSCRIPTION_PLAN_BY_ID: (id: string) => `/get-subscription-plan/${id}`,
  UPDATE_SUBSCRIPTION_PLAN: (id: string) => `/update-subscription-plan/${id}`,
  TOGGLE_SUBSCRIPTION_PLAN_STATUS: (id: string) => `/toggle-subscription-plan/${id}`,
  GET_SUBSCRIPTION_TRANSACTIONS: "/get-subscription-transactions",



  // Target Muscles
  CREATE_TARGET_MUSCLE: "/create-target-muscle",
  GET_TARGET_MUSCLES: "/get-target-muscles",
  GET_TARGET_MUSCLE_BY_ID: (id: string) => `/get-target-muscle/${id}`,
  UPDATE_TARGET_MUSCLE: (id: string) => `/update-target-muscle/${id}`,
  DELETE_TARGET_MUSCLE: (id: string) => `/delete-target-muscle/${id}`,
  TOGGLE_TARGET_MUSCLE_STATUS: (id: string) => `/toggle-target-muscle/${id}`,

  // Equipment
  CREATE_EQUIPMENT: "/create-equipment",
  GET_EQUIPMENT: "/get-equipment",
  GET_EQUIPMENT_BY_ID: (id: string) => `/get-equipment/${id}`,
  UPDATE_EQUIPMENT: (id: string) => `/update-equipment/${id}`,
  TOGGLE_EQUIPMENT_STATUS: (id: string) => `/toggle-equipment/${id}`,

  // Exercises
  CREATE_EXERCISE: "/create-exercise",
  GET_EXERCISES: "/get-exercises",
  GET_EXERCISE_BY_ID: (id: string) => `/get-exercise/${id}`,
  UPDATE_EXERCISE: (id: string) => `/update-exercise/${id}`,
  TOGGLE_EXERCISE_STATUS: (id: string) => `/toggle-exercise/${id}`,

  //meal category

  CREATE_MEAL_CATEGORY:"/create-meal-category",
  GET_MEAL_CATEGORIES: "/meal-category",
  GET_MEAL_CATEGORY_BY_ID: (id: string) => `/meal-category/${id}`,
  UPDATE_MEAL_CATEGORY: (id: string) => `/meal-category/${id}`,
  TOGGLE_MEAL_CATEGORY_STATUS: (id: string) => `/meal-category/${id}/toggle-status`,

  // Bookings
  GET_ALL_BOOKINGS: "/bookings",
  CANCEL_BOOKING: "/bookings/:bookingId/cancel",

} as const;