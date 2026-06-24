export const EXERCISE_API_PATHS = {
  ROOT: "/exercises",
  BY_ID: (id: string) => `/exercises/${id}`,
  TOGGLE_STATUS: (id: string) => `/exercises/${id}/status`,
};
