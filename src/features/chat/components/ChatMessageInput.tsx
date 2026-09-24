import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChatMessageInputProps {
  onSendMessage: (content: string) => Promise<void> | void;
  onSendFile?: (file: File) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
}

const QUICK_EMOJIS = ["💪", "🔥", "👍", "👏", "🎯", "🙌", "🥗", "🏋️"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  onSendMessage,
  onSendFile,
  disabled = false,
  placeholder = "Type your message here...",
}) => {
  const [content, setContent] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120,
      )}px`;
    }
  }, [content]);

  // Click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(e.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSending || disabled) return;

    try {
      setIsSending(true);
      await onSendMessage(trimmed);
      setContent("");
      setShowEmojis(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    if (!onSendFile) return;

    try {
      setIsUploadingFile(true);
      await onSendFile(file);
    } catch {
      toast.error("Failed to upload and send file.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  return (
    <div className="relative p-3 sm:p-4 bg-[#0a0520]/95 backdrop-blur-xl border-t border-white/10">
      {/* Quick emoji drawer */}
      {showEmojis && (
        <div
          ref={emojiRef}
          className="absolute bottom-full left-4 mb-2 p-2.5 bg-[#140e34] border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-1.5 z-20 animate-fadeIn"
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="text-lg hover:scale-125 transition-transform p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 bg-[#120a2e]/90 border border-purple-500/20 focus-within:border-purple-500/60 rounded-2xl p-2 transition-all shadow-inner">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx"
          onChange={(e) => void handleFileChange(e)}
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending || isUploadingFile || !onSendFile}
          className="p-2 text-purple-400 hover:text-purple-200 hover:bg-purple-500/15 rounded-xl transition cursor-pointer shrink-0 disabled:opacity-40"
          title="Attach image or document (Max 10MB)"
        >
          {isUploadingFile ? (
            <Loader2 size={20} className="animate-spin text-purple-300" />
          ) : (
            <Paperclip size={20} />
          )}
        </button>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojis((prev) => !prev)}
          disabled={disabled || isUploadingFile}
          className="p-2 text-purple-400 hover:text-purple-200 hover:bg-purple-500/15 rounded-xl transition cursor-pointer shrink-0 disabled:opacity-40"
          title="Add emoji"
        >
          <Smile size={20} />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent resize-none outline-none text-white text-sm placeholder:text-white/30 max-h-32 py-2 px-1 font-normal leading-relaxed"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!content.trim() || disabled || isSending}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
        >
          <Send size={18} className={isSending ? "animate-pulse" : ""} />
        </button>
      </div>
    </div>
  );
};
