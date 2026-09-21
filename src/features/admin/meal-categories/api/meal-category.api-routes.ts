export const MEAL_CATEGORY_API_ROUTES = {
  ROOT: "/meal-categories",
  BY_ID: (id: string) => `/meal-categories/${id}`,
  TOGGLE_STATUS: (id: string) => `/meal-categories/${id}/status`,
  GET_MEAL_CATEGORIES_USER: "/meal-categories",
} as const;
