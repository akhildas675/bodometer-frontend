export const CATEGORY_API_PATHS = {
  ROOT: "/categories",

  BY_ID: (categoryId: string) =>
    `/categories/${categoryId}`,

  TOGGLE_STATUS: (categoryId: string) =>
    `/categories/${categoryId}/toggle`,
};
