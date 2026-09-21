export const EXERCISE_API_ROUTES = {
  EXERCISES: "/exercises",
  EXERCISE_BY_ID: (id: string) => `/exercises/${id}`,
  STATUS: (id: string) => `/exercises/${id}/status`,
} as const;
