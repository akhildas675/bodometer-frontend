import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/role";
import { useVideoSession } from "../hooks/use-video-session";
import { WaitingRoom } from "../components/WaitingRoom";
import { CallRequestModal } from "../components/CallRequestModal";
import { SessionEnded } from "../components/SessionEnded";
import { VideoCall } from "../components/VideoCall";

export const VideoCallPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isTrainer = user?.role === ROLES.TRAINER;

  const {
    session,
    loading,
    error,
    handleRequestCall,
    handleAcceptCall,
    handleRejectCall,
  } = useVideoSession(bookingId || "");

  if (!bookingId) {
    return (
      <div className="p-8 text-center text-rose-400 font-semibold">
        Booking ID is missing.
      </div>
    );
  }

  if (loading && !session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-zinc-400">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading video session...</span>
        </div>
      </div>
    );
  }

  // If session is completed or cancelled/expired -> Show SessionEnded
  if (
    session &&
    (session.status === "COMPLETED" ||
      session.status === "CANCELLED" ||
      session.status === "EXPIRED")
  ) {
    return (
      <SessionEnded
        status={session.status}
        reason={session.terminationReason}
        onClose={() => navigate(-1)}
      />
    );
  }

  // If session is ACCEPTED or ACTIVE -> Render VideoCall with Camera & Microphone feeds!
  if (session && (session.status === "ACCEPTED" || session.status === "ACTIVE")) {
    return (
      <VideoCall
        session={session}
        isTrainer={isTrainer}
        onEndCall={() => navigate(-1)}
      />
    );
  }

  // Otherwise: Waiting room
  const showCallRequestModal = !isTrainer && session?.status === "WAITING";

  return (
    <>
      <WaitingRoom
        isTrainer={isTrainer}
        scheduledStartTime={session?.scheduledStartTime}
        scheduledEndTime={session?.scheduledEndTime}
        status={session?.status}
        onRequestCall={handleRequestCall}
        isLoading={loading}
        error={error}
      />

      {showCallRequestModal && (
        <CallRequestModal
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          isLoading={loading}
        />
      )}
    </>
  );
};

export default VideoCallPage;
