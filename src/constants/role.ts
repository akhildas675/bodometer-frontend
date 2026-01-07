export const ROLES = {
  USER: "user",
  TRAINER: "trainer",
  ADMIN: "admin",
} as const;


export type Role = typeof ROLES[keyof typeof ROLES];
