import { QuestionType } from "@/constants/onboarding.constant";


export interface OnboardingQuestionOption {
  label: string;
  value: string;
  hasExtraInput?: boolean;
  placeholder?: string;
}

export interface OnboardingQuestionFollowUp {
  when: string | boolean;
  type: "text" | "number";
  key: string;
  placeholder?: string;
}

export interface OnboardingQuestionConfig {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface OnboardingQuestionValidation {
  required?: boolean;
}

export interface OnboardingQuestion {
  id: string;
  key: string;
  schemaKey: string | null;
  isCoreLocked: boolean;
  question: string;
  type: QuestionType;
  section: string;
  order: number;
  options?: OnboardingQuestionOption[];
  followUp?: OnboardingQuestionFollowUp;
  config?: OnboardingQuestionConfig;
  validation?: OnboardingQuestionValidation;
  isActive: boolean;
  createdAt?: string;
}

export type OnboardingQuestionFormData = Omit<OnboardingQuestion, "id" | "createdAt">;
