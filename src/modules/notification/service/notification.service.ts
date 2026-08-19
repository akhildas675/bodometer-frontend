import { api } from "@/api/protected.instance";
import { NOTIFICATION_API_PATHS } from "../constant/api-routes";
import { NotificationItem, UnreadCountResponse } from "@/interface/notification.interface";
import { ApiResponse } from "@/interface/api-response.interface";

export const notificationService = {
  async getNotifications(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<NotificationItem[]> & { totalItems: number; page: number; limit: number }> {
    const response = await api.get(`${NOTIFICATION_API_PATHS.ROOT}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUnreadCount(): Promise<ApiResponse<UnreadCountResponse> & { unreadCount: number }> {
    const response = await api.get(NOTIFICATION_API_PATHS.UNREAD_COUNT);
    return response.data;
  },

  async markAsRead(id: string): Promise<ApiResponse<NotificationItem>> {
    const response = await api.patch(NOTIFICATION_API_PATHS.MARK_READ(id));
    return response.data;
  },

  async markAllAsRead(): Promise<ApiResponse<{ message: string }>> {
    const response = await api.patch(NOTIFICATION_API_PATHS.MARK_ALL_READ);
    return response.data;
  },
};
