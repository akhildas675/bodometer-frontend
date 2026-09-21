export const NOTIFICATION_API_PATHS = {
  ROOT: "/notifications",
  UNREAD_COUNT: "/notifications/unread-count",
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: "/notifications/read-all",
} as const;
