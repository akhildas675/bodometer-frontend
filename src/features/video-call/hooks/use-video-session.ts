import { useCallback, useEffect, useState } from "react";
import { VideoSession } from "@/modules/video-call/types/video-session.types";
import {
  acceptCall,
  getVideoSession,
  rejectCall,
  requestCall,
} from "@/modules/video-call/service/video-session.service";
import {
  joinVideoRoom,
  leaveVideoRoom,
  subscribeToVideoEvents,
} from "@/modules/video-call/socket/video-call.socket";

export const useVideoSession = (bookingId: string) => {
  const [session, setSession] = useState<VideoSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [remainingSeconds, setRemainingSeconds] = useState<number>(300); // timer removed

  const fetchSession = useCallback(async () => {
    if (!bookingId) return;
    try {
      const data = await getVideoSession(bookingId);
      if (data && data.id) {
        setSession(data);
      }
    } catch (err: unknown) {
      // Session might not be created yet by trainer
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Polling fallback every 3 seconds while waiting for session to start/be accepted
  useEffect(() => {
    if (
      !bookingId ||
      session?.status === "ACCEPTED" ||
      session?.status === "ACTIVE" ||
      session?.status === "COMPLETED" ||
      session?.status === "CANCELLED"
    ) {
      return;
    }

    const interval = setInterval(() => {
      fetchSession();
    }, 3000);

    return () => clearInterval(interval);
  }, [bookingId, session?.status, fetchSession]);

  useEffect(() => {
    if (!bookingId) return;

    joinVideoRoom(bookingId);

    const unsubscribe = subscribeToVideoEvents({
      onCallRequested: (updatedSession) => {
        if (updatedSession) setSession(updatedSession);
      },
      onCallAccepted: (updatedSession) => {
        if (updatedSession) setSession(updatedSession);
      },
      onCallRejected: (updatedSession) => {
        if (updatedSession) setSession(updatedSession);
      },
      onParticipantJoined: ({ session: updatedSession }) => {
        if (updatedSession) setSession(updatedSession);
      },
      onParticipantLeft: ({ session: updatedSession }) => {
        if (updatedSession) setSession(updatedSession);
      },
      onSessionEnded: (updatedSession) => {
        if (updatedSession) setSession(updatedSession);
      },
    });

    return () => {
      leaveVideoRoom(bookingId);
      unsubscribe();
    };
  }, [bookingId]);



  const handleRequestCall = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestCall(bookingId);
      setSession(data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to start call request";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCall = async () => {
    if (!session) return;
    try {
      setLoading(true);
      setError(null);
      const data = await acceptCall(session.id);
      setSession(data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to accept call";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCall = async () => {
    if (!session) return;
    try {
      setLoading(true);
      setError(null);
      const data = await rejectCall(session.id);
      setSession(data);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to reject call";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    error,

    fetchSession,
    handleRequestCall,
    handleAcceptCall,
    handleRejectCall,
  };
};
