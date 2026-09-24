import { api } from "@/infrastructure/api/protected-client";
import { ApiResponse } from "@/types/api.types";
import { CHAT_API_PATHS } from "../api/chat.api-routes";
import {
  Conversation,
  ChatMessage,
  ChatType,
  CHAT_TYPE,
  ChatAttachment,
} from "../types/chat.types";

class ChatService {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<ApiResponse<Conversation[]>>(
      CHAT_API_PATHS.CONVERSATIONS,
    );
    return response.data?.data ?? [];
  }

  async getOrCreateConversation(trainerId: string): Promise<Conversation> {
    const response = await api.post<ApiResponse<Conversation>>(
      CHAT_API_PATHS.CONVERSATIONS,
      {
        trainerId,
      },
    );
    return response.data.data;
  }

  async getConversationMessages(
    conversationId: string,
  ): Promise<ChatMessage[]> {
    const response = await api.get<ApiResponse<ChatMessage[]>>(
      CHAT_API_PATHS.MESSAGES(conversationId),
    );
    return response.data?.data ?? [];
  }

  async sendMessage(
    conversationId: string,
    content: string,
    messageType: ChatType = CHAT_TYPE.TEXT,
  ): Promise<ChatMessage> {
    const response = await api.post<ApiResponse<ChatMessage>>(
      CHAT_API_PATHS.MESSAGES(conversationId),
      {
        content,
        messageType,
      },
    );
    return response.data.data;
  }

  async uploadAttachment(file: File): Promise<ChatAttachment> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ApiResponse<ChatAttachment>>(
      CHAT_API_PATHS.UPLOAD_ATTACHMENT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  }
}

export const chatService = new ChatService();
