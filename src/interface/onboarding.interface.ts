export type QuestionType = 
    | "boolean"
    | "single_select"
    | "multi_select"
    | "text"
    | "number"
    | "time"
    | "number_stepper";

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
}

export type OnboardingQuestionFormData = Omit<OnboardingQuestion, "id">;
