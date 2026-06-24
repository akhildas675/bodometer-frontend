import { api } from "@/api/protected.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { ApiResponse } from "@/interface/api-response.interface";
import { PaginatedResponse, PaginationMeta } from "@/interface/common.interface";
import { ONBOARDING_API_PATHS } from "../constant/onboarding-api.path";
import {
  QuestionGroup,
  OnboardingQuestion,
  CreateQuestionGroupData,
  UpdateQuestionGroupData,
  CreateQuestionData,
  UpdateQuestionData,
  OnboardingAnswersResponse,
} from "../types/onboarding.interface";
import { AnswerValue } from "@/constants/onboarding.constant";

export const onboardingService = {

  async getOnboardingGroups(): Promise<ApiResponse<QuestionGroup[]>> {
    const response = await api.get<ApiResponse<QuestionGroup[]>>(
      ONBOARDING_API_PATHS.GROUPS,
    );
    return response.data;
  },

  async getOnboardingQuestions(): Promise<ApiResponse<OnboardingQuestion[]>> {
    const response = await api.get<ApiResponse<OnboardingQuestion[]>>(
      ONBOARDING_API_PATHS.QUESTIONS,
      { params: { limit: 1000 } }
    );
    return response.data;
  },

  async submitOnboarding(data: {
    answers: { questionId: string; key: string; value: AnswerValue }[];
  }): Promise<ApiResponse<unknown>> {
    const response = await api.post<ApiResponse<unknown>>(
      ONBOARDING_API_PATHS.SUBMIT,
      data,
    );
    return response.data;
  },

  async getOnboardingStatus(): Promise<ApiResponse<{ completed: boolean }>> {
    const response = await api.get<ApiResponse<{ completed: boolean }>>(
      ONBOARDING_API_PATHS.STATUS,
    );
    return response.data;
  },

  async getOnboardingAnswers(): Promise<ApiResponse<OnboardingAnswersResponse>> {
    const response = await api.get<ApiResponse<OnboardingAnswersResponse>>(
      ONBOARDING_API_PATHS.ANSWERS,
    );
    return response.data;
  },

  async getQuestionGroups(
    params?: TableQueryParams,
  ): Promise<PaginatedResponse<QuestionGroup>> {
    const queryParams = buildQueryParams(params);
    const response = await api.get<{
      success: boolean;
      data: QuestionGroup[];
      pagination: PaginationMeta;
    }>(ONBOARDING_API_PATHS.ADMIN_GROUPS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async createQuestionGroup(
    data: CreateQuestionGroupData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      ONBOARDING_API_PATHS.ADMIN_GROUPS,
      data,
    );
    return response.data;
  },

  async updateQuestionGroup(
    id: string,
    data: UpdateQuestionGroupData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      ONBOARDING_API_PATHS.ADMIN_GROUP_BY_ID(id),
      data,
    );
    return response.data;
  },

  async getQuestionGroupById(id: string): Promise<ApiResponse<QuestionGroup>> {
    const response = await api.get<ApiResponse<QuestionGroup>>(
      ONBOARDING_API_PATHS.ADMIN_GROUP_BY_ID(id),
    );
    return response.data;
  },

  async toggleQuestionGroupStatus(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      ONBOARDING_API_PATHS.ADMIN_GROUP_TOGGLE(id),
    );
    return response.data;
  },

  async getQuestions(
    params?: TableQueryParams,
  ): Promise<PaginatedResponse<OnboardingQuestion>> {
    const queryParams = buildQueryParams(params);
    const response = await api.get<{
      success: boolean;
      data: OnboardingQuestion[];
      pagination: PaginationMeta;
    }>(ONBOARDING_API_PATHS.ADMIN_QUESTIONS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async createQuestion(
    data: CreateQuestionData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      ONBOARDING_API_PATHS.ADMIN_QUESTIONS,
      data,
    );
    return response.data;
  },

  async updateQuestion(
    id: string,
    data: UpdateQuestionData,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      ONBOARDING_API_PATHS.ADMIN_QUESTION_BY_ID(id),
      data,
    );
    return response.data;
  },

  async getQuestionById(id: string): Promise<ApiResponse<OnboardingQuestion>> {
    const response = await api.get<ApiResponse<OnboardingQuestion>>(
      ONBOARDING_API_PATHS.ADMIN_QUESTION_BY_ID(id),
    );
    return response.data;
  },

  async toggleQuestionStatus(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      ONBOARDING_API_PATHS.ADMIN_QUESTION_TOGGLE(id),
    );
    return response.data;
  },

  async getQuestionDataSources(): Promise<{ label: string; value: string }[]> {
    const response = await api.get<{
      success: boolean;
      data: { label: string; value: string }[];
    }>(ONBOARDING_API_PATHS.ADMIN_QUESTION_DATA_SOURCES);
    return response.data.data;
  },
};
