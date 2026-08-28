import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "@/infrastructure/socket/socket.client";
import { useAuthStore } from "@/stores/auth.store";
import { VideoSession } from "@/modules/video-call/types/video-session.types";
import { trainerService } from "@/modules/trainer/service/trainer.service";
import { acceptCall, rejectCall, getVideoSession } from "@/modules/video-call/service/video-session.service";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";

export const GlobalCallRequestModal: React.FC = () => {
  const [incomingSession, setIncomingSession] = useState<VideoSession | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [trainerName, setTrainerName] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Do not show modal if already on the video call page
  const isAlreadyOnVideoCallPage = location.pathname.includes("/video-call");

  useEffect(() => {
    const handleCallRequest = (sessionData: VideoSession) => {
      console.log("GlobalCallRequestModal received video:call-request:", sessionData);
      if (!sessionData || sessionData.status !== "WAITING") return;

      // Match session userId with logged-in user id
      if (user && (String(sessionData.userId) === String(user.id))) {
        setIncomingSession(sessionData);
      }
    };

    const handleSessionEnded = (data?: { bookingId?: string }) => {
      if (!data || !incomingSession || data.bookingId === incomingSession.bookingId) {
        setIncomingSession(null);
      }
    };

    socket.on("video:call-request", handleCallRequest);
    socket.on("video:call-accepted", handleSessionEnded);
    socket.on("video:call-rejected", handleSessionEnded);
    socket.on("video:session-ended", handleSessionEnded);

    return () => {
      socket.off("video:call-request", handleCallRequest);
      socket.off("video:call-accepted", handleSessionEnded);
      socket.off("video:call-rejected", handleSessionEnded);
      socket.off("video:session-ended", handleSessionEnded);
    };
  }, [user, incomingSession]);

  // Fetch trainer name when incoming session changes
  useEffect(() => {
    if (!incomingSession) return;
    let isMounted = true;
    const fetchTrainer = async () => {
      try {
        const { data } = await trainerService.getTrainerById(incomingSession.trainerId);
        if (isMounted) {
          setTrainerName(data?.name ?? incomingSession.trainerId);
        }
      } catch (e) {
        console.error('Failed to fetch trainer name', e);
      }
    };
    fetchTrainer();
    return () => { isMounted = false; };
  }, [incomingSession?.trainerId]);

  // Fallback Polling: check active session for user if modal is not open
  useEffect(() => {
    if (!user || incomingSession || isAlreadyOnVideoCallPage) return;

    let isMounted = true;
    const checkActiveSession = async () => {
      try {
        // If bookingId stored in current path or state, check session status
        const pathParts = location.pathname.split("/");
        const possibleBookingId = pathParts[pathParts.length - 1];
        if (possibleBookingId && possibleBookingId.length === 24) {
          const session = await getVideoSession(possibleBookingId);
          if (isMounted && session && session.status === "WAITING" && String(session.userId) === String(user.id)) {
            setIncomingSession(session);
          }
        }
      } catch {
        // Ignore silent polling errors
      }
    };

    checkActiveSession();
    const interval = setInterval(checkActiveSession, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, incomingSession, isAlreadyOnVideoCallPage, location.pathname]);

  // Countdown timer disabled – feature temporarily turned off
  // useEffect(() => {
  //   if (!incomingSession?.trainerStartRequestedAt || incomingSession.status !== "WAITING") {
  //     return;
  //   }
  //   const calcRemaining = () => {
  //     const requestMs = new Date(incomingSession.trainerStartRequestedAt!).getTime();
  //     const elapsed = Math.floor((Date.now() - requestMs) / 1000);
  //     const rem = Math.max(0, 300 - elapsed);
  //     setRemainingSeconds(rem);
  //     if (rem <= 0) {
  //       setIncomingSession(null);
  //     }
  //   };
  //   calcRemaining();
  //   const interval = setInterval(calcRemaining, 1000);
  //   return () => clearInterval(interval);
  // }, [incomingSession?.trainerStartRequestedAt, incomingSession?.status]);

  if (!incomingSession || isAlreadyOnVideoCallPage) {
    return null;
  }

  const handleAccept = async () => {
    try {
      setLoading(true);
      await acceptCall(incomingSession.id);
      const bookingId = incomingSession.bookingId;
      setIncomingSession(null);
      navigate(USER_UI_ROUTES.USER_VIDEO_CALL.replace(":bookingId", bookingId));
    } catch (err) {
      console.error("Failed to accept call from global modal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await rejectCall(incomingSession.id);
      setIncomingSession(null);
    } catch (err) {
      console.error("Failed to reject call from global modal:", err);
    } finally {
      setLoading(false);
    }
  };


  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md bg-zinc-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-6">
        <div className="relative mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 002-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
            Incoming Video Call
          </span>
          <h3 className="text-xl font-bold text-white pt-2">
            {trainerName ? `${trainerName}` : 'Trainer'} is Ready to Start!
          </h3>
          <p className="text-sm text-white">
              Please accept the call to join the live video session.
            </p>
        </div>

        {/* Acceptance countdown disabled */
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 inline-block opacity-50">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 block">
              Acceptance Countdown (disabled)
            </span>
            <span className="text-2xl font-mono font-bold text-amber-400">
              --:--
            </span>
          </div>
        }

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleReject}
            disabled={loading}
            className="flex-1 py-3.5 px-4 rounded-2xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition cursor-pointer text-sm"
          >
            Reject (50% Refund)
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer text-sm animate-pulse"
          >
            {loading ? "Connecting..." : "Accept & Join Call"}
          </button>
        </div>
      </div>
    </div>
  );
};
