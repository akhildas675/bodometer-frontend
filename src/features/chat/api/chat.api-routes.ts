export const CHAT_API_PATHS = {
  ROOT: "/chat",
  CONVERSATIONS: "/chat/conversations",
  MESSAGES: (conversationId: string) =>
    `/chat/conversations/${conversationId}/messages`,
  UPLOAD_ATTACHMENT: "/chat/upload-attachment",
} as const;
