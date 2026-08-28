import React from "react";

interface CallRequestModalProps {
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export const CallRequestModal: React.FC<CallRequestModalProps> = ({
  onAccept,
  onReject,
  isLoading = false,
}) => {
  const formattedTime = "--:--"; // timer disabled, static placeholder

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
        <div className="relative mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
          <svg
            className="w-10 h-10 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 002-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">
            Incoming Video Call
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Your trainer is ready to start the session
          </p>
        </div>

        {/* 5-minute Countdown Timer */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl py-3 px-4 inline-block">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 block">
            Acceptance Window
          </span>
          <span className="text-2xl font-mono font-bold text-amber-400">
            {formattedTime}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onReject}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/30 transition disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};
