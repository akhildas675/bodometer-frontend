import { useState } from "react";
import { useVideoCallStore } from "@/stores/video-call.store";
import { videoSessionService } from "@/modules/video.session/service/video-session.service";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import { Video, PhoneOff } from "lucide-react";
import { toast } from "sonner";

function IncomingCallBanner() {
  const incomingVideoSessionId = useVideoCallStore(
    (state) => state.incomingVideoSessionId,
  );
  const clearIncomingCall = useVideoCallStore((state) => state.clearIncomingCall);
  const [accepting, setAccepting] = useState(false);

  if (!incomingVideoSessionId) {
    return null;
  }

  const handleAccept = async () => {
    try {
      setAccepting(true);

      await videoSessionService.acceptCall(incomingVideoSessionId);

      clearIncomingCall();

      const path = USER_UI_ROUTES.VIDEO_CALL_SESSION.replace(
        ":videoSessionId",
        incomingVideoSessionId,
      );
      window.location.href = path;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to accept the call.";
      toast.error(msg);
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    try {
      await videoSessionService.rejectCall(incomingVideoSessionId);
    } catch {

    } finally {
      clearIncomingCall();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "rgba(12, 7, 30, 0.95)",
        border: "1px solid rgba(168, 85, 247, 0.5)",
        borderRadius: "1rem",
        padding: "0.85rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        color: "#ffffff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        minWidth: "320px",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "rgba(168, 85, 247, 0.2)",
          border: "1px solid rgba(168, 85, 247, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Video size={20} className="text-purple-400 animate-pulse" />
      </div>
      <span style={{ flex: 1, fontWeight: 600, fontSize: "0.9rem" }}>
        Your trainer is calling. Ready to join?
      </span>
      <button
        id="incoming-call-decline-btn"
        onClick={handleDecline}
        disabled={accepting}
        style={{
          padding: "0.45rem 0.9rem",
          borderRadius: "0.5rem",
          background: "rgba(239,68,68,0.2)",
          border: "1px solid rgba(239,68,68,0.5)",
          color: "#fca5a5",
          fontWeight: 600,
          fontSize: "0.8rem",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <PhoneOff size={14} /> Decline
      </button>
      <button
        id="incoming-call-accept-btn"
        onClick={handleAccept}
        disabled={accepting}
        style={{
          padding: "0.45rem 1rem",
          borderRadius: "0.5rem",
          background: "rgba(52,211,153,0.2)",
          border: "1px solid rgba(52,211,153,0.5)",
          color: "#6ee7b7",
          fontWeight: 600,
          fontSize: "0.8rem",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <Video size={14} /> {accepting ? "Joining..." : "Accept"}
      </button>
    </div>
  );
}

export default IncomingCallBanner;
