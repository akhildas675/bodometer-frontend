export const VIDEO_SESSION_API_PATHS = {
  REQUEST: (bookingId: string) => `/video-session/${bookingId}/request`,

  ACCEPT: (videoSessionId: string) => `/video-session/${videoSessionId}/accept`,

  REJECT: (videoSessionId: string) => `/video-session/${videoSessionId}/reject`,

  JOIN: (videoSessionId: string) => `/video-session/${videoSessionId}/join`,

  LEAVE: (videoSessionId: string) => `/video-session/${videoSessionId}/leave`,

  GET_BY_ID: (videoSessionId: string) => `/video-session/${videoSessionId}`,

  GET_BY_BOOKING_ID: (bookingId: string) => `/video-session/booking/${bookingId}`,

  END: (videoSessionId: string) => `/video-session/${videoSessionId}/end`,

  HISTORY: "/video-session/history",

  REFUND_REQUEST: (videoSessionId: string) => `/video-session/${videoSessionId}/refund-request`,
  CLAIM_EXPIRED_REFUND: (bookingId: string) => `/video-session/booking/${bookingId}/claim-expired-refund`,
} as const;