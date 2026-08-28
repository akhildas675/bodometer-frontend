export const VIDEO_SESSION_API_PATHS = {
  BOOKING: (bookingId: string) => `/video-sessions/booking/${bookingId}`,
  REQUEST: "/video-sessions/request",
  ACCEPT: (id: string) => `/video-sessions/${id}/accept`,
  REJECT: (id: string) => `/video-sessions/${id}/reject`,
  JOIN: (id: string) => `/video-sessions/${id}/join`,
  LEAVE: (id: string) => `/video-sessions/${id}/leave`,
  END: (id: string) => `/video-sessions/${id}/end`,
} as const;
