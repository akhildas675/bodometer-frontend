import React from "react";
import { ChatMessage, ChatParticipant, CHAT_TYPE } from "../types/chat.types";
import { Check, CheckCheck, FileText, Download } from "lucide-react";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
  sender?: ChatParticipant;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  isSelf,
  sender,
}) => {
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
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

  const getFileNameFromUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const paramName = parsed.searchParams.get("filename");
      if (paramName) return decodeURIComponent(paramName);
      const parts = parsed.pathname.split("/");
      return decodeURIComponent(parts[parts.length - 1] || "Document");
    } catch {
      const parts = url.split("/");
      return parts[parts.length - 1] || "Document";
    }
  };

  return (
    <div
      className={`flex items-end gap-2 group mb-3 ${
        isSelf ? "justify-end" : "justify-start"
      }`}
    >
      {/* Other participant avatar */}
      {!isSelf && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md overflow-hidden border border-white/10">
          {sender?.profilePic ? (
            <img
              src={sender.profilePic}
              alt={sender.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{getInitials(sender?.name)}</span>
          )}
        </div>
      )}

      {/* Bubble container */}
      <div
        className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all shadow-md ${
          isSelf
            ? "bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white rounded-br-sm shadow-purple-900/30"
            : "bg-[#181236]/90 border border-white/10 text-slate-100 rounded-bl-sm backdrop-blur-md shadow-black/40"
        }`}
      >
        {message.messageType === CHAT_TYPE.IMAGE ? (
          <div className="space-y-1">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-black/30">
              <img
                src={message.content}
                alt="Shared attachment"
                className="max-h-80 w-auto max-w-full rounded-xl object-contain cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(message.content, "_blank")}
                loading="lazy"
              />
            </div>
          </div>
        ) : message.messageType === CHAT_TYPE.DOCUMENT ? (
          <div className="space-y-1">
            <a
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-black/25 hover:bg-black/40 border border-white/10 transition-colors group/doc min-w-[200px] max-w-xs"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/25 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-white group-hover/doc:text-purple-200">
                  {getFileNameFromUrl(message.content)}
                </p>
                <span className="text-[10px] text-white/50 block">Document</span>
              </div>
              <Download
                size={16}
                className="text-white/50 group-hover/doc:text-white shrink-0 ml-1 transition-colors"
              />
            </a>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}

        {/* Timestamp and delivery indicator */}
        <div
          className={`flex items-center gap-1.5 mt-1.5 text-[10px] ${
            isSelf ? "justify-end text-purple-200/80" : "justify-start text-white/40"
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isSelf && (
            <span>
              {message.isOptimistic ? (
                <span title="Sending">
                  <Check size={13} className="text-purple-200/40" />
                </span>
              ) : message.isRead ? (
                <span title="Seen">
                  <CheckCheck
                    size={13}
                    className="text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]"
                  />
                </span>
              ) : (
                <span title="Delivered">
                  <CheckCheck size={13} className="text-purple-200/50" />
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
