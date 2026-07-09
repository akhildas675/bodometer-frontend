export interface CalculateBmiPayload {
  height?: number | null;
  weight?: number | null;
  unit: "metric" | "imperial";
  heightFt?: string;
  heightIn?: string;
  gender?: string;
}

export interface BmiCalculationResult {
  bmi: number;
  heightCm: number;
  weightKg: number;
  gender?: string;
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
