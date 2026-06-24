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
