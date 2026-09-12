import { useEffect, useRef, useState } from "react";
import {
  joinVideoSession,
  leaveVideoSession,
  sendVideoOffer,
  sendVideoAnswer,
  sendIceCandidate,
  subscribeToParticipantJoined,
  unsubscribeFromParticipantJoined,
  subscribeToCallAccepted,
  unsubscribeFromCallAccepted,
  subscribeToVideoOffer,
  unsubscribeFromVideoOffer,
  subscribeToVideoAnswer,
  unsubscribeFromVideoAnswer,
  subscribeToIceCandidate,
  unsubscribeFromIceCandidate,
  subscribeToVideoError,
  unsubscribeFromVideoError,
  subscribeToSessionEnded,
  unsubscribeFromSessionEnded,
  VideoParticipantEvent,
  VideoCallAcceptedEvent,
  VideoOfferEvent,
  VideoAnswerEvent,
  VideoIceCandidateEvent,
  VideoErrorEvent,
  VideoSessionEndedEvent,
} from "@/modules/video.session/socket/video-session.socket";
import { videoSessionService } from "@/modules/video.session/service/video-session.service";
import { VideoSession as VideoSessionType } from "@/modules/video.session/types";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import LocalVideo from "./local.video";
import RemoteVideo from "./remote.video";

interface VideoSessionProps {
  videoSessionId: string;
}

type ConnectionPhase =
  | "initializing"
  | "waiting"
  | "connecting"
  | "connected"
  | "error";

function VideoSession({ videoSessionId }: VideoSessionProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [phase, setPhase] = useState<ConnectionPhase>("initializing");
  const [socketError, setSocketError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Remaining time and session state
  const [sessionDetails, setSessionDetails] = useState<VideoSessionType | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [endedReason, setEndedReason] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [isRequestingRefund, setIsRequestingRefund] = useState(false);
  const isEndingRef = useRef(false);
  const hasEndedToastShownRef = useRef(false);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);

  // Refs for stable access inside socket callbacks (avoids stale closures)
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // ─── Controls ────────────────────────────────────────────────────────────
  const toggleMic = () => {
    const s = streamRef.current;
    if (!s) return;
    s.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMicOn((v) => !v);
  };

  const toggleCamera = () => {
    const s = streamRef.current;
    if (!s) return;
    s.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCameraOn((v) => !v);
  };

  const handleEndCall = () => {
    setShowEndCallConfirm(true);
  };

  const handleConfirmEndCall = async () => {
    setShowEndCallConfirm(false);
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    setIsEnding(true);
    hasEndedToastShownRef.current = true;

    try {
      const endedSession = await videoSessionService.endSession(videoSessionId);
      if (endedSession) {
        setSessionDetails(endedSession);
        if (endedSession.status === "INCOMPLETE") {
          setEndedReason(
            `Session ended early (${endedSession.actualDurationMinutes ?? 0} mins conducted). Eligible for a full refund.`
          );
        } else {
          setEndedReason("You ended the call session.");
        }
      }
    } catch (e) {
      console.warn("Manual end call API error:", e);
    } finally {
      setIsSessionEnded(true);
      toast.success("Call ended successfully.", { id: "session-ended" });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
    }
  };

  const handleAutoEnd = async () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    setIsEnding(true);
    hasEndedToastShownRef.current = true;

    try {
      const endedSession = await videoSessionService.endSession(videoSessionId);
      if (endedSession) {
        setSessionDetails(endedSession);
      }
    } catch (e) {
      console.warn("Auto-end session API error:", e);
    } finally {
      setIsSessionEnded(true);
      setEndedReason("Scheduled session duration reached. Call ended automatically.");
      toast.info("Session time expired. The call has ended automatically.", { id: "session-ended" });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
    }
  };

  const handleClaimRefund = async () => {
    if (!videoSessionId) return;
    try {
      setIsRequestingRefund(true);
      const updated = await videoSessionService.requestRefund(videoSessionId);
      setSessionDetails(updated);
      toast.success("Full refund credited to your Bodometer Wallet!", { id: "refund-claim" });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to request refund.";
      toast.error(msg, { id: "refund-claim-err" });
    } finally {
      setIsRequestingRefund(false);
    }
  };

  // ─── Timer Countdown ─────────────────────────────────────────────────────
  // The session countdown timer starts running when the user accepts
  useEffect(() => {
    if (!sessionDetails || isSessionEnded) return;

    const hasAccepted = Boolean(
      sessionDetails.userAcceptedAt ||
      sessionDetails.actualStartTime ||
      sessionDetails.status === "ACCEPTED" ||
      sessionDetails.status === "ACTIVE",
    );

    if (!hasAccepted) {
      // User has not accepted yet: calculate total scheduled duration without counting down
      const startMs = new Date(sessionDetails.scheduledStartTime).getTime();
      const endMs = new Date(sessionDetails.scheduledEndTime).getTime();
      const totalSecs = Math.max(0, Math.floor((endMs - startMs) / 1000));
      setRemainingSeconds(totalSecs > 0 ? totalSecs : 3600);
      return;
    }

    const endMs = new Date(sessionDetails.scheduledEndTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffSecs = Math.floor((endMs - now) / 1000);

      if (diffSecs <= 0) {
        setRemainingSeconds(0);
        if (!isEndingRef.current && !isSessionEnded) {
          void handleAutoEnd();
        }
      } else {
        setRemainingSeconds(diffSecs);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [
    sessionDetails?.userAcceptedAt,
    sessionDetails?.actualStartTime,
    sessionDetails?.scheduledEndTime,
    sessionDetails?.status,
    isSessionEnded,
  ]);

  const formatTimeRemaining = (seconds: number | null): string => {
    if (seconds === null) return "--:--";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ─── Main WebRTC + Socket lifecycle ──────────────────────────────────────
  useEffect(() => {
    let destroyed = false;

    // ── Helpers ──────────────────────────────────────────────────────────
    const getPC = () => pcRef.current;

    const logState = (label: string) => {
      const pc = getPC();
      if (!pc) return;
      console.log(
        `[WebRTC] ${label} | signalingState=${pc.signalingState}` +
          ` | iceConnectionState=${pc.iceConnectionState}` +
          ` | connectionState=${pc.connectionState}` +
          ` | iceGatheringState=${pc.iceGatheringState}`,
      );
    };

    // ── Socket event handlers ─────────────────────────────────────────────

    // Fires on the ALREADY-IN-ROOM participant when someone new joins.
    // That participant is the *initiator* who creates the offer.
    const handleParticipantJoined = async (data?: VideoParticipantEvent) => {
      if (data?.session) {
        console.log("[WebRTC] participant-joined with session data:", data.session);
        setSessionDetails(data.session);
      }

      const pc = getPC();
      if (!pc) {
        console.warn("[WebRTC] participant-joined but peerConnection is null");
        return;
      }

      console.log("[WebRTC] video:participant-joined — creating offer");
      setPhase("connecting");

      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);
        sendVideoOffer(videoSessionId, offer);
        console.log("[WebRTC] Offer sent", offer.sdp?.slice(0, 120));
        logState("after setLocalDescription(offer)");
      } catch (err) {
        console.error("[WebRTC] Failed to create/send offer:", err);
      }
    };

    const handleCallAccepted = (data: VideoCallAcceptedEvent) => {
      if (data.videoSessionId === videoSessionId && data.session) {
        console.log("[WebRTC] video:call-accepted — session time starts running!", data.session);
        setSessionDetails(data.session);
        toast.info("Client accepted the call. Session time has started!", { id: "call-accepted-info" });
      }
    };

    const handleVideoOffer = async ({ offer }: VideoOfferEvent) => {
      const pc = getPC();
      if (!pc) {
        console.warn("[WebRTC] video:offer but peerConnection is null");
        return;
      }

      console.log("[WebRTC] video:offer received — setting remote description");
      setPhase("connecting");

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        logState("after setRemoteDescription(offer)");

        // Flush any ICE candidates that arrived before the remote description
        console.log(
          `[WebRTC] Flushing ${pendingCandidates.current.length} queued ICE candidates`,
        );
        for (const c of pendingCandidates.current) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
            console.log("[WebRTC] Queued ICE candidate applied");
          } catch (e) {
            console.warn("[WebRTC] Failed to apply queued ICE candidate:", e);
          }
        }
        pendingCandidates.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendVideoAnswer(videoSessionId, answer);
        console.log("[WebRTC] Answer sent", answer.sdp?.slice(0, 120));
        logState("after setLocalDescription(answer)");
      } catch (err) {
        console.error("[WebRTC] Failed to handle offer:", err);
      }
    };

    const handleVideoAnswer = async ({ answer }: VideoAnswerEvent) => {
      const pc = getPC();
      if (!pc) {
        console.warn("[WebRTC] video:answer but peerConnection is null");
        return;
      }

      console.log("[WebRTC] video:answer received — setting remote description");
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        logState("after setRemoteDescription(answer)");

        // Flush queued candidates (may have arrived before the answer)
        console.log(
          `[WebRTC] Flushing ${pendingCandidates.current.length} queued ICE candidates`,
        );
        for (const c of pendingCandidates.current) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
            console.log("[WebRTC] Queued ICE candidate applied");
          } catch (e) {
            console.warn("[WebRTC] Failed to apply queued ICE candidate:", e);
          }
        }
        pendingCandidates.current = [];
      } catch (err) {
        console.error("[WebRTC] Failed to handle answer:", err);
      }
    };

    const handleIceCandidate = async ({ candidate }: VideoIceCandidateEvent) => {
      const pc = getPC();
      if (!pc) return;

      if (!pc.remoteDescription) {
        console.log("[WebRTC] ICE candidate arrived before remote desc — queuing");
        pendingCandidates.current.push(candidate);
        return;
      }

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("[WebRTC] ICE candidate applied");
      } catch (err) {
        console.warn("[WebRTC] addIceCandidate failed:", err);
      }
    };

    const handleSocketError = ({ event, message }: VideoErrorEvent) => {
      console.error(`[Socket] video:error on "${event}": ${message}`);
      setSocketError(message);
    };

    const handleRemoteSessionEnded = (data: VideoSessionEndedEvent) => {
      if (data.videoSessionId === videoSessionId) {
        setIsSessionEnded(true);
        if (data.session) {
          setSessionDetails(data.session);
          if (data.session.status === "INCOMPLETE") {
            setEndedReason(
              `Session ended early (${data.session.actualDurationMinutes ?? 0} mins conducted). Eligible for a full refund.`
            );
          } else {
            setEndedReason("The video call was ended.");
          }
        } else {
          setEndedReason("The video call was ended.");
        }
        if (!hasEndedToastShownRef.current) {
          hasEndedToastShownRef.current = true;
          toast.info("The session has been ended.", { id: "session-ended" });
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        pcRef.current?.close();
      }
    };

    // ── Initialize ────────────────────────────────────────────────────────
    const initialize = async () => {
      try {
        setMediaError(null);
        setSocketError(null);
        setPhase("initializing");

        console.log("[VideoSession] Initializing session:", videoSessionId);

        // 1. Validate the session (read-only GET)
        const session = await videoSessionService.getVideoSession(videoSessionId);
        console.log("[VideoSession] Session:", session.id, "status:", session.status);

        if (destroyed) return;

        if (session.status === "COMPLETED" || session.status === "INCOMPLETE" || session.status === "CANCELLED" || session.status === "EXPIRED") {
          setIsSessionEnded(true);
          setEndedReason(`This session has ended (${session.status.toLowerCase()}).`);
          return;
        }

        const scheduledEnd = session.scheduledEndTime ? new Date(session.scheduledEndTime).getTime() : null;
        if (scheduledEnd && Date.now() >= scheduledEnd) {
          setIsSessionEnded(true);
          setEndedReason("The scheduled session duration has expired.");
          void videoSessionService.endSession(videoSessionId).catch(() => {});
          return;
        }

        setSessionDetails(session);

        // 2. Get local media
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (destroyed) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = mediaStream;
        setLocalStream(mediaStream);
        console.log(
          "[WebRTC] Local tracks:",
          mediaStream.getTracks().map((t) => `${t.kind}:${t.label}`).join(", "),
        );

        // 3. Create RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });
        pcRef.current = pc;

        // 4. Add local tracks to the peer connection
        mediaStream.getTracks().forEach((track) => {
          pc.addTrack(track, mediaStream);
          console.log("[WebRTC] Local track added:", track.kind, track.label);
        });

        // 5. Handle incoming remote tracks
        //    Re-construct new MediaStream instance so React state detects reference change
        pc.ontrack = (event) => {
          console.log(
            "[WebRTC] ontrack fired — kind:", event.track.kind,
            "streams:", event.streams?.length,
          );

          let incoming: MediaStream;

          if (event.streams && event.streams.length > 0) {
            incoming = event.streams[0];
          } else {
            // Fallback: reuse an existing remote stream or create one
            if (remoteStreamRef.current) {
              incoming = remoteStreamRef.current;
            } else {
              incoming = new MediaStream();
            }
            incoming.addTrack(event.track);
          }

          remoteStreamRef.current = incoming;

          event.track.onunmute = () => {
            console.log("[WebRTC] Remote track unmuted:", event.track.kind);
            setRemoteStream(new MediaStream(incoming.getTracks()));
          };

          // Always construct a new MediaStream instance so React detects the reference change and updates RemoteVideo
          setRemoteStream(new MediaStream(incoming.getTracks()));
          setPhase("connected");
          console.log(
            "[WebRTC] Remote stream set — tracks:",
            incoming.getTracks().map((t) => `${t.kind}:${t.readyState}`).join(", "),
          );
        };

        // 6. Send local ICE candidates to the remote peer via signaling
        pc.onicecandidate = (event) => {
          if (!event.candidate) {
            console.log("[WebRTC] ICE gathering complete");
            return;
          }
          if (!event.candidate.candidate) return;

          sendIceCandidate(videoSessionId, {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
          });
          console.log("[WebRTC] Local ICE candidate sent:", event.candidate.candidate.slice(0, 60));
        };

        // 7. Connection state diagnostics
        pc.onconnectionstatechange = () => {
          logState("connectionstatechange");
          if (pc.connectionState === "connected") {
            setPhase("connected");
          } else if (
            pc.connectionState === "failed" ||
            pc.connectionState === "disconnected"
          ) {
            setPhase("connecting");
          }
        };

        pc.oniceconnectionstatechange = () => {
          logState("iceconnectionstatechange");
        };

        pc.onsignalingstatechange = () => {
          logState("signalingstatechange");
        };

        // 8. Subscribe to signaling events BEFORE joining the room so we
        //    never miss an event that fires the moment we enter.
        subscribeToParticipantJoined(handleParticipantJoined);
        subscribeToCallAccepted(handleCallAccepted);
        subscribeToVideoOffer(handleVideoOffer);
        subscribeToVideoAnswer(handleVideoAnswer);
        subscribeToIceCandidate(handleIceCandidate);
        subscribeToVideoError(handleSocketError);
        subscribeToSessionEnded(handleRemoteSessionEnded);

        // 9. REST join step to ensure database participation before socket room entry
        try {
          const joinedSession = await videoSessionService.joinSession(videoSessionId);
          if (joinedSession) {
            setSessionDetails(joinedSession);
          }
        } catch (joinErr) {
          console.warn("[VideoSession] REST joinSession note:", joinErr);
        }

        // 10. Join the socket room — this triggers video:participant-joined
        //     on the ALREADY-PRESENT participant who then creates the offer.
        joinVideoSession(videoSessionId);
        setPhase("waiting");
        console.log("[VideoSession] Socket join-session emitted:", videoSessionId);
      } catch (err) {
        console.error("[VideoSession] Initialization failed:", err);
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Failed to join the video session.";
        if (!destroyed) setMediaError(msg);
      }
    };

    void initialize();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      destroyed = true;

      unsubscribeFromParticipantJoined(handleParticipantJoined);
      unsubscribeFromCallAccepted(handleCallAccepted);
      unsubscribeFromVideoOffer(handleVideoOffer);
      unsubscribeFromVideoAnswer(handleVideoAnswer);
      unsubscribeFromIceCandidate(handleIceCandidate);
      unsubscribeFromVideoError(handleSocketError);
      unsubscribeFromSessionEnded(handleRemoteSessionEnded);

      leaveVideoSession(videoSessionId);

      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      pcRef.current?.close();
      pcRef.current = null;
      remoteStreamRef.current = null;

      setRemoteStream(null);
      setLocalStream(null);
    };
  }, [videoSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Error Screen 
  if (mediaError) {
    return (
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 8rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#03000D",
          borderRadius: "1rem",
          gap: "1.5rem",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertTriangle size={36} className="text-rose-400" />
        </div>
        <p
          style={{
            color: "#f87171",
            fontSize: "1rem",
            fontWeight: 600,
            textAlign: "center",
            maxWidth: "480px",
          }}
        >
          {mediaError}
        </p>
        <button
          onClick={handleEndCall}
          style={{
            padding: "0.6rem 1.4rem",
            borderRadius: "0.5rem",
            background: "rgba(239,68,68,0.2)",
            border: "1px solid rgba(239,68,68,0.5)",
            color: "#fca5a5",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  // ─── Main Call UI ─────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 8rem)",
        background: "#03000D",
        borderRadius: "1rem",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Floating Top Bar: Live Status & Remaining Time Countdown ── */}
      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          left: "1.5rem",
          right: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {/* Left: Phase indicator */}
        <div
          style={{
            pointerEvents: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(10, 5, 29, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "0.4rem 0.9rem",
            borderRadius: "9999px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                phase === "connected"
                  ? "#10b981"
                  : phase === "connecting"
                    ? "#f59e0b"
                    : "#8b5cf6",
              boxShadow:
                phase === "connected"
                  ? "0 0 10px #10b981"
                  : "none",
              animation: phase === "connected" ? "pulse 2s infinite" : "none",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color:
                phase === "connected"
                  ? "#34d399"
                  : phase === "connecting"
                    ? "#fbbf24"
                    : "#c084fc",
            }}
          >
            {phase === "connected"
              ? "Live Call"
              : phase === "connecting"
                ? "Connecting…"
                : "Waiting"}
          </span>
        </div>

        {/* Center: Remaining Time Countdown */}
        {remainingSeconds !== null && (
          <div
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background:
                remainingSeconds <= 60
                  ? "rgba(225, 29, 72, 0.25)"
                  : remainingSeconds <= 300
                    ? "rgba(217, 119, 6, 0.25)"
                    : "rgba(10, 5, 29, 0.85)",
              backdropFilter: "blur(14px)",
              border: `1px solid ${
                remainingSeconds <= 60
                  ? "rgba(244, 63, 94, 0.6)"
                  : remainingSeconds <= 300
                    ? "rgba(245, 158, 11, 0.5)"
                    : "rgba(255, 255, 255, 0.15)"
              }`,
              padding: "0.45rem 1.15rem",
              borderRadius: "9999px",
              boxShadow:
                remainingSeconds <= 60
                  ? "0 0 24px rgba(225, 29, 72, 0.4)"
                  : remainingSeconds <= 300
                    ? "0 0 20px rgba(217, 119, 6, 0.3)"
                    : "0 4px 20px rgba(0, 0, 0, 0.6)",
              transition: "all 0.3s ease",
              animation:
                remainingSeconds <= 60
                  ? "pulse 1.2s infinite"
                  : "none",
            }}
          >
            
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.1,
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color:
                    !sessionDetails?.userAcceptedAt &&
                    sessionDetails?.status === "WAITING"
                      ? "rgba(255, 255, 255, 0.5)"
                      : remainingSeconds <= 60
                        ? "#fda4af"
                        : remainingSeconds <= 300
                          ? "#fde68a"
                          : "rgba(255, 255, 255, 0.6)",
                }}
              >
                {!sessionDetails?.userAcceptedAt &&
                sessionDetails?.status === "WAITING"
                  ? "Starts On Accept"
                  : remainingSeconds <= 60
                    ? "Ending Soon"
                    : "Time Remaining"}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  fontFamily: "monospace",
                  letterSpacing: "0.06em",
                  color:
                    remainingSeconds <= 60
                      ? "#ffffff"
                      : remainingSeconds <= 300
                        ? "#fef08a"
                        : "#ffffff",
                }}
              >
                {formatTimeRemaining(remainingSeconds)}
              </span>
            </div>
          </div>
        )}

        
      </div>

      {/* ── Socket error toast ── */}
      {socketError && (
        <div
          style={{
            position: "absolute",
            top: "4.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.5)",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            color: "#fca5a5",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          ⚠ {socketError}
        </div>
      )}

      {/* ── Remote video — fills entire background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#03000D",
        }}
      >
        {remoteStream ? (
          <RemoteVideo
            stream={remoteStream}
            participantName={
              sessionDetails?.otherParticipantName || "Remote Participant"
            }
            isConnecting={phase === "connecting" || phase === "initializing"}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.25rem",
            }}
          >
            {/* Animated pulsing ring */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid rgba(168,85,247,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "pulse 2s ease-in-out infinite",
                boxShadow: "0 0 32px rgba(168,85,247,0.2)",
              }}
            >
              <Video size={34} className="text-purple-400" />
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.95rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {phase === "initializing"
                ? "Initializing…"
                : phase === "connecting"
                  ? "Connecting video…"
                  : "Waiting for the other participant…"}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.75rem",
              }}
            >
              Session: {videoSessionId}
            </p>
          </div>
        )}
      </div>

      {/* ── Local video PiP — bottom right ── */}
      <div
        style={{
          position: "absolute",
          bottom: "6rem",
          right: "1.5rem",
          width: "clamp(140px, 20vw, 220px)",
          aspectRatio: "4/3",
          borderRadius: "0.875rem",
          overflow: "hidden",
          border: "2px solid rgba(168,85,247,0.5)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(168,85,247,0.1)",
          background: "#111",
          zIndex: 2,
        }}
      >
        {localStream ? (
          <LocalVideo stream={localStream} isCameraOn={isCameraOn} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.7rem",
            }}
          >
            Camera…
          </div>
        )}
      </div>

      {/* ── Call controls — bottom bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
          zIndex: 3,
        }}
      >
        {/* Mic toggle */}
        <ControlButton
          id="btn-toggle-mic"
          onClick={toggleMic}
          active={isMicOn}
          activeColor="rgba(255,255,255,0.12)"
          inactiveColor="rgba(239,68,68,0.2)"
          inactiveBorder="rgba(239,68,68,0.5)"
          label={isMicOn ? "Mute" : "Unmute"}
        >
          {isMicOn ? (
            <Mic size={22} className="text-white" />
          ) : (
            <MicOff size={22} className="text-rose-400" />
          )}
        </ControlButton>

        {/* Camera toggle */}
        <ControlButton
          id="btn-toggle-camera"
          onClick={toggleCamera}
          active={isCameraOn}
          activeColor="rgba(255,255,255,0.12)"
          inactiveColor="rgba(239,68,68,0.2)"
          inactiveBorder="rgba(239,68,68,0.5)"
          label={isCameraOn ? "Stop Video" : "Start Video"}
        >
          {isCameraOn ? (
            <Video size={22} className="text-white" />
          ) : (
            <VideoOff size={22} className="text-rose-400" />
          )}
        </ControlButton>

        {/* End call */}
        <ControlButton
          id="btn-end-call"
          onClick={handleEndCall}
          active={false}
          activeColor="rgba(239,68,68,0.3)"
          inactiveColor="rgba(239,68,68,0.3)"
          inactiveBorder="rgba(239,68,68,0.6)"
          label="End Call"
        >
          <PhoneOff size={22} className="text-rose-400" />
        </ControlButton>
      </div>

      {/* ── Manual End Call Confirmation Modal ── */}
      {showEndCallConfirm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 40,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#0A051D",
              border: "1px solid rgba(244, 63, 94, 0.4)",
              borderRadius: "1.25rem",
              padding: "1.5rem",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "0.75rem",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PhoneOff size={20} className="text-rose-400" />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>
                Disconnect Video Call?
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.5 }}>
              Are you sure you want to end this call? This will disconnect the session for all participants.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                onClick={() => setShowEndCallConfirm(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "transparent",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Keep Talking
              </button>
              <button
                onClick={handleConfirmEndCall}
                disabled={isEnding}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "#e11d48",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(225, 29, 72, 0.4)",
                }}
              >
                {isEnding ? "Ending…" : "Yes, End Call"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Session Ended Screen Overlay ── */}
      {isSessionEnded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            background: "rgba(5, 0, 23, 0.95)",
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              background:
                sessionDetails?.status === "INCOMPLETE"
                  ? "rgba(245, 158, 11, 0.12)"
                  : "rgba(16, 185, 129, 0.12)",
              border: `2px solid ${
                sessionDetails?.status === "INCOMPLETE"
                  ? "rgba(245, 158, 11, 0.4)"
                  : "rgba(16, 185, 129, 0.4)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                sessionDetails?.status === "INCOMPLETE"
                  ? "0 0 35px rgba(245, 158, 11, 0.25)"
                  : "0 0 35px rgba(16, 185, 129, 0.25)",
            }}
          >
            {sessionDetails?.status === "INCOMPLETE" ? (
              <AlertTriangle size={40} className="text-amber-400" />
            ) : (
              <CheckCircle2 size={40} className="text-emerald-400" />
            )}
          </div>
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "white",
                marginBottom: "0.4rem",
              }}
            >
              {sessionDetails?.status === "INCOMPLETE"
                ? "Session Ended Early (< 20 Mins)"
                : "Session Completed"}
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.65)",
                maxWidth: "420px",
                lineHeight: 1.5,
              }}
            >
              {endedReason || "The video call session has ended."}
            </p>
            {sessionDetails?.actualDurationMinutes !== undefined && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#c084fc",
                  marginTop: "0.5rem",
                  fontWeight: 600,
                }}
              >
                Conducted Duration: {sessionDetails.actualDurationMinutes} min
                {sessionDetails.actualDurationMinutes === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {/* If refund is eligible and not yet claimed */}
          {sessionDetails?.refundEligible &&
            sessionDetails?.refundStatus === "ELIGIBLE" && (
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "1rem",
                  padding: "1rem 1.5rem",
                  maxWidth: "420px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#fbbf24",
                      fontWeight: 700,
                    }}
                  >
                    100% Refund Eligible
                  </span>
                  {sessionDetails.sessionPrice ? (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#ffffff",
                        fontWeight: 800,
                      }}
                    >
                      (₹{sessionDetails.sessionPrice})
                    </span>
                  ) : null}
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    textAlign: "center",
                  }}
                >
                  Because this session ended before 20 minutes, you are eligible
                  for a complete refund to your Bodometer Wallet.
                </p>
                <button
                  onClick={handleClaimRefund}
                  disabled={isRequestingRefund}
                  style={{
                    padding: "0.55rem 1.4rem",
                    borderRadius: "0.75rem",
                    background: "#f59e0b",
                    color: "#000",
                    fontWeight: 800,
                    fontSize: "0.825rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
                  }}
                >
                  {isRequestingRefund
                    ? "Crediting Wallet…"
                    : "Claim Full Refund Now"}
                </button>
              </div>
            )}

          {sessionDetails?.refundStatus === "COMPLETED" && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "0.75rem",
                padding: "0.6rem 1.25rem",
                color: "#34d399",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              ✓ Full refund credited to your Bodometer Wallet
            </div>
          )}

          <button
            onClick={() => window.history.back()}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "0.875rem",
              background: "#9333ea",
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(147, 51, 234, 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            Return to Bookings
          </button>
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// ─── Small control button component ──────────────────────────────────────────
interface ControlButtonProps {
  id: string;
  onClick: () => void;
  active: boolean;
  activeColor: string;
  inactiveColor: string;
  inactiveBorder: string;
  label: string;
  children: React.ReactNode;
}

function ControlButton({
  id,
  onClick,
  active,
  activeColor,
  inactiveColor,
  inactiveBorder,
  label,
  children,
}: ControlButtonProps) {
  return (
    <button
      id={id}
      title={label}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
        padding: "0.6rem 1rem",
        borderRadius: "0.875rem",
        background: active ? activeColor : inactiveColor,
        border: `1px solid ${active ? "rgba(255,255,255,0.15)" : inactiveBorder}`,
        color: "white",
        cursor: "pointer",
        transition: "all 0.2s ease",
        minWidth: "68px",
      }}
    >
      {children}
      <span style={{ fontSize: "0.65rem", fontWeight: 600, color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)" }}>
        {label}
      </span>
    </button>
  );
}

export default VideoSession;