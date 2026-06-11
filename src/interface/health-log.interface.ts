

export interface MealEntry {
    id: string;
    categoryId: string;
    description: string;
    estimatedCalories: number;
    estimatedProtein: number;
    estimatedCarbs: number;
    estimatedFat: number;
    correctedMeal?: string;
}

export interface MealEntryDto {
    mealCategoryId: string;
    description: string;
    correctedMeal?: string;
    estimatedCalories?: number;
    estimatedProtein?: number;
    estimatedCarbs?: number;
    estimatedFat?: number;
}

export interface HealthLogDto {
    userId: string;
    date: string;
    sleepHours?: number;
    waterLiters?: number;
    steps?: number;
    meals: MealEntryDto[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}

export interface UpsertHealthLogDto {
    date: string;
    sleepHours?: number | null;
    waterLiters?: number | null;
    steps?: number | null;
    meals: {
        mealCategoryId: string;
        description: string;
    }[];
}

// One data-point per chart x-axis label
export interface HealthLogTrendDataDto {
    label: string;
    calories: number;
    protein: number;
    water: number;
    sleep: number;
    steps: number;
}

export interface MacroDistributionDto {
    macroName: string;
    amount: number;
    percentage: number;
}


export interface DailyNutritionSummaryDto {
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}

export interface HealthLogProgressResponseDto {
    // Summary cards
    averageCalories: number;
    averageSleep: number;
    averageWater: number;
    averageSteps: number;
    averageProtein: number;
    currentStreak: number;

    // Chart series (ordered oldest → newest)
    trendData: HealthLogTrendDataDto[];

    // Pie chart
    macroDistribution: MacroDistributionDto[];

    // Daily Nutrition Summary section
    dailySummary: DailyNutritionSummaryDto | null;
}

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

export interface CalculateBmiPayload {
  height?: number | null;
  weight?: number | null;
  unit: "metric" | "imperial";
  heightFt?: string;
  heightIn?: string;
}

export interface BmiCalculationResult {
  bmi: number;
  heightCm: number;
  weightKg: number;
  category: {
    label: string;
    color: string;
    description: string;
    tips: string[];
  };
  healthyWeightRange: {
    minKg: number;
    maxKg: number;
  };
}