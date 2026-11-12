import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles.constants";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
import { Conversation, ChatMessage, CHAT_TYPE, ChatParticipant } from "../types/chat.types";
import {
  sendChatSocketMessage,
  onChatMessage,
  offChatMessage,
  onChatSent,
  offChatSent,
  onChatNotification,
  offChatNotification,
  onChatError,
  offChatError,
  onChatSeen,
  offChatSeen,
  markChatAsRead,
} from "../sockets/chat.socket";
import { chatService } from "../services/chat.service";
import { parseApiError } from "@/infrastructure/api/api-error";

export const useChatSocket = (
  activeConversation: Conversation | null,
  activeConversationRef: React.RefObject<Conversation | null>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  scrollToBottom: (smooth?: boolean) => void,
  isNearBottom: () => boolean,
  sortConversationsByRecent: (list: Conversation[]) => Conversation[],
) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || (user as { _id?: string })?._id || "";
  const isTrainer = user?.role === ROLES.TRAINER;

  // Socket event handlers
  useEffect(() => {
    // Other participant sent a message
    const handleMessage = (incomingMsg: ChatMessage) => {
      const currentActive = activeConversationRef.current;

      if (currentActive && incomingMsg.conversationId === currentActive.id) {
        const wasNearBottom = isNearBottom();
        setMessages((prev) => {
          if (prev.some((m) => m.id === incomingMsg.id)) return prev;
          return [...prev, incomingMsg];
        });
        if (wasNearBottom) {
          scrollToBottom(true);
        }
        // Active viewer reads incoming message immediately
        markChatAsRead(currentActive.id);
      }

      // Update conversations list with latest message and move to top
      setConversations((prev) => {
        const index = prev.findIndex(
          (c) => c.id === incomingMsg.conversationId,
        );
        if (index === -1) {
          void chatService.getConversations().then((data) => {
            setConversations(sortConversationsByRecent(data));
          });
          return prev;
        }

        const updated = [...prev];
        const [conv] = updated.splice(index, 1);
        const refreshed: Conversation = {
          ...conv,
          lastMessage: incomingMsg,
          lastMessageAt: incomingMsg.createdAt,
          updatedAt: incomingMsg.createdAt,
        };

        // Move to top of list
        return [refreshed, ...updated];
      });
    };

    // Server confirmed my sent message
    const handleSent = (savedMsg: ChatMessage) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.isOptimistic && m.content === savedMsg.content ? savedMsg : m,
        ),
      );

      // Update conversations list and move to top
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === savedMsg.conversationId);
        if (index === -1) return prev;

        const updated = [...prev];
        const [conv] = updated.splice(index, 1);
        const refreshed: Conversation = {
          ...conv,
          lastMessage: savedMsg,
          lastMessageAt: savedMsg.createdAt,
          updatedAt: savedMsg.createdAt,
        };

        // Move to top of list
        return [refreshed, ...updated];
      });
    };

    // Push notification for a message in another thread
    const handleNotification = (data: {
      conversationId: string;
      message: ChatMessage;
    }) => {
      const currentActive = activeConversationRef.current;
      if (!currentActive || currentActive.id !== data.conversationId) {
        const preview =
          data.message.messageType === CHAT_TYPE.IMAGE
            ? "📷 Sent a photo"
            : data.message.messageType === CHAT_TYPE.DOCUMENT
              ? "📄 Sent a document"
              : `${data.message.content.slice(0, 40)}...`;
        toast.info(`New message: ${preview}`);
      }
    };

    // Other participant viewed the conversation -> show blue ticks for messages sent by me
    const handleSeen = (data: {
      conversationId: string;
      readerId: string;
      readAt: string;
    }) => {
      const currentActive = activeConversationRef.current;
      if (currentActive && currentActive.id === data.conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderId === currentUserId
              ? { ...m, isRead: true, readAt: data.readAt }
              : m,
          ),
        );
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (
            c.id === data.conversationId &&
            c.lastMessage &&
            c.lastMessage.senderId === currentUserId
          ) {
            return {
              ...c,
              lastMessage: {
                ...c.lastMessage,
                isRead: true,
                readAt: data.readAt,
              },
            };
          }
          return c;
        }),
      );
    };

    // Socket error
    const handleError = (data: { event?: string; message: string }) => {
      toast.error(data.message || "Chat socket error");
      if (
        data.message?.toLowerCase().includes("subscription required") &&
        !isTrainer
      ) {
        navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS);
      }
    };

    onChatMessage(handleMessage);
    onChatSent(handleSent);
    onChatNotification(handleNotification);
    onChatError(handleError);
    onChatSeen(handleSeen);

    return () => {
      offChatMessage(handleMessage);
      offChatSent(handleSent);
      offChatNotification(handleNotification);
      offChatError(handleError);
      offChatSeen(handleSeen);
    };
  }, [scrollToBottom, isTrainer, navigate, currentUserId, activeConversationRef, setMessages, setConversations, sortConversationsByRecent, isNearBottom]);

  return {
    sendSocketMessage: sendChatSocketMessage,
  };
};
