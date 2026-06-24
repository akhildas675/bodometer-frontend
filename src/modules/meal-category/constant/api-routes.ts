export const MEAL_CATEGORY_API_ROUTES = {
  CREATE_MEAL_CATEGORY: "/meal-category",
  GET_MEAL_CATEGORIES: "/meal-category",
  GET_MEAL_CATEGORY_BY_ID: (id: string) => `/meal-category/${id}`,
  UPDATE_MEAL_CATEGORY: (id: string) => `/meal-category/${id}`,
  TOGGLE_MEAL_CATEGORY_STATUS: (id: string) => `/meal-category/${id}/toggle-status`,
  GET_MEAL_CATEGORIES_USER: "/meal-categories",
} as const;
