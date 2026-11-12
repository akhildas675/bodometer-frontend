import { useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { Conversation, ChatMessage, CHAT_TYPE, ChatParticipant } from "../types/chat.types";
import { chatService } from "../services/chat.service";
import { sendChatSocketMessage } from "../sockets/chat.socket";
import { parseApiError } from "@/infrastructure/api/api-error";

export const useChatActions = (
  activeConversation: Conversation | null,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  scrollToBottom: (smooth?: boolean) => void,
  getOtherParticipant: (conv: Conversation) => ChatParticipant | undefined,
) => {
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || (user as { _id?: string })?._id || "";

  // Send Message Action
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeConversation) return;

      const conversationId = activeConversation.id;
      const otherParticipant = getOtherParticipant(activeConversation);
      const receiverId = otherParticipant?.id || "";

      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversationId,
        senderId: currentUserId,
        receiverId,
        content,
        messageType: CHAT_TYPE.TEXT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true,
      };

      // Instantly append optimistic message to UI
      setMessages((prev) => [...prev, optimisticMessage]);
      scrollToBottom();

      try {
        // Send via real-time WebSocket
        sendChatSocketMessage(conversationId, content, CHAT_TYPE.TEXT);
      } catch {
        // Fallback to REST API if socket send fails
        try {
          const saved = await chatService.sendMessage(
            conversationId,
            content,
            CHAT_TYPE.TEXT,
          );
          setMessages((prev) =>
            prev.map((m) => (m.id === optimisticMessage.id ? saved : m)),
          );
        } catch (err: unknown) {
          const parsed = parseApiError(err);
          toast.error(parsed.message || "Failed to send message.");
          setMessages((prev) =>
            prev.filter((m) => m.id !== optimisticMessage.id),
          );
        }
      }
    },
    [activeConversation, currentUserId, getOtherParticipant, scrollToBottom, setMessages],
  );

  // Send File (Image or Document) Action
  const handleSendFile = useCallback(
    async (file: File) => {
      if (!activeConversation) return;

      const conversationId = activeConversation.id;
      const otherParticipant = getOtherParticipant(activeConversation);
      const receiverId = otherParticipant?.id || "";

      try {
        // Upload to S3 via backend
        const attachment = await chatService.uploadAttachment(file);
        const fileContent = `${attachment.fileUrl}?filename=${encodeURIComponent(attachment.fileName)}`;

        const optimisticMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          conversationId,
          senderId: currentUserId,
          receiverId,
          content: fileContent,
          messageType: attachment.messageType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isOptimistic: true,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        scrollToBottom();

        try {
          sendChatSocketMessage(
            conversationId,
            fileContent,
            attachment.messageType,
          );
        } catch {
          try {
            const saved = await chatService.sendMessage(
              conversationId,
              fileContent,
              attachment.messageType,
            );
            setMessages((prev) =>
              prev.map((m) => (m.id === optimisticMessage.id ? saved : m)),
            );
          } catch (err: unknown) {
            const parsed = parseApiError(err);
            toast.error(parsed.message || "Failed to send file.");
            setMessages((prev) =>
              prev.filter((m) => m.id !== optimisticMessage.id),
            );
          }
        }
      } catch (err: unknown) {
        const parsed = parseApiError(err);
        toast.error(parsed.message || "Failed to upload file to S3.");
      }
    },
    [activeConversation, currentUserId, getOtherParticipant, scrollToBottom, setMessages],
  );

  return {
    handleSendMessage,
    handleSendFile,
  };
};
