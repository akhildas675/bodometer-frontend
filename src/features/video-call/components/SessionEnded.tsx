import React from "react";
import {
  VideoSessionStatus,
  VideoSessionTerminationReason,
} from "@/modules/video-call/types/video-session.types";

interface SessionEndedProps {
  status: VideoSessionStatus;
  reason?: VideoSessionTerminationReason | string;
  onClose?: () => void;
}

export const SessionEnded: React.FC<SessionEndedProps> = ({
  status,
  reason,
  onClose,
}) => {
  const isCompleted = status === "COMPLETED";

  const getReasonTitle = () => {
    if (isCompleted) return "Session Completed";
    switch (reason) {
      case "USER_REJECTED":
        return "Call Declined";
      case "USER_NO_SHOW":
        return "Call Not Accepted";
      case "TRAINER_NO_SHOW":
        return "Trainer Unavailable";
      case "USER_DISCONNECTED":
        return "User Disconnected";
      case "TRAINER_DISCONNECTED":
        return "Trainer Disconnected";
      default:
        return "Session Ended";
    }
  };

  const getReasonDescription = () => {
    if (isCompleted) {
      return "Thank you for completing your video coaching session.";
    }
    switch (reason) {
      case "USER_REJECTED":
        return "The incoming video call request was rejected.";
      case "USER_NO_SHOW":
        return "The call request expired because it was not accepted within 5 minutes.";
      case "TRAINER_NO_SHOW":
        return "The trainer did not initiate the call within the start window.";
      case "USER_DISCONNECTED":
        return "The session ended because the user was disconnected.";
      case "TRAINER_DISCONNECTED":
        return "The session ended because the trainer was disconnected.";
      default:
        return "The video session has ended.";
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center border ${
            isCompleted
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {isCompleted ? (
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{getReasonTitle()}</h2>
          <p className="text-sm text-zinc-400">{getReasonDescription()}</p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition"
          >
            Return to Booking Details
          </button>
        )}
      </div>
    </div>
  );
};
