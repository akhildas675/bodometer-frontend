import { create } from "zustand";
import userServices from "@/services/user/user.services";

interface BmiState {
  height: number | null;
  weight: number | null;
  unit: "metric" | "imperial";
  heightFt: string;
  heightIn: string;
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
  reset: () => void;
  calculateBmi: () => Promise<void>;
}

export const useStandaloneBmiStore = create<BmiState>((set, get) => ({
  height: null,
  weight: null,
  unit: "metric",
  heightFt: "",
  heightIn: "",
  bmi: null,
  category: null,
  heightCm: null,
  weightKg: null,
  healthyWeightRange: null,
  loading: false,
  error: null,

  setHeight: (h) => set({ height: h }),
  setWeight: (w) => set({ weight: w }),
  setUnit: (u) => set({ unit: u, height: null, weight: null, heightFt: "", heightIn: "", bmi: null, category: null, heightCm: null, weightKg: null, healthyWeightRange: null, error: null }),
  setHeightFt: (ft) => set({ heightFt: ft }),
  setHeightIn: (inVal) => set({ heightIn: inVal }),
  reset: () => set({ height: null, weight: null, heightFt: "", heightIn: "", bmi: null, category: null, heightCm: null, weightKg: null, healthyWeightRange: null, error: null }),
  calculateBmi: async () => {
    const { height, weight, unit, heightFt, heightIn } = get();
    set({ loading: true, error: null });
    try {
      const res = await userServices.calculateBmiPublic({
        height,
        weight,
        unit,
        heightFt,
        heightIn,
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
    } catch (error: unknown) {
      set({
        error: "Failed to calculate BMI",
        loading: false,
      });
    }
  },
}));
