import React, { useState } from "react";
import {
  Search,
  Shield,
  User,
  MessageSquare,
  CheckCheck,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { Conversation, ChatParticipant, CHAT_TYPE } from "../types/chat.types";
import { ROLES } from "@/constants/roles.constants";

interface ChatConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  currentUserId: string;
  loading?: boolean;
}

export const ChatConversationList: React.FC<ChatConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getOtherParticipant = (
    conv: Conversation,
  ): ChatParticipant | undefined => {
    if (!conv.participants?.length) {
      // Fallback if participants not populated
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
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatTimestamp = (isoDate?: string | Date) => {
    if (!isoDate) return "";
    try {
      const d = new Date(isoDate);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d`;
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const renderLastMessagePreview = (lastMsg?: Conversation["lastMessage"]) => {
    if (!lastMsg) {
      return (
        <span className="text-white/40 italic">
          Click to start chatting...
        </span>
      );
    }

    if (lastMsg.messageType === CHAT_TYPE.IMAGE) {
      return (
        <span className="flex items-center gap-1.5 text-purple-300 font-medium">
          <ImageIcon size={13} className="shrink-0 text-purple-400" />
          <span>Photo</span>
        </span>
      );
    }

    if (lastMsg.messageType === CHAT_TYPE.DOCUMENT) {
      let docName = "Document";
      try {
        const parsed = new URL(lastMsg.content);
        const filenameParam = parsed.searchParams.get("filename");
        if (filenameParam) {
          docName = decodeURIComponent(filenameParam);
        } else {
          const parts = parsed.pathname.split("/");
          docName = decodeURIComponent(parts[parts.length - 1] || "Document");
        }
      } catch {
        const parts = lastMsg.content.split("/");
        docName = parts[parts.length - 1] || "Document";
      }

      return (
        <span className="flex items-center gap-1.5 text-indigo-300 font-medium truncate">
          <FileText size={13} className="shrink-0 text-indigo-400" />
          <span className="truncate">{docName}</span>
        </span>
      );
    }

    return (
      <span className="truncate">
        {lastMsg.content}
      </span>
    );
  };

  const filteredConversations = conversations
    .filter((conv) => {
      const other = getOtherParticipant(conv);
      return other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const timeA = new Date(
        a.lastMessageAt || a.lastMessage?.createdAt || a.updatedAt || a.createdAt || 0,
      ).getTime();
      const timeB = new Date(
        b.lastMessageAt || b.lastMessage?.createdAt || b.updatedAt || b.createdAt || 0,
      ).getTime();
      return timeB - timeA;
    });

  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-[#0a0520]/95 backdrop-blur-xl border-r border-white/10 shrink-0">
      {/* Search Header */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-extrabold text-lg flex items-center gap-2">
            <MessageSquare size={18} className="text-purple-400" />
            Messages
          </h1>
          <span className="text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25 px-2.5 py-0.5 rounded-full">
            {conversations.length}
          </span>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#140e34] border border-purple-500/20 focus:border-purple-500/50 rounded-xl text-xs text-white placeholder:text-white/30 outline-none transition"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 chat-scroll-dark">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 animate-pulse"
              >
                <div className="w-11 h-11 rounded-full bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-white/40 text-xs space-y-2">
            <p>
              {searchTerm
                ? "No conversations match your search."
                : "No conversations yet."}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const other = getOtherParticipant(conv);
            const isSelected = conv.id === activeConversationId;
            const isTrainer = other?.role === ROLES.TRAINER;
            const lastMsg = conv.lastMessage;
            const timeLabel = formatTimestamp(
              conv.lastMessageAt || conv.updatedAt,
            );

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv)}
                className={`w-full text-left p-3.5 sm:p-4 flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-950/70 to-indigo-950/50 border-l-4 border-l-purple-500"
                    : "hover:bg-white/[0.04]"
                }`}
              >
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 p-0.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-[#120a2e] flex items-center justify-center overflow-hidden">
                      {other?.profilePic ? (
                        <img
                          src={other.profilePic}
                          alt={other.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-extrabold">
                          {getInitials(other?.name)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0520]" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3
                      className={`text-sm font-bold truncate ${
                        isSelected ? "text-white" : "text-slate-100"
                      }`}
                    >
                      {other?.name || "Chat Partner"}
                    </h3>
                    {timeLabel && (
                      <span className="text-[10px] text-white/40 shrink-0 font-medium">
                        {timeLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0 text-xs text-slate-300 truncate">
                      {lastMsg && lastMsg.senderId === currentUserId && (
                        <CheckCheck
                          size={13}
                          className={`shrink-0 ${
                            lastMsg.isRead
                              ? "text-sky-400"
                              : "text-white/40"
                          }`}
                        />
                      )}
                      {renderLastMessagePreview(lastMsg)}
                    </div>
                    {isTrainer ? (
                      <span className="shrink-0 text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                        <Shield size={9} className="inline mr-0.5" />
                        Coach
                      </span>
                    ) : (
                      <span className="shrink-0 text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                        <User size={9} className="inline mr-0.5" />
                        Client
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
