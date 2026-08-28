import { api } from "@/api/protected.instance";
import { VIDEO_SESSION_API_PATHS } from "../constant/api-routes";
import { VideoSession } from "../types/video-session.types";
import { ApiResponse } from "@/interface/api-response.interface";

export const getVideoSession = async (
  bookingId: string,
): Promise<VideoSession> => {
  const response = await api.get<ApiResponse<VideoSession>>(
    VIDEO_SESSION_API_PATHS.BOOKING(bookingId),
  );
  return response.data.data;
};

export const requestCall = async (
  bookingId: string,
): Promise<VideoSession> => {
  const response = await api.post<ApiResponse<VideoSession>>(
    VIDEO_SESSION_API_PATHS.REQUEST,
    { bookingId },
  );
  return response.data.data;
};

export const acceptCall = async (
  videoSessionId: string,
): Promise<VideoSession> => {
  const response = await api.post<ApiResponse<VideoSession>>(
    VIDEO_SESSION_API_PATHS.ACCEPT(videoSessionId),
  );
  return response.data.data;
};

export const rejectCall = async (
  videoSessionId: string,
): Promise<VideoSession> => {
  const response = await api.post<ApiResponse<VideoSession>>(
    VIDEO_SESSION_API_PATHS.REJECT(videoSessionId),
  );
  return response.data.data;
};

export const joinSession = async (
  videoSessionId: string,
): Promise<VideoSession> => {
  const response = await api.post<ApiResponse<VideoSession>>(
    VIDEO_SESSION_API_PATHS.JOIN(videoSessionId),
  );
  return response.data.data;
};

export const leaveSession = async (
  videoSessionId: string,
): Promise<VideoSession> => {
  const response = await api.post<ApiResponse<VideoSession>>(
    VIDEO_SESSION_API_PATHS.LEAVE(videoSessionId),
  );
  return response.data.data;
};

export const endSession = async (
  videoSessionId: string,
): Promise<VideoSession> => {
  const response = await api.post<ApiResponse<VideoSession>>(
    VIDEO_SESSION_API_PATHS.END(videoSessionId),
  );
  return response.data.data;
};

export const videoSessionService = {
  getVideoSession,
  requestCall,
  acceptCall,
  rejectCall,
  joinSession,
  leaveSession,
  endSession,
};
