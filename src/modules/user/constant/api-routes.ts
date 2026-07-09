export const USER_API_ROUTES = {
  PROFILE: "/user/profile",
  PROFILE_PICTURE: "/user/profile-picture",
  CHANGE_PASSWORD: "/user/change-password",
  USERS: "/user/users",
  TOGGLE_USER_STATUS: (id: string) => `/user/${id}/toggle-status`,

} as const;
