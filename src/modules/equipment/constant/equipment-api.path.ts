export const EQUIPMENT_API_PATHS = {
  ROOT: "/equipment",
  BY_ID: (id: string) => `/equipment/${id}`,
  TOGGLE_STATUS: (id: string) => `/equipment/${id}/status`,
};
