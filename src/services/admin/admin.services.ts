import { adminApi } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";

import type { TrainerWithProfile } from "@/components/ui/table/table.types";
import { MealCategory, MealCategoryQueryDto, UpdateMealCategory } from "@/interface/health-log.interface";
import { QuestionGroup, OnboardingQuestion, CreateQuestionGroupData, UpdateQuestionGroupData, CreateQuestionData, UpdateQuestionData } from "@/interface/onboarding.interface";

import { PaginatedResponse, PaginationMeta } from "@/interface/common.interface";
import { AdminGetUsersResponse } from "@/interface/user.interface";
import { AdminGetTrainersResponse } from "@/interface/trainer.interface";
import { TrainerBooking } from "@/interface/booking.interface";
import type { ApiResponse } from "@/interface/api-response.interface";
import type { UpdateTargetMuscles } from "@/interface/target-muscle.interface";
import type { UpdateEquipment } from "@/interface/equipment.interface";
import type { ExerciseRow } from "@/interface/exercise.interface";

import { ADMIN_API_ROUTES } from "@/constants/constant-routes/api-routes/admin-constant.routes";


class AdminService {
  // User Management
  async getUsers(params?: TableQueryParams): Promise<PaginatedResponse<AdminGetUsersResponse>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetUsersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_USERS, { params: queryParams });




    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async blockUser(userId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.BLOCK_USER(userId)
    );

    return response.data;
  }

  async unblockUser(userId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.UNBLOCK_USER(userId)
    );

    return response.data;
  }

  // Trainer Block/Unblock Management

  async getTrainers(params?: TableQueryParams): Promise<PaginatedResponse<AdminGetTrainersResponse>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: AdminGetTrainersResponse[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TRAINERS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async blockTrainer(trainerId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.BLOCK_TRAINER(trainerId)
    );

    return response.data;
  }

  async unblockTrainer(trainerId: string): Promise<ApiResponse<null>> {

    const response = await adminApi.patch<ApiResponse<null>>(
      ADMIN_API_ROUTES.UNBLOCK_TRAINER(trainerId)
    );

    return response.data;
  }


  // Get all trainer appointments
  async getTrainerAppointments(params?: TableQueryParams): Promise<PaginatedResponse<TrainerWithProfile>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: TrainerWithProfile[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TRAINER_APPOINTMENTS, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  // get trainer by profileId 
  async getTrainerByProfileId(
    profileId: string
  ): Promise<ApiResponse<TrainerWithProfile>> {
    const response = await adminApi.get<ApiResponse<TrainerWithProfile>>(
      ADMIN_API_ROUTES.GET_TRAINER_BY_PROFILE_ID(profileId)
    );
    return response.data;
  }

  //approve trainer
  async approveTrainer(
    profileId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.APPROVE_TRAINER(profileId)
    );
    return response.data;
  }

  //reject trainer
  async rejectTrainer(
    profileId: string,
    reason: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.REJECT_TRAINER(profileId),
      { reason }
    );
    return response.data;
  }
 

 


 





  


  // Question Groups
  async getQuestionGroups(params?: TableQueryParams): Promise<PaginatedResponse<QuestionGroup>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: QuestionGroup[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_QUESTION_GROUPS, { params: queryParams });

    return { data: response.data.data, pagination: response.data.pagination };
  }

  async createQuestionGroup(data: CreateQuestionGroupData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.CREATE_QUESTION_GROUP, data);
    return response.data;
  }

  async updateQuestionGroup(id: string, data: UpdateQuestionGroupData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.UPDATE_QUESTION_GROUP(id), data);
    return response.data;
  }

  async getQuestionGroupById(id: string): Promise<ApiResponse<QuestionGroup>> {
    const response = await adminApi.get<ApiResponse<QuestionGroup>>(ADMIN_API_ROUTES.GET_QUESTION_GROUP_BY_ID(id));
    return response.data;
  }

  async toggleQuestionGroupStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.TOGGLE_QUESTION_GROUP_STATUS(id));
    return response.data;
  }

  // Questions
  async getQuestions(params?: TableQueryParams): Promise<PaginatedResponse<OnboardingQuestion>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: OnboardingQuestion[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_QUESTIONS, { params: queryParams });

    return { data: response.data.data, pagination: response.data.pagination };
  }

  async createQuestion(data: CreateQuestionData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.CREATE_QUESTION, data);
    return response.data;
  }

  async updateQuestion(id: string, data: UpdateQuestionData): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.UPDATE_QUESTION(id), data);
    return response.data;
  }

  async getQuestionById(id: string): Promise<ApiResponse<OnboardingQuestion>> {
    const response = await adminApi.get<ApiResponse<OnboardingQuestion>>(ADMIN_API_ROUTES.GET_QUESTION_BY_ID(id));
    return response.data;
  }

  async toggleQuestionStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.TOGGLE_QUESTION_STATUS(id));
    return response.data;
  }



  async getQuestionDataSources(): Promise<{ label: string; value: string }[]> {
    const response = await adminApi.get<{
      success: boolean;
      data: { label: string; value: string }[];
    }>(ADMIN_API_ROUTES.GET_QUESTION_DATA_SOURCES);
    return response.data.data;
  }

  async createTargetMuscle(
    data: FormData
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.CREATE_TARGET_MUSCLE, data)
    return response.data;
  }

  async getAllTargetMuscles(params?: TableQueryParams): Promise<PaginatedResponse<UpdateTargetMuscles>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: UpdateTargetMuscles[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_TARGET_MUSCLES, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getTargetMuscleById(
    id: string
  ): Promise<ApiResponse<UpdateTargetMuscles>> {
    const response = await adminApi.get<ApiResponse<UpdateTargetMuscles>>(
      ADMIN_API_ROUTES.GET_TARGET_MUSCLE_BY_ID(id)
    );
    return response.data;
  }

  async updateTargetMuscle(
    id: string,
    data: FormData
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.UPDATE_TARGET_MUSCLE(id),
      data
    );
    return response.data;
  }

  async toggleTargetMuscleStatus(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.TOGGLE_TARGET_MUSCLE_STATUS(id)
    );
    return response.data;
  }

  // Equipment

  async createEquipment(
    data: FormData
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(ADMIN_API_ROUTES.CREATE_EQUIPMENT, data)
    return response.data;
  }

  async getAllEquipment(params?: TableQueryParams): Promise<PaginatedResponse<UpdateEquipment>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: UpdateEquipment[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_EQUIPMENT, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getEquipmentById(
    id: string
  ): Promise<ApiResponse<UpdateEquipment>> {
    const response = await adminApi.get<ApiResponse<UpdateEquipment>>(
      ADMIN_API_ROUTES.GET_EQUIPMENT_BY_ID(id)
    );
    return response.data;
  }

  async updateEquipment(
    id: string,
    data: FormData
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.UPDATE_EQUIPMENT(id),
      data
    );
    return response.data;
  }

  async toggleEquipmentStatus(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.TOGGLE_EQUIPMENT_STATUS(id)
    );
    return response.data;
  }

  // Exercises

  async createExercise(
    data: FormData
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.post<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.CREATE_EXERCISE,
      data
    );
    return response.data;
  }

  async getAllExercises(params?: TableQueryParams): Promise<PaginatedResponse<ExerciseRow>> {
    const queryParams = buildQueryParams(params);
    const response = await adminApi.get<{
      success: boolean;
      data: ExerciseRow[];
      pagination: PaginationMeta;
    }>(ADMIN_API_ROUTES.GET_EXERCISES, { params: queryParams });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getExerciseById(
    id: string
  ): Promise<ApiResponse<ExerciseRow>> {
    const response = await adminApi.get<ApiResponse<ExerciseRow>>(
      ADMIN_API_ROUTES.GET_EXERCISE_BY_ID(id)
    );
    return response.data;
  }

  async updateExercise(
    id: string,
    data: FormData
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.UPDATE_EXERCISE(id),
      data
    );
    return response.data;
  }

  async toggleExerciseStatus(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.TOGGLE_EXERCISE_STATUS(id)
    );
    return response.data;
  }

  async createMealCategory(mealCategoryData: MealCategory): Promise<ApiResponse<{message:string}>>{
    console.log("Meal category ", mealCategoryData)
    const response = await adminApi.post<ApiResponse<{message:string}>>(ADMIN_API_ROUTES.CREATE_MEAL_CATEGORY, mealCategoryData);
    return response.data
  }

  async getAllMealCategories(query: MealCategoryQueryDto): Promise<PaginatedResponse<MealCategory>> {
    const queryParams = buildQueryParams(query);
    const response = await adminApi.get<{
      success: boolean;
      message: string;
      data: MealCategory[];
      pagination: PaginationMeta;
    }>(
      ADMIN_API_ROUTES.GET_MEAL_CATEGORIES,
      { params: queryParams }
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  }

  async getMealCategoryById(id: string): Promise<MealCategory> {
    const response = await adminApi.get<ApiResponse<MealCategory>>(
      ADMIN_API_ROUTES.GET_MEAL_CATEGORY_BY_ID(id)
    );
    return response.data.data;
  }

  async updateMealCategory(id: string, data: Partial<UpdateMealCategory>): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.put<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.UPDATE_MEAL_CATEGORY(id),
      data
    );
    return response.data;
  }

  async toggleMealCategoryStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await adminApi.patch<ApiResponse<{ message: string }>>(
      ADMIN_API_ROUTES.TOGGLE_MEAL_CATEGORY_STATUS(id)
    );
    return response.data;
  }

  // Bookings
  async getAllBookings(params?: TableQueryParams & { status?: string; date?: string }): Promise<ApiResponse<TrainerBooking[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await adminApi.get(`${ADMIN_API_ROUTES.GET_ALL_BOOKINGS}?${queryParams.toString()}`);
    return response.data;
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<TrainerBooking>> {
    const url = ADMIN_API_ROUTES.CANCEL_BOOKING.replace(":bookingId", bookingId);
    const response = await adminApi.patch(url);
    return response.data;
  }
}

export default new AdminService();