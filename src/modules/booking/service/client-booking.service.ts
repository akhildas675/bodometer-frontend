import { api } from "@/api/protected.instance";
import { ApiResponse } from "@/interface/api-response.interface";

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  bufferEndTime: string;
  formattedTime: string;
  startMinute: number;
  endMinute: number;
}

export interface AvailableDateOverview {
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  status: "AVAILABLE" | "LEAVE" | "OFF" | "FULL";
  slotCount: number;
}

export interface CreateBookingPayload {
  trainerId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  bufferEndTime: string;
  paymentMethod?: "WALLET" | "ONLINE" | "SPLIT";
}

export interface BookingCancellationDetails {
  cancelledBy: string;
  reason: string;
  cancelledAt: string;
  refundEligible: boolean;
  refundPercentage: number;
  refundAmount: number;
}

export interface BookingRescheduleRequestDetails {
  id: string;
  bookingId: string;
  requestedBy: string;
  oldStartTime: string;
  oldEndTime: string;
  proposedStartTime: string;
  proposedEndTime: string;
  proposedBufferEndTime: string;
  reason: string;
  status: string;
}

export interface BookingResponseData {
  id: string;
  bookingNumber: string;
  trainerId: string;
  userId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  bufferEndTime: string;
  status: string;
  price: number;
  paymentId?: string;
  userName?: string;
  userEmail?: string;
  serviceName?: string;
  serviceDuration?: number;
  serviceSnapshot?: {
    name: string;
    durationMinutes: number;
    bookingMode?: string;
  };
  cancellationDetails?: BookingCancellationDetails | null;
  rescheduleRequest?: BookingRescheduleRequestDetails | null;
}

export interface CreateBookingResponse {
  booking: BookingResponseData;
  checkoutUrl?: string;
  sessionId?: string;
}

class ClientBookingService {
  async getAvailableSlots(trainerId: string, serviceId: string, date: string): Promise<AvailableSlot[]> {
    const response = await api.get<ApiResponse<AvailableSlot[]>>("/booking/slots", {
      params: { trainerId, serviceId, date },
    });
    return response.data?.data || [];
  }

  async getAvailableDates(trainerId: string, serviceId: string, month: string): Promise<AvailableDateOverview[]> {
    const response = await api.get<ApiResponse<AvailableDateOverview[]>>("/booking/available-dates", {
      params: { trainerId, serviceId, month },
    });
    return response.data?.data || [];
  }

  async createBooking(payload: CreateBookingPayload): Promise<CreateBookingResponse> {
    const response = await api.post<ApiResponse<CreateBookingResponse>>("/booking/create", payload);
    return response.data?.data;
  }

  async verifyPayment(bookingId: string, sessionId: string): Promise<BookingResponseData> {
    const response = await api.post<ApiResponse<BookingResponseData>>("/booking/verify-payment", {
      bookingId,
      sessionId,
    });
    return response.data?.data;
  }

  async getUserBookings(): Promise<BookingResponseData[]> {
    const response = await api.get<ApiResponse<BookingResponseData[]>>("/booking/user/list");
    return response.data?.data || [];
  }

  async getTrainerBookings(filter: "upcoming" | "history" | "all" = "all"): Promise<BookingResponseData[]> {
    const response = await api.get<ApiResponse<BookingResponseData[]>>("/booking/trainer/list", {
      params: { filter },
    });
    return response.data?.data || [];
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<{ booking: BookingResponseData; cancellation: BookingCancellationDetails }> {
    const response = await api.post<ApiResponse<{ booking: BookingResponseData; cancellation: BookingCancellationDetails }>>(
      `/booking/${bookingId}/cancel`,
      { reason },
    );
    return response.data?.data;
  }

  async proposeRescheduleByTrainer(
    bookingId: string,
    proposedStartTime: string,
    proposedEndTime: string,
    proposedBufferEndTime: string,
    reason: string,
  ): Promise<BookingRescheduleRequestDetails> {
    const response = await api.post<ApiResponse<BookingRescheduleRequestDetails>>(`/booking/${bookingId}/reschedule/trainer-propose`, {
      proposedStartTime,
      proposedEndTime,
      proposedBufferEndTime,
      reason,
    });
    return response.data?.data;
  }

  async respondToRescheduleRequest(requestId: string, accept: boolean, reason?: string): Promise<{ request: BookingRescheduleRequestDetails; booking: BookingResponseData }> {
    const response = await api.post<ApiResponse<{ request: BookingRescheduleRequestDetails; booking: BookingResponseData }>>(
      `/booking/reschedule-request/${requestId}/respond`,
      { accept, reason },
    );
    return response.data?.data;
  }

  async getUserPendingRescheduleRequests(): Promise<{ request: BookingRescheduleRequestDetails; booking: BookingResponseData }[]> {
    const response = await api.get<ApiResponse<{ request: BookingRescheduleRequestDetails; booking: BookingResponseData }[]>>(
      "/booking/user/reschedule-requests",
    );
    return response.data?.data || [];
  }
}

export const clientBookingService = new ClientBookingService();
