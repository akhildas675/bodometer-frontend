import React, { useEffect, useRef } from "react";
import { User, VideoOff, MicOff } from "lucide-react";

interface ParticipantVideoProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  participantName: string;
  isAudioMuted?: boolean;
  isVideoOff?: boolean;
}

export const ParticipantVideo: React.FC<ParticipantVideoProps> = ({
  stream,
  isLocal = false,
  participantName,
  isAudioMuted = false,
  isVideoOff = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[340px] bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
            <User size={40} />
          </div>
          <span className="text-sm font-medium text-zinc-300">
            {participantName} {isVideoOff ? "(Camera Off)" : "(No Video)"}
          </span>
        </div>
      )}

      {/* Participant Badge Overlay */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
        <span>{participantName} {isLocal ? "(You)" : ""}</span>
        {isAudioMuted && <MicOff size={14} className="text-rose-400" />}
        {isVideoOff && <VideoOff size={14} className="text-amber-400" />}
      </div>
    </div>
  );
};
