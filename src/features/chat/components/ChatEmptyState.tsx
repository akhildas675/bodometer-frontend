import React from "react";
import { MessageSquare, Sparkles, ShieldCheck } from "lucide-react";

interface ChatEmptyStateProps {
  hasConversations: boolean;
  onBrowseTrainers?: () => void;
  isTrainer?: boolean;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  hasConversations,
  onBrowseTrainers,
  isTrainer = false,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#07031b]/60">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-2xl shadow-purple-600/20 backdrop-blur-xl">
          <MessageSquare size={36} className="animate-pulse" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
          <Sparkles size={14} />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-white mb-2">
        {hasConversations
          ? "Select a Conversation"
          : isTrainer
            ? "No Client Messages Yet"
            : "No Conversations Started"}
      </h3>

      <p className="text-sm text-slate-300 max-w-sm leading-relaxed mb-6">
        {hasConversations
          ? "Choose a conversation from the sidebar to view chat history and exchange messages in real-time."
          : isTrainer
            ? "When clients reach out or book sessions with you, your direct chats will appear here."
            : "Connect with certified coaches, ask fitness questions, receive workout tips, and discuss your meal plans in real-time."}
      </p>

      {!hasConversations && !isTrainer && onBrowseTrainers && (
        <button
          onClick={onBrowseTrainers}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ShieldCheck size={16} />
          <span>Browse Coaches</span>
        </button>
      )}
    </div>
  );
};
