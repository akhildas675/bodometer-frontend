import { Role } from "@/constants/roles.constants";

export const CHAT_TYPE = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  DOCUMENT: "DOCUMENT",
} as const;

export type ChatType = (typeof CHAT_TYPE)[keyof typeof CHAT_TYPE];

export interface ChatParticipant {
  id: string;
  name: string;
  role: Role;
  profilePic?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: ChatType;
  createdAt: string;
  updatedAt: string;
  isRead?: boolean;
  readAt?: string;
  isOptimistic?: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants?: ChatParticipant[];
  lastMessageId?: string;
  lastMessageAt?: string;
  lastMessage?: ChatMessage | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  messageType: ChatType;
}

export interface CreateConversationPayload {
  trainerId: string;
}

export interface ChatAttachment {
  fileUrl: string;
  messageType: ChatType;
  fileName: string;
  fileSize: number;
}
