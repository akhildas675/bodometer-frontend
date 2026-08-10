import { api } from "@/api/protected.instance";
import { ApiResponse } from "@/interface/api-response.interface";
import { TRAINER_AVAILABILITY_PATHS, TRAINER_BOOKING_SETTINGS_PATHS } from "../constant/api.routes";
import {
    TrainerAvailability,
    TrainerAvailabilityOverride,
    TrainerUnavailability,
    TrainerScheduleSetupPayload,
    TrainerBookingSettingsForm,
    CreateTrainerUnavailability,
} from "@/features/trainer/trainer.availability/types/trainer-availability.types";

export const trainerAvailabilityService = {


  async saveScheduleSetup(
    payload: TrainerScheduleSetupPayload
  ): Promise<ApiResponse<{ message: string }>> {

    console.log("Saving schedule setup payload:", payload);

    const response = await api.post<ApiResponse<{ message: string }>>(
      TRAINER_AVAILABILITY_PATHS.SETUP,
      payload
    );

    return response.data;
  },

  async getScheduleSetup(): Promise<ApiResponse<TrainerScheduleSetupPayload>> {
    const response = await api.get<ApiResponse<TrainerScheduleSetupPayload>>(
      TRAINER_AVAILABILITY_PATHS.SETUP
    );
    return response.data;
  },


  async getAvailability(): Promise<
    ApiResponse<TrainerAvailability[]>
  > {

    const response = await api.get<
      ApiResponse<TrainerAvailability[]>
    >(
      TRAINER_AVAILABILITY_PATHS.ROOT
    );

    return response.data;
  },


  async updateAvailability(
    data: Partial<TrainerAvailability>
  ): Promise<ApiResponse<{ message: string }>> {

    const response = await api.put<
      ApiResponse<{ message: string }>
    >(
      TRAINER_AVAILABILITY_PATHS.ROOT,
      data
    );

    return response.data;
  },

  async deleteAvailability(
    availabilityId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      TRAINER_AVAILABILITY_PATHS.BY_ID(availabilityId)
    );
    return response.data;
  },




  async getBookingSettings(): Promise<
    ApiResponse<TrainerBookingSettingsForm>
  > {

    const response = await api.get<
      ApiResponse<TrainerBookingSettingsForm>
    >(
      TRAINER_BOOKING_SETTINGS_PATHS.ROOT
    );

    return response.data;
  },


  async updateBookingSettings(
    data: Partial<TrainerBookingSettingsForm>
  ): Promise<ApiResponse<{ message: string }>> {

    const response = await api.put<
      ApiResponse<{ message: string }>
    >(
      TRAINER_BOOKING_SETTINGS_PATHS.ROOT,
      data
    );

    return response.data;
  },




  async getUnavailabilities(): Promise<
    ApiResponse<TrainerUnavailability[]>
  > {

    const response = await api.get<
      ApiResponse<TrainerUnavailability[]>
    >(
      TRAINER_AVAILABILITY_PATHS.UNAVAILABILITIES
    );

    return response.data;
  },


  async createUnavailability(
    data: CreateTrainerUnavailability
  ): Promise<ApiResponse<TrainerUnavailability>> {

    const response = await api.post<
      ApiResponse<TrainerUnavailability>
    >(
      TRAINER_AVAILABILITY_PATHS.UNAVAILABILITIES,
      data
    );

    return response.data;
  },


  async updateUnavailability(
    unavailabilityId: string,
    data: Partial<CreateTrainerUnavailability>
  ): Promise<ApiResponse<TrainerUnavailability>> {

    const response = await api.put<
      ApiResponse<TrainerUnavailability>
    >(
      TRAINER_AVAILABILITY_PATHS.UNAVAILABILITY_BY_ID(
        unavailabilityId
      ),
      data
    );

    return response.data;
  },


  async cancelUnavailability(
    unavailabilityId: string
  ): Promise<ApiResponse<{ message: string }>> {

    const response = await api.delete<
      ApiResponse<{ message: string }>
    >(
      TRAINER_AVAILABILITY_PATHS.UNAVAILABILITY_BY_ID(
        unavailabilityId
      )
    );

    return response.data;
  },


  async getOverrides(): Promise<
    ApiResponse<TrainerAvailabilityOverride[]>
  > {

    const response = await api.get<
      ApiResponse<TrainerAvailabilityOverride[]>
    >(
      TRAINER_AVAILABILITY_PATHS.OVERRIDES
    );

    return response.data;
  },


  async createOverride(
    data: Omit<
      TrainerAvailabilityOverride,
      "id" | "trainerId" | "status" | "createdAt"
    >
  ): Promise<ApiResponse<TrainerAvailabilityOverride>> {

    const response = await api.post<
      ApiResponse<TrainerAvailabilityOverride>
    >(
      TRAINER_AVAILABILITY_PATHS.OVERRIDES,
      data
    );

    return response.data;
  },


  async updateOverride(
    overrideId: string,
    data: Partial<TrainerAvailabilityOverride>
  ): Promise<ApiResponse<TrainerAvailabilityOverride>> {

    const response = await api.put<
      ApiResponse<TrainerAvailabilityOverride>
    >(
      TRAINER_AVAILABILITY_PATHS.OVERRIDE_BY_ID(overrideId),
      data
    );

    return response.data;
  },


  async cancelOverride(
    overrideId: string
  ): Promise<ApiResponse<{ message: string }>> {

    const response = await api.delete<
      ApiResponse<{ message: string }>
    >(
      TRAINER_AVAILABILITY_PATHS.OVERRIDE_BY_ID(overrideId)
    );

    return response.data;
  },
};