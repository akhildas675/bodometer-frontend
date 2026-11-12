import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles.constants";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
import { Conversation } from "../types/chat.types";
import { chatService } from "../services/chat.service";
import { parseApiError } from "@/infrastructure/api/api-error";

export const useChatConversations = (queryConversationId?: string | null) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isTrainer = user?.role === ROLES.TRAINER;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const sortConversationsByRecent = useCallback((list: Conversation[]) => {
    return [...list].sort((a, b) => {
      const timeA = new Date(
        a.lastMessageAt || a.lastMessage?.createdAt || a.updatedAt || a.createdAt || 0,
      ).getTime();
      const timeB = new Date(
        b.lastMessageAt || b.lastMessage?.createdAt || b.updatedAt || b.createdAt || 0,
      ).getTime();
      return timeB - timeA;
    });
  }, []);

  // Load initial conversations list
  useEffect(() => {
    let isMounted = true;
    setLoadingConversations(true);

    chatService
      .getConversations()
      .then((data) => {
        if (!isMounted) return;
        const sorted = sortConversationsByRecent(data);
        setConversations(sorted);

        // If URL contains conversationId, select it automatically
        if (queryConversationId) {
          const matched = sorted.find((c) => c.id === queryConversationId);
          if (matched) {
            // Will be handled by parent component
          }
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load conversations:", err);
        const parsed = parseApiError(err);
        if (
          (parsed.statusCode === 403 ||
            parsed.message.toLowerCase().includes("subscription required")) &&
          !isTrainer
        ) {
          toast.error(
            "Active subscription required to use chat. Redirecting to plans...",
          );
          navigate(USER_UI_ROUTES.USER_SUBSCRIPTIONS);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingConversations(false);
      });

    return () => {
      isMounted = false;
    };
  }, [queryConversationId, isTrainer, navigate, sortConversationsByRecent]);

  return {
    conversations,
    setConversations,
    loadingConversations,
    sortConversationsByRecent,
  };
};
