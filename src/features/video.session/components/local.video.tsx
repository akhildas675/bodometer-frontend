import { useEffect, useRef } from "react";
import { User, VideoOff } from "lucide-react";

interface LocalVideoProps {
  stream: MediaStream | null;
  isCameraOn?: boolean;
}

function LocalVideo({ stream, isCameraOn = true }: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.srcObject = stream;
    if (stream) {
      videoElement.play().catch((err) => {
        console.warn("[LocalVideo] Play failed:", err);
      });
    }

    return () => {
      videoElement.srcObject = null;
    };
  }, [stream]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#080318",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          display: isCameraOn ? "block" : "none",
        }}
      />
      {!isCameraOn && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            background: "#0d0620",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={20} className="text-purple-300 opacity-70" />
          </div>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.5)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <VideoOff size={12} className="text-rose-400" /> Cam Off
          </span>
        </div>
      )}
    </div>
  );
}

export default LocalVideo;