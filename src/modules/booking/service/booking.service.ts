import { api } from "@/api/api.instance";
import { buildQueryParams, TableQueryParams } from "@/api/query.helper";
import { PaginationMeta } from "@/interface/common.interface";
import type { ApiResponse } from "@/interface/api-response.interface";
import { TrainerAvailability, CreateAvailabilityPayload, UpdateAvailabilityPayload, TrainerBooking, TrainerDynamicSlot } from "@/interface/booking.interface";
import { BOOKING_API_ROUTES } from "@/modules/booking/constant/api-routes";

class BookingService {
  async createAvailability(data: CreateAvailabilityPayload): Promise<ApiResponse<{ message: string; generatedSlots: number }>> {
    const response = await api.post(BOOKING_API_ROUTES.AVAILABILITY, data);
    return response.data;
  }

  async getAvailabilities(params?: TableQueryParams & { status?: string }): Promise<ApiResponse<TrainerAvailability[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(`${BOOKING_API_ROUTES.AVAILABILITY}?${queryParams.toString()}`);
    return response.data;
  }

  async updateAvailabilityStatus(availabilityId: string, data: UpdateAvailabilityPayload): Promise<ApiResponse<TrainerAvailability>> {
    const response = await api.patch(BOOKING_API_ROUTES.AVAILABILITY_STATUS(availabilityId), data);
    return response.data;
  }

  async getAllBookings(params?: TableQueryParams): Promise<ApiResponse<TrainerBooking[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(`${BOOKING_API_ROUTES.BOOKINGS}?${queryParams.toString()}`);
    return response.data;
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<TrainerBooking>> {
    const response = await api.patch(BOOKING_API_ROUTES.CANCEL_BOOKING(bookingId), { reason });
    return response.data;
  }

  async getMyBookings(params?: TableQueryParams): Promise<ApiResponse<TrainerBooking[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(`${BOOKING_API_ROUTES.MY_BOOKINGS}?${queryParams.toString()}`);
    return response.data;
  }

  async confirmBooking(bookingId: string): Promise<ApiResponse<TrainerBooking>> {
    const response = await api.patch(BOOKING_API_ROUTES.CONFIRM_BOOKING(bookingId));
    return response.data;
  }

  async rejectBooking(bookingId: string, reason?: string): Promise<ApiResponse<TrainerBooking>> {
    const response = await api.patch(BOOKING_API_ROUTES.REJECT_BOOKING(bookingId), { reason });
    return response.data;
  }

  async completeBooking(bookingId: string): Promise<ApiResponse<TrainerBooking>> {
    const response = await api.patch(BOOKING_API_ROUTES.COMPLETE_BOOKING(bookingId));
    return response.data;
  }

  async getTrainerSlots(trainerId: string, params: { from: string; to: string }): Promise<ApiResponse<TrainerDynamicSlot[]>> {
    const response = await api.get(`${BOOKING_API_ROUTES.TRAINER_SLOTS(trainerId)}?from=${params.from}&to=${params.to}`);
    return response.data;
  }

  async createBooking(data: { trainerId: string; availabilityId?: string; date: string; startTime: string; endTime: string; bookingType: string; userNotes?: string }): Promise<ApiResponse<TrainerBooking>> {
    const response = await api.post(BOOKING_API_ROUTES.BOOKINGS, data);
    return response.data;
  }

  async getUserBookings(params?: TableQueryParams): Promise<ApiResponse<TrainerBooking[]> & { pagination: PaginationMeta }> {
    const queryParams = buildQueryParams({ page: 1, limit: 10, ...params });
    const response = await api.get(`${BOOKING_API_ROUTES.USER_BOOKINGS}?${queryParams.toString()}`);
    return response.data;
  }
}

export const bookingService = new BookingService();
