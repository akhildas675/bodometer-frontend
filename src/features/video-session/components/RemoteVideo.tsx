import { useEffect, useRef, useState } from "react";
import { User, VideoOff } from "lucide-react";

interface RemoteVideoProps {
  stream: MediaStream | null;
  participantName?: string;
  isConnecting?: boolean;
}

function RemoteVideo({
  stream,
  participantName = "Remote Participant",
  isConnecting = false,
}: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasActiveVideo, setHasActiveVideo] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.srcObject = stream;

    const checkVideoTracks = () => {
      if (!stream) {
        setHasActiveVideo(false);
        return;
      }
      const tracks = stream.getVideoTracks();
      const isLive = tracks.some(
        (t) => t.enabled && !t.muted && t.readyState === "live",
      );
      setHasActiveVideo(isLive);
    };

    checkVideoTracks();

    if (stream) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("[RemoteVideo] Play attempt caught:", err);
        });
      }

      const handleTrackUpdate = () => {
        checkVideoTracks();
        videoElement.play().catch(() => {});
      };

      stream.addEventListener("addtrack", handleTrackUpdate);
      stream.addEventListener("removetrack", handleTrackUpdate);

      stream.getVideoTracks().forEach((track) => {
        track.addEventListener("mute", handleTrackUpdate);
        track.addEventListener("unmute", handleTrackUpdate);
        track.addEventListener("ended", handleTrackUpdate);
      });

      return () => {
        stream.removeEventListener("addtrack", handleTrackUpdate);
        stream.removeEventListener("removetrack", handleTrackUpdate);
        stream.getVideoTracks().forEach((track) => {
          track.removeEventListener("mute", handleTrackUpdate);
          track.removeEventListener("unmute", handleTrackUpdate);
          track.removeEventListener("ended", handleTrackUpdate);
        });
        videoElement.srcObject = null;
      };
    } else {
      return () => {
        videoElement.srcObject = null;
      };
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-[#03000D] flex items-center justify-center overflow-hidden">
      {/* Video element plays both audio and video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          hasActiveVideo ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Avatar overlay if video is inactive or camera is off */}
      {!hasActiveVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at center, #130a2a 0%, #03000D 100%)",
            color: "rgba(255, 255, 255, 0.8)",
            padding: "1.5rem",
            zIndex: 1,
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "2px solid rgba(168, 85, 247, 0.3)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              position: "relative",
            }}
          >
            <User size={48} className="text-purple-300 opacity-70" />
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                padding: "6px",
                borderRadius: "50%",
                background: "#0f0728",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideoOff size={16} className="text-rose-400" />
            </div>
          </div>
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            {participantName}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255, 255, 255, 0.45)",
              marginTop: "0.25rem",
            }}
          >
            {isConnecting
              ? "Connecting media stream…"
              : "Camera is currently off"}
          </p>
        </div>
      )}
    </div>
  );
}

export default RemoteVideo;