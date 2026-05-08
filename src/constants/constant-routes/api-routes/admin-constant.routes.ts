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

  
} as const;