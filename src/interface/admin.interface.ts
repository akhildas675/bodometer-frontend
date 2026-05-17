import type { Role } from "@/constants/role";
import { QuestionType } from "@/constants/question.type";
export interface AdminGetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: Exclude<Role, "admin">;
  status?: "active" | "blocked";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}


export interface AdminGetUsersResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminGetTrainersRequest extends AdminGetUsersRequest {
  role?: "trainer";
}

export interface AdminGetTrainersResponse extends AdminGetUsersResponse {
  role: "trainer";
}


export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface Category {
  name: string;
  description: string;
  image: File | null;

}

export interface UpdateCategory {
  categoryId: string;
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

/** Shape returned by the backend getAllCategories / getCategoryById endpoints */
export interface CategoryResponse {
  categoryId: string;
  name: string;
  description: string;
  image: string;
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  media: { image: { url: string } };
  isActive: boolean;
  createdAt: string;
}
export interface SubscriptionFeature {
  subscriptionFeatureId?: string;
  key?: string;
  title?: string;
  description?: string;
  type?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionPlanListItem {
  planId: string;
  name: string;
  price: number;
  durationInDays: number;
  featuresCount: number;
  isPopular: boolean;
  isActive: boolean;
}

export interface FeatureListItem {
  featureId: string;
  key: string;
  title: string;
  description: string;
  type: "boolean" | "limit";
  isActive: boolean;
}

export interface SubscriptionPlanFormData {
  name: string;
  description: string;
  price: string;
  durationInDays: string;
  isPopular: boolean;
  features: {
    featureId: string;
    type: "boolean" | "limit";
    limit: string;
    limitType: string;
  }[];
}

export interface SubscriptionPlanListItem {
  planId: string;
  name: string;
  price: number;
  durationInDays: number;
  featuresCount: number;
  isPopular: boolean;
  isActive: boolean;
}

export interface FeatureListItem {
  featureId: string;
  key: string;
  title: string;
  description: string;
  type: "boolean" | "limit";
  isActive: boolean;
}

export interface SubscriptionPlanFormData {
  name: string;
  description: string;
  price: string;
  durationInDays: string;
  isPopular: boolean;
  features: {
    featureId: string;
    type: "boolean" | "limit";
    limit: string;
    limitType: string;
  }[];
}

export interface SubscriptionPlan {
  planId: string;
  subscriptionPlanId?: string; // Backend consistency
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  isPopular: boolean;
  featuresCount: number;
  isActive: boolean;
  features?: {
    featureId: string;
    title?: string;
    limit?: number;
    limitType?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

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
  key: string;
  title: string;
  order: number;
}

export interface UpdateQuestionGroupData {
  title: string;
  order: number;
}

export interface CreateQuestionData {
  key: string;
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

export interface UpdateQuestionData extends Partial<CreateQuestionData> {}