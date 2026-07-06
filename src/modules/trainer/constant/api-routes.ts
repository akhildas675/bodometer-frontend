export const TRAINER_API_ROUTES = {
  PROFILE: "/trainer/profile",
  PROFILE_PICTURE: "/trainer/profile-picture",
  DOCUMENT: "/trainer/document",
  PROFILE_STATUS: "/trainer/profile/status",
  TRAINERS: "/trainer/trainers",
  TRAINER_BY_ID: (id: string) => `/trainer/trainers/${id}`,
  BLOCK_TRAINER: (id: string) => `/trainer/trainers/${id}/block`,
  UNBLOCK_TRAINER: (id: string) => `/trainer/trainers/${id}/unblock`,
  APPOINTMENTS: "/trainer/appointments",
  PROFILE_BY_ID: (id: string) => `/trainer/profile/${id}`,
  APPROVE_PROFILE: (id: string) => `/trainer/profile/${id}/approve`,
  REJECT_PROFILE: (id: string) => `/trainer/profile/${id}/reject`,
} as const;
