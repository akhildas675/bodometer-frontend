import { OnboardingQuestion as FlatOnboardingQuestion } from "@/interface/onboarding.interface";

export interface MapInputQuestion {
  questionId: string;
  key: string;
  question: string;
  description?: string;
  groupId: string;
  order: number;
  type: string;
  options?: { label: string; value?: string | number | boolean }[];
  numberConfig?: { min?: number; max?: number; step?: number; unit?: string };
  validation?: { required?: boolean };
  isActive?: boolean;
}

export const mapDynamicToFlat = (q: MapInputQuestion): FlatOnboardingQuestion => ({
  id: q.questionId || "",
  key: q.key || "",
  schemaKey: null,
  isCoreLocked: false,
  question: q.question || "",
  type: (q.type === "number" && q.numberConfig) ? "number_stepper" : q.type,
  section: "",
  order: q.order || 0,
  options: q.options?.map((o: { label: string; value?: string | number | boolean }) => ({
    label: o.label || "",
    value: String(o.value ?? ""),
  })),
  config: q.numberConfig ? {
    min: q.numberConfig.min,
    max: q.numberConfig.max,
    step: q.numberConfig.step,
    unit: q.numberConfig.unit,
  } : undefined,
  validation: q.validation,
  isActive: q.isActive ?? true,
});
