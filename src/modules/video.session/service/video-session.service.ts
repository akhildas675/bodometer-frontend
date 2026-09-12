import { api } from "@/api/protected.instance";
import { ApiResponse } from "@/interface/api-response.interface";
import { VideoSession } from "../types";
import { VIDEO_SESSION_API_PATHS } from "../constant/video-session.constant";

class VideoSessionService {
  async requestCall(bookingId: string): Promise<VideoSession> {
    const response = await api.post<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.REQUEST(bookingId),
    );

    return response.data?.data;
  }

  async acceptCall(videoSessionId: string): Promise<VideoSession> {
    const response = await api.post<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.ACCEPT(videoSessionId),
    );

    return response.data?.data;
  }

  async rejectCall(videoSessionId: string): Promise<VideoSession> {
    const response = await api.post<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.REJECT(videoSessionId),
    );

    return response.data?.data;
  }

  async joinSession(videoSessionId: string): Promise<VideoSession> {
    const response = await api.post<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.JOIN(videoSessionId),
    );

    return response.data?.data;
  }

  async leaveSession(videoSessionId: string): Promise<VideoSession> {
    const response = await api.post<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.LEAVE(videoSessionId),
    );

    return response.data?.data;
  }

  async getVideoSession(videoSessionId: string): Promise<VideoSession> {
    const response = await api.get<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.GET_BY_ID(videoSessionId),
    );

    return response.data?.data;
  }

  async endSession(videoSessionId: string): Promise<VideoSession> {
    const response = await api.post<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.END(videoSessionId),
    );

    return response.data.data;
  }

  async getVideoSessionByBookingId(
    bookingId: string,
  ): Promise<VideoSession | null> {
    const response = await api.get<ApiResponse<VideoSession | null>>(
      VIDEO_SESSION_API_PATHS.GET_BY_BOOKING_ID(bookingId),
    );

    return response.data?.data ?? null;
  }

  async requestRefund(videoSessionId: string): Promise<VideoSession> {
    const response = await api.post<ApiResponse<VideoSession>>(
      VIDEO_SESSION_API_PATHS.REFUND_REQUEST(videoSessionId),
    );
    return response.data?.data;
  }

  async claimExpiredBookingRefund(bookingId: string): Promise<{ booking: unknown; refund: unknown; videoSession?: VideoSession }> {
    const response = await api.post<ApiResponse<{ booking: unknown; refund: unknown; videoSession?: VideoSession }>>(
      VIDEO_SESSION_API_PATHS.CLAIM_EXPIRED_REFUND(bookingId),
    );
    return response.data?.data;
  }

  async getVideoSessionHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    refundStatus?: string;
  }): Promise<{
    sessions: VideoSession[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get<
      ApiResponse<{
        sessions: VideoSession[];
        total: number;
        page: number;
        limit: number;
      }>
    >(VIDEO_SESSION_API_PATHS.HISTORY, { params });
    return response.data?.data;
  }
}

export const videoSessionService = new VideoSessionService();