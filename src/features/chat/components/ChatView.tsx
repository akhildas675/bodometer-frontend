import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles.constants";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
import {
  Conversation,
  ChatParticipant,
} from "../types/chat.types";
import { ChatConversationList } from "./ChatConversationList";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatMessageInput } from "./ChatMessageInput";
import { ChatEmptyState } from "./ChatEmptyState";
import { Loader2 } from "lucide-react";
import { useChatConversations } from "../hooks/useChatConversations";
import { useChatMessages } from "../hooks/useChatMessages";
import { useChatSocket } from "../hooks/useChatSocket";
import { useChatActions } from "../hooks/useChatActions";

export const ChatView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryConversationId = searchParams.get("conversationId");

  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || (user as { _id?: string })?._id || "";
  const isTrainer = user?.role === ROLES.TRAINER;

  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const activeConversationRef = useRef<Conversation | null>(null);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Refs for scroll functions
  const scrollToBottomRef = useRef<(smooth?: boolean) => void>(() => {});
  const isNearBottomRef = useRef<() => boolean>(() => true);

  // Custom hooks
  const {
    conversations,
    setConversations,
    loadingConversations,
    sortConversationsByRecent,
  } = useChatConversations(queryConversationId);

  // Set up scroll functions in refs for hooks to use
  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (container) {
        if (smooth) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        } else {
          container.scrollTop = container.scrollHeight;
        }
      }
    });
  }, []);

  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 150;
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold
    );
  }, []);

  useEffect(() => {
    scrollToBottomRef.current = scrollToBottom;
    isNearBottomRef.current = isNearBottom;
  }, [scrollToBottom, isNearBottom]);

  const {
    messages,
    setMessages,
    loadingMessages,
  } = useChatMessages(
    activeConversation,
    scrollToBottomRef.current,
    messagesContainerRef,
  );

  useChatSocket(
    activeConversation,
    activeConversationRef,
    setMessages,
    setConversations,
    scrollToBottomRef.current,
    isNearBottomRef.current,
    sortConversationsByRecent,
  );

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

  const { handleSendMessage, handleSendFile } = useChatActions(
    activeConversation,
    setMessages,
    scrollToBottom,
    getOtherParticipant,
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
    <div className="h-full w-full flex bg-[#06011a] text-white overflow-hidden">
      {/* Left Column: Conversations List */}
      <div
        className={`${
          activeConversation ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-96 h-full shrink-0 min-h-0 overflow-hidden`}
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
        } flex-1 flex-col h-full bg-[#08021f]/90 relative min-w-0 overflow-hidden`}
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
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-2"
            >
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
