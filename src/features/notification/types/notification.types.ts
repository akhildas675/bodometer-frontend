export interface NotificationItem {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationPaginationResponse {
  data: NotificationItem[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
