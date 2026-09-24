import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles.constants";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
import {
  Conversation,
  ChatMessage,
  ChatParticipant,
  CHAT_TYPE,
} from "../types/chat.types";
import { chatService } from "../services/chat.service";
import {
  joinChatConversation,
  leaveChatConversation,
  sendChatSocketMessage,
  onChatMessage,
  offChatMessage,
  onChatSent,
  offChatSent,
  onChatNotification,
  offChatNotification,
  onChatError,
  offChatError,
  markChatAsRead,
  onChatSeen,
  offChatSeen,
} from "../sockets/chat.socket";
import { parseApiError } from "@/infrastructure/api/api-error";
import { ChatConversationList } from "./ChatConversationList";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatMessageInput } from "./ChatMessageInput";
import { ChatEmptyState } from "./ChatEmptyState";
import { Loader2 } from "lucide-react";

export const ChatView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConversationId = searchParams.get("conversationId");

  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || (user as { _id?: string })?._id || "";
  const isTrainer = user?.role === ROLES.TRAINER;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversationRef = useRef<Conversation | null>(null);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

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

  // 1. Load initial conversations list
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
            setActiveConversation(matched);
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
  }, [queryConversationId, isTrainer, navigate]);

  // 2. Load messages whenever active conversation changes
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
        setTimeout(() => scrollToBottom(false), 50);
        // Mark conversation messages as seen
        markChatAsRead(conversationId);
      })
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
        toast.error("Failed to load chat messages.");
      })
      .finally(() => {
        if (isMounted) setLoadingMessages(false);
      });

    return () => {
      isMounted = false;
      leaveChatConversation(conversationId);
    };
  }, [activeConversation, scrollToBottom]);

  // 3. Socket event handlers
  useEffect(() => {
    // Other participant sent a message
    const handleMessage = (incomingMsg: ChatMessage) => {
      const currentActive = activeConversationRef.current;

      if (currentActive && incomingMsg.conversationId === currentActive.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === incomingMsg.id)) return prev;
          return [...prev, incomingMsg];
        });
        setTimeout(() => scrollToBottom(), 50);
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
  }, [scrollToBottom, isTrainer, navigate, currentUserId]);

  const getOtherParticipant = useCallback(
    (conv: Conversation): ChatParticipant | undefined => {
      if (!conv.participants?.length) {
        const otherId = conv.participantIds.find((id) => id !== currentUserId);
        return otherId
          ? { id: otherId, name: "Chat Partner", role: ROLES.USER }
          : undefined;
      }
      return (
        conv.participants.find((p) => p.id && p.id !== currentUserId) ||
        conv.participants.find((p) => p.id !== currentUserId) ||
        conv.participants[0]
      );
    },
    [currentUserId],
  );

  // 4. Send Message Action
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
      setTimeout(() => scrollToBottom(), 20);

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
    [activeConversation, currentUserId, getOtherParticipant, scrollToBottom],
  );

  // 5. Send File (Image or Document) Action
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
        setTimeout(() => scrollToBottom(), 20);

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
    [activeConversation, currentUserId, getOtherParticipant, scrollToBottom],
  );

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setSearchParams({ conversationId: conv.id });
  };

  const handleBackToList = () => {
    setActiveConversation(null);
    setSearchParams({});
  };

  const activeOtherParticipant = activeConversation
    ? getOtherParticipant(activeConversation)
    : undefined;

  return (
    <div className="h-[calc(100vh-5rem)] max-w-7xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex bg-[#06011a] text-white">
      {/* Left Column: Conversations List */}
      <div
        className={`${
          activeConversation ? "hidden md:flex" : "flex"
        } w-full md:w-auto h-full shrink-0`}
      >
        <ChatConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={handleSelectConversation}
          currentUserId={currentUserId}
          loading={loadingConversations}
        />
      </div>

      {/* Right Column: Active Conversation Messages & Input */}
      <div
        className={`${
          !activeConversation ? "hidden md:flex" : "flex"
        } flex-1 flex-col h-full bg-[#08021f]/90 relative min-w-0`}
      >
        {activeConversation ? (
          <>
            {/* Header */}
            <ChatHeader
              participant={activeOtherParticipant}
              onBack={handleBackToList}
              showBackButton={true}
            />

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 chat-scroll-dark">
              {loadingMessages ? (
                <div className="h-full flex items-center justify-center text-purple-400 gap-2">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-xs font-semibold">
                    Loading messages...
                  </span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40 text-xs text-center p-6 space-y-2">
                  <p className="font-semibold text-slate-300">
                    No messages yet.
                  </p>
                  <p>Say hello to start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessageBubble
                    key={msg.id}
                    message={msg}
                    isSelf={msg.senderId === currentUserId}
                    sender={
                      msg.senderId === currentUserId
                        ? undefined
                        : activeOtherParticipant
                    }
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <ChatMessageInput
              onSendMessage={handleSendMessage}
              onSendFile={handleSendFile}
              placeholder={`Message ${activeOtherParticipant?.name || "here"}...`}
            />
          </>
        ) : (
          <ChatEmptyState
            hasConversations={conversations.length > 0}
            onBrowseTrainers={() => navigate(USER_UI_ROUTES.USER_TRAINERS)}
            isTrainer={isTrainer}
          />
        )}
      </div>
    </div>
  );
};
