import React from "react";

interface WaitingRoomProps {
  isTrainer: boolean;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  serviceName?: string;
  status?: string;
  onRequestCall: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  isTrainer,
  scheduledStartTime,
  scheduledEndTime,
  serviceName = "Coaching Session",
  status,
  onRequestCall,
  isLoading = false,
  error = null,
}) => {
  const formattedStart = scheduledStartTime
    ? new Date(scheduledStartTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Scheduled Start";

  const formattedEnd = scheduledEndTime
    ? new Date(scheduledEndTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const isCallWaitingAcceptance = status === "WAITING";

  let buttonText = "Start Session";
  if (isLoading) {
    buttonText = "Initiating Call...";
  } else if (isCallWaitingAcceptance) {
    buttonText = "Waiting for Client Acceptance...";
  }

  const isButtonDisabled = isLoading || isCallWaitingAcceptance;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-8">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            Video Waiting Room
          </span>
          <h2 className="text-2xl font-bold text-white">{serviceName}</h2>
          <p className="text-sm text-zinc-400">
            {formattedStart} {formattedEnd ? `- ${formattedEnd}` : ""}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        {isTrainer ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800 text-sm text-zinc-300">
              {isCallWaitingAcceptance ? (
                <div className="space-y-1">
                  <p className="text-amber-300 font-semibold flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Call request sent to client!
                  </p>
                  <p className="text-xs text-zinc-400">
                    Waiting for the client to accept the call request popup.
                  </p>
                </div>
              ) : (
                <p className="text-emerald-300 font-semibold">
                  Session is ready! Click to start the call.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onRequestCall}
              disabled={isButtonDisabled}
              className={`w-full py-4 px-6 rounded-2xl text-white font-semibold shadow-xl transition duration-200 text-base ${
                isButtonDisabled
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30 cursor-pointer"
              }`}
            >
              {buttonText}
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="relative mx-auto w-24 h-24 rounded-full bg-zinc-800/80 flex items-center justify-center border border-zinc-700">
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <svg
                className="w-10 h-10 text-emerald-400 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-zinc-200">
                {isCallWaitingAcceptance
                  ? "Trainer is requesting to start the call!"
                  : "Waiting for trainer to start session..."}
              </h3>
              <p className="text-xs text-zinc-500">
                {isCallWaitingAcceptance
                  ? "Please accept the call request prompt on your screen to join."
                  : "Please stay on this screen. You will receive a call request popup as soon as the trainer requests the session."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
