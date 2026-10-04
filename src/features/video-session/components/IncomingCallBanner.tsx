import { useEffect, useState } from "react";
import { useVideoCallStore } from "@/features/video-session/stores/video-call.store";
import { videoSessionService } from "@/features/video-session/services/video-session.service";
import { USER_UI_ROUTES } from "@/constants/routes/user.routes";
import { Video, PhoneOff, PhoneCall } from "lucide-react";
import { toast } from "sonner";

class IncomingCallRingtone {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private loopTimer: number | null = null;

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
    } catch {
      return;
    }

    const ring = () => {
      if (!this.isPlaying || !this.ctx) return;

      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }

      try {
        if ("vibrate" in navigator) {
          navigator.vibrate([350, 150, 350, 150]);
        }
      } catch {}

      const startTime = this.ctx.currentTime;
      this.playChime(startTime);
      this.playChime(startTime + 0.45);

      this.loopTimer = window.setTimeout(ring, 2600);
    };

    ring();

    const unlockAudio = () => {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    };
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
  }

  private playChime(startTime: number) {
    if (!this.ctx) return;
    try {
      const freqs = [739.99, 1108.73];
      freqs.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {}
  }

  stop() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

function IncomingCallBanner() {
  const incomingVideoSessionId = useVideoCallStore(
    (state) => state.incomingVideoSessionId,
  );
  const clearIncomingCall = useVideoCallStore((state) => state.clearIncomingCall);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!incomingVideoSessionId) return;

    const ringtone = new IncomingCallRingtone();
    ringtone.start();

    return () => {
      ringtone.stop();
    };
  }, [incomingVideoSessionId]);

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
      // Ignore errors when rejecting call
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
        <PhoneCall size={20} className="text-purple-400 animate-bounce" />
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
