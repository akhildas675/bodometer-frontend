export const USER_API_ROUTES = {
  PROFILE: "/user/profile",
  PROFILE_PICTURE: "/user/profile-picture",
  CHANGE_PASSWORD: "/user/change-password",
  USERS: "/user/users",
  BLOCK_USER: (id: string) => `/user/users/${id}/block`,
  UNBLOCK_USER: (id: string) => `/user/users/${id}/unblock`,
} as const;
