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

  // Question Groups
  GET_QUESTION_GROUPS: "/get-question-groups",
  CREATE_QUESTION_GROUP: "/create-question-group",
  GET_QUESTION_GROUP_BY_ID: (id: string) => `/get-question-group/${id}`,
  UPDATE_QUESTION_GROUP: (id: string) => `/update-question-group/${id}`,
  TOGGLE_QUESTION_GROUP_STATUS: (id: string) => `/toggle-question-group/${id}`,

  // Questions
  GET_QUESTIONS: "/get-questions",
  CREATE_QUESTION: "/create-question",
  GET_QUESTION_BY_ID: (id: string) => `/get-question/${id}`,
  UPDATE_QUESTION: (id: string) => `/update-question/${id}`,
  TOGGLE_QUESTION_STATUS: (id: string) => `/toggle-question/${id}`,
  GET_QUESTION_DATA_SOURCES: "/questions/data-sources",

  // Subscription Transactions
  GET_SUBSCRIPTION_TRANSACTIONS: "/get-subscription-transactions",
} as const;