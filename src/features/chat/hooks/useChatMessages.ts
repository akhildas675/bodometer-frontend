import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Conversation, ChatMessage } from "../types/chat.types";
import { chatService } from "../services/chat.service";
import {
  joinChatConversation,
  leaveChatConversation,
  markChatAsRead,
} from "../sockets/chat.socket";

export const useChatMessages = (
  activeConversation: Conversation | null,
  scrollToBottom: (smooth?: boolean) => void,
  messagesContainerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 150;
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold
    );
  }, [messagesContainerRef]);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const conversationId = activeConversation.id;

    // Join socket room
    joinChatConversation(conversationId);
    setLoadingMessages(true);

    chatService
      .getConversationMessages(conversationId)
      .then((data) => {
        if (!isMounted) return;
        setMessages(data);
        scrollToBottom(false);
        // Mark conversation messages as seen
        markChatAsRead(conversationId);
      })
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
        toast.error("Failed to load chat messages.");
      })
      .finally(() => {
        if (isMounted) {
          setLoadingMessages(false);
          scrollToBottom(false);
        }
      });

    return () => {
      isMounted = false;
      leaveChatConversation(conversationId);
    };
  }, [activeConversation, scrollToBottom, messagesContainerRef]);

  return {
    messages,
    setMessages,
    loadingMessages,
    isNearBottom,
  };
};
