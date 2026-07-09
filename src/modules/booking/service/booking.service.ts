import { api } from "@/api/api.instance";
import type { ApiResponse } from "@/interface/api-response.interface";
import type { PaginationMeta } from "@/interface/common.interface";
import { BOOKING_API_ROUTES } from "@/modules/booking/constant/api.constant.ts/api-routes";
import {
  BookingQueryParams,
  CreateAvailabilityPayload,
  CreateBookingPayload,
  RejectCancelBookingPayload,
  TrainerBookingItem,
  TrainerSlot,
  UserBookingItem,
} from "../types/booking.interface";

class BookingService {
 

  async createAvailability(
    data: CreateAvailabilityPayload
  ): Promise<ApiResponse<{ message: string; generatedSlots: number }>> {
    const response = await api.post(BOOKING_API_ROUTES.CREATE_AVAILABILITY, data);
    return response.data;
  }


  async getMySlots(
    params?: BookingQueryParams
  ): Promise<ApiResponse<TrainerSlot[]> & { pagination: PaginationMeta }> {
    const response = await api.get(BOOKING_API_ROUTES.GET_MY_SLOTS, {
      params,
    });
    return response.data;
  }



  async getTrainerAvailableSlots(
    trainerId: string
  ): Promise<ApiResponse<TrainerSlot[]>> {
    const response = await api.get(
      BOOKING_API_ROUTES.GET_TRAINER_AVAILABLE_SLOTS(trainerId)
    );
    return response.data;
  }


  async blockSlot(slotId: string): Promise<ApiResponse<void>> {
    const response = await api.patch(BOOKING_API_ROUTES.BLOCK_SLOT(slotId));
    return response.data;
  }


  async unblockSlot(slotId: string): Promise<ApiResponse<void>> {
    const response = await api.patch(BOOKING_API_ROUTES.UNBLOCK_SLOT(slotId));
    return response.data;
  }




  //user booking
  async createBooking(
    data: CreateBookingPayload
  ): Promise<ApiResponse<void>> {
    const response = await api.post(BOOKING_API_ROUTES.CREATE_BOOKING, data);
    return response.data;
  }


  async acceptBooking(bookingId: string): Promise<ApiResponse<void>> {
    const response = await api.patch(
      BOOKING_API_ROUTES.ACCEPT_BOOKING(bookingId)
    );
    return response.data;
  }


  async rejectBooking(
    bookingId: string,
    data: RejectCancelBookingPayload
  ): Promise<ApiResponse<void>> {
    const response = await api.patch(
      BOOKING_API_ROUTES.REJECT_BOOKING(bookingId),
      data
    );
    return response.data;
  }

 
  async cancelBooking(
    bookingId: string,
    data?: RejectCancelBookingPayload
  ): Promise<ApiResponse<void>> {
    const response = await api.patch(
      BOOKING_API_ROUTES.CANCEL_BOOKING(bookingId),
      data || { reason: "Cancellation requested" }
    );
    return response.data;
  }


  async getTrainerBookings(
    params?: BookingQueryParams
  ): Promise<ApiResponse<TrainerBookingItem[]> & { pagination: PaginationMeta }> {
    const response = await api.get(BOOKING_API_ROUTES.GET_TRAINER_BOOKINGS, {
      params,
    });
    return response.data;
  }


  async getUserBookings(
    params?: BookingQueryParams
  ): Promise<ApiResponse<UserBookingItem[]> & { pagination: PaginationMeta }> {
    const response = await api.get(BOOKING_API_ROUTES.GET_MY_BOOKINGS, {
      params,
    });
    return response.data;
  }

 
  async getAllBookings(
    params?: BookingQueryParams
  ): Promise<ApiResponse<TrainerBookingItem[]> & { pagination: PaginationMeta }> {
    const response = await api.get(BOOKING_API_ROUTES.GET_TRAINER_BOOKINGS, {
      params,
    });
    return response.data;
  }
}

export const bookingService = new BookingService();

