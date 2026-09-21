export interface MealCategory {
  mealCategoryId?: string;
  title: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateMealCategory {
  mealCategoryId: string;
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface MealCategoryQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  [key: string]: string | number | boolean | undefined | null;
}
