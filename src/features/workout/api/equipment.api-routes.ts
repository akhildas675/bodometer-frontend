export const EQUIPMENT_API_ROUTES = {
  EQUIPMENT: "/equipment",
  EQUIPMENT_BY_ID: (id: string) => `/equipment/${id}`,
  STATUS: (id: string) => `/equipment/${id}/status`,
} as const;
