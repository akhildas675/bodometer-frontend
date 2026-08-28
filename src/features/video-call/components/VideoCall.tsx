import React, { useEffect, useRef, useState } from "react";
import { ParticipantVideo } from "./ParticipantVideo";
import { CallControls } from "./CallControls";
import {
  sendICECandidate,
  sendWebRTCAnswer,
  sendWebRTCOffer,
  subscribeToVideoEvents,
  joinVideoRoom,
} from "@/modules/video-call/socket/video-call.socket";
import { endSession, joinSession, leaveSession } from "@/modules/video-call/service/video-session.service";
import { VideoSession } from "@/modules/video-call/types/video-session.types";


interface VideoCallProps {
  session: VideoSession;
  isTrainer: boolean;
  onEndCall: () => void;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

export const VideoCall: React.FC<VideoCallProps> = ({
  session,
  isTrainer,
  onEndCall,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [remoteConnected, setRemoteConnected] = useState<boolean>(false);


  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);



  // 2. Initialize Media Stream & WebRTC Connection
  useEffect(() => {
    let isSubscribed = true;

    const setupMediaAndPeer = async () => {
      try {
        // Notify backend & room of join
        await joinSession(session.id);
        joinVideoRoom(session.bookingId);

        // Get local camera & microphone media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!isSubscribed) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        setLocalStream(stream);
        localStreamRef.current = stream;

        // Initialize PeerConnection
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Add local tracks to WebRTC
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle remote stream tracks
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
            setRemoteConnected(true);
          }
        };

        // Handle ICE Candidate generation
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendICECandidate(session.bookingId, event.candidate);
          }
        };

        // If Trainer, initiate WebRTC Offer
        if (isTrainer) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendWebRTCOffer(session.bookingId, offer);
        }
      } catch (err) {
        console.error("Failed to access camera/microphone or setup WebRTC:", err);
      }
    };

    setupMediaAndPeer();

    // 3. Subscribe to WebRTC Signaling Socket events
    const unsubscribe = subscribeToVideoEvents({
      onParticipantJoined: async () => {
        setRemoteConnected(true);
        // If trainer, re-send WebRTC offer when participant joins to eliminate race conditions
        if (isTrainer && pcRef.current) {
          try {
            const offer = await pcRef.current.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            await pcRef.current.setLocalDescription(offer);
            sendWebRTCOffer(session.bookingId, offer);
          } catch (e) {
            console.error("Error re-sending offer on participant join:", e);
          }
        }
      },
      onOfferReceived: async ({ offer }) => {
        const pc = pcRef.current;
        if (!pc) return;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendWebRTCAnswer(session.bookingId, answer);
        } catch (e) {
          console.error("Error handling WebRTC offer:", e);
        }
      },
      onAnswerReceived: async ({ answer }) => {
        const pc = pcRef.current;
        if (!pc) return;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          setRemoteConnected(true);
        } catch (e) {
          console.error("Error handling WebRTC answer:", e);
        }
      },
      onICECandidateReceived: async ({ candidate }) => {
        const pc = pcRef.current;
        if (!pc) return;
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ICE candidate:", e);
        }
      },
      onParticipantLeft: () => {
        setRemoteConnected(false);
        setRemoteStream(null);
      },
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      leaveSession(session.id).catch(() => null);
    };
  }, [session.id, session.bookingId, isTrainer]);

  // 4. Toggle Controls
  const handleToggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const handleToggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const handleEndCall = async () => {
    try {
      await endSession(session.id);
    } catch (e) {
      console.error("Error ending session:", e);
    } finally {
      onEndCall();
    }
  };



  const localName = isTrainer ? "Trainer" : "User";
  const remoteName = isTrainer ? "Client" : "Trainer";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-4 sm:p-6 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 rounded-2xl px-6 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-sm text-white">LIVE SESSION</span>
        </div>

      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center min-h-[60vh]">
        {/* Remote Video Feed */}
        <ParticipantVideo
          stream={remoteStream}
          participantName={remoteName}
          isAudioMuted={false}
          isVideoOff={!remoteConnected}
        />

        {/* Local Video Feed */}
        <ParticipantVideo
          stream={localStream}
          isLocal
          participantName={localName}
          isAudioMuted={isMuted}
          isVideoOff={isVideoOff}
        />
      </div>

      {/* Floating Control Bar */}
      <div className="flex justify-center pt-2">
        <CallControls
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCamera}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};
