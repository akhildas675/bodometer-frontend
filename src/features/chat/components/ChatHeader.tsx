import React from "react";
import { ArrowLeft, Shield, User } from "lucide-react";
import { ChatParticipant } from "../types/chat.types";
import { ROLES } from "@/constants/roles.constants";

interface ChatHeaderProps {
  participant?: ChatParticipant;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  participant,
  onBack,
  showBackButton = false,
}) => {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const isTrainer = participant?.role === ROLES.TRAINER;

  return (
    <div className="px-4 py-3 sm:px-6 bg-[#0c0728]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between z-10">
      <div className="flex items-center gap-3 min-w-0">
        {showBackButton && (
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded-xl text-purple-400 hover:text-white hover:bg-purple-500/10 transition cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Participant Avatar with status ring */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-[#120a2e] flex items-center justify-center overflow-hidden">
              {participant?.profilePic ? (
                <img
                  src={participant.profilePic}
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-extrabold">
                  {getInitials(participant?.name)}
                </span>
              )}
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0728]" />
        </div>

        {/* Participant Information */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-sm sm:text-base truncate">
              {participant?.name || "Direct Message"}
            </h2>
            {isTrainer ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                <Shield size={10} />
                Coach
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                <User size={10} />
                Client
              </span>
            )}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </p>
        </div>
      </div>


    </div>
  );
};
