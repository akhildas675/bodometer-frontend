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
    averageCalories: number;
    averageSleep: number;
    averageWater: number;
    averageSteps: number;
    averageProtein: number;
    currentStreak: number;
    trendData: HealthLogTrendDataDto[];
    macroDistribution: MacroDistributionDto[];
    dailySummary: DailyNutritionSummaryDto | null;
}
