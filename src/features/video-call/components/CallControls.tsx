import React from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  isVideoOff,
  onToggleMic,
  onToggleCamera,
  onEndCall,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl">
      <button
        type="button"
        onClick={onToggleMic}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
          isMuted
            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
            : "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700"
        }`}
        title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      <button
        type="button"
        onClick={onToggleCamera}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer ${
          isVideoOff
            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
            : "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700"
        }`}
        title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
      >
        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      <button
        type="button"
        onClick={onEndCall}
        className="w-14 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition shadow-lg shadow-rose-900/40 cursor-pointer"
        title="End Call"
      >
        <PhoneOff size={22} />
      </button>
    </div>
  );
};
