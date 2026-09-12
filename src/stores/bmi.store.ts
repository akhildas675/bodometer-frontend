import { healthLogService } from "@/modules/health-log/service/health-log.service";
import { create } from "zustand";

interface BmiState {
  height: number | null;
  weight: number | null;
  unit: "metric" | "imperial";
  heightFt: string;
  heightIn: string;
  gender: string;
  bmi: number | null;
  category: { label: string; color: string; description: string; tips: string[] } | null;
  heightCm: number | null;
  weightKg: number | null;
  healthyWeightRange: { minKg: number; maxKg: number } | null;
  loading: boolean;
  error: string | null;

  setHeight: (h: number | null) => void;
  setWeight: (w: number | null) => void;
  setUnit: (u: "metric" | "imperial") => void;
  setHeightFt: (ft: string) => void;
  setHeightIn: (inVal: string) => void;
  setGender: (g: string) => void;
  reset: () => void;
  calculateBmi: () => Promise<void>;
}

export const useStandaloneBmiStore = create<BmiState>((set, get) => ({
  height: null,
  weight: null,
  unit: "metric",
  heightFt: "",
  heightIn: "",
  gender: "male",
  bmi: null,
  category: null,
  heightCm: null,
  weightKg: null,
  healthyWeightRange: null,
  loading: false,
  error: null,

  setHeight: (h) => set({ height: h }),
  setWeight: (w) => set({ weight: w }),
  setUnit: (u) => set({ unit: u, height: null, weight: null, heightFt: "", heightIn: "", gender: "male", bmi: null, category: null, heightCm: null, weightKg: null, healthyWeightRange: null, error: null }),
  setHeightFt: (ft) => set({ heightFt: ft }),
  setHeightIn: (inVal) => set({ heightIn: inVal }),
  setGender: (g) => set({ gender: g }),
  reset: () => set({ height: null, weight: null, heightFt: "", heightIn: "", gender: "male", bmi: null, category: null, heightCm: null, weightKg: null, healthyWeightRange: null, error: null }),
  calculateBmi: async () => {
    const { height, weight, unit, heightFt, heightIn, gender } = get();
    set({ loading: true, error: null });
    try {
      const res = await healthLogService.calculateBmiPublic({
        height,
        weight,
        unit,
        heightFt,
        heightIn,
        gender,
      });
      if (res.success && res.data) {
        set({
          bmi: res.data.bmi,
          category: res.data.category,
          heightCm: res.data.heightCm,
          weightKg: res.data.weightKg,
          healthyWeightRange: res.data.healthyWeightRange,
          loading: false,
        });
      } else {
        set({ error: "Failed to calculate BMI", loading: false });
      }
    } catch (_error: unknown) {
      set({
        error: "Failed to calculate BMI",
        loading: false,
      });
    }
  },
}));
