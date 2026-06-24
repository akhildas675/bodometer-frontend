import { QuestionType } from "@/constants/onboarding.constant";

export interface QuestionGroup {
  groupId: string;
  key: string;
  title: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface OnboardingQuestion {
  questionId: string;
  key: string;
  question: string;
  description?: string;
  groupId: string;
  order: number;
  isActive: boolean;
  type: QuestionType;
  options?: { label: string; value: string | number | boolean }[];
  dataSource?: string;
  next?: {
    condition: { operator: string; value?: string | number | boolean };
    nextQuestionId: string;
  }[];
  numberConfig?: { min?: number; max?: number; step?: number; unit?: string };
  validation?: { required?: boolean };
  createdAt?: string;
}

export interface CreateQuestionGroupData {
  key?: string;
  title: string;
  order: number;
}

export interface UpdateQuestionGroupData {
  title: string;
  order: number;
}

export interface CreateQuestionData {
  key?: string;
  question: string;
  description?: string;
  groupId: string;
  order: number;
  type: string;
  options?: { label: string; value: string | number | boolean }[];
  dataSource?: string;
  next?: {
    condition: { operator: string; value?: string | number | boolean };
    nextQuestionId: string;
  }[];
  numberConfig?: { min?: number; max?: number; step?: number; unit?: string };
  validation?: { required?: boolean };
}

export type UpdateQuestionData = Partial<CreateQuestionData>;

export interface QuestionOption {
  optionId: string;
  text: string;
  mediaUrl: string | null;
  order: number;
}

export interface QuestionMetadata {
  targetMuscleGroup: string;
}

export interface Question {
  questionId: string;
  text: string;
  questionType: string;
  options: QuestionOption[];
  isRequired: boolean;
  order: number;
  isActive: boolean;
  metadata: QuestionMetadata;
}

export interface OnboardingAnswerItem {
  questionId: string;
  questionKey?: string;
  key?: string;
  answer?: string | number | string[] | number[] | boolean;
  value?: string | number | string[] | number[] | boolean;
}

export interface OnboardingAnswersResponse {
  answers: OnboardingAnswerItem[];
}
