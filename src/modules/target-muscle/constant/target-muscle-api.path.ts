export const TARGET_MUSCLE_API_PATHS = {
  ROOT: "/target-muscles",
  BY_ID: (id: string) => `/target-muscles/${id}`,
  TOGGLE_STATUS: (id: string) => `/target-muscles/${id}/status`,
};
