import { socket } from "@/infrastructure/socket/socket.client";
import { VideoSession } from "../types/video-session.types";

export const joinVideoRoom = (bookingId: string) => {
  if (socket.connected) {
    socket.emit("video:join-room", bookingId);
  }
};

export const leaveVideoRoom = (bookingId: string) => {
  if (socket.connected) {
    socket.emit("video:leave-room", bookingId);
  }
};

export const sendWebRTCOffer = (bookingId: string, offer: RTCSessionDescriptionInit) => {
  if (socket.connected) {
    socket.emit("video:offer", { bookingId, offer });
  }
};

export const sendWebRTCAnswer = (bookingId: string, answer: RTCSessionDescriptionInit) => {
  if (socket.connected) {
    socket.emit("video:answer", { bookingId, answer });
  }
};

export const sendICECandidate = (bookingId: string, candidate: RTCIceCandidateInit) => {
  if (socket.connected) {
    socket.emit("video:ice-candidate", { bookingId, candidate });
  }
};

export const subscribeToVideoEvents = (callbacks: {
  onCallRequested?: (session: VideoSession) => void;
  onCallAccepted?: (session: VideoSession) => void;
  onCallRejected?: (session: VideoSession) => void;
  onParticipantJoined?: (data: { participantId: string; session?: VideoSession }) => void;
  onParticipantLeft?: (data: { participantId: string; session?: VideoSession }) => void;
  onSessionEnded?: (session: VideoSession) => void;
  onOfferReceived?: (data: { senderId: string; offer: RTCSessionDescriptionInit }) => void;
  onAnswerReceived?: (data: { senderId: string; answer: RTCSessionDescriptionInit }) => void;
  onICECandidateReceived?: (data: { senderId: string; candidate: RTCIceCandidateInit }) => void;
}) => {
  if (callbacks.onCallRequested) socket.on("video:call-request", callbacks.onCallRequested);
  if (callbacks.onCallAccepted) socket.on("video:call-accepted", callbacks.onCallAccepted);
  if (callbacks.onCallRejected) socket.on("video:call-rejected", callbacks.onCallRejected);
  if (callbacks.onParticipantJoined) socket.on("video:participant-joined", callbacks.onParticipantJoined);
  if (callbacks.onParticipantLeft) socket.on("video:participant-left", callbacks.onParticipantLeft);
  if (callbacks.onSessionEnded) socket.on("video:session-ended", callbacks.onSessionEnded);
  if (callbacks.onOfferReceived) socket.on("video:offer", callbacks.onOfferReceived);
  if (callbacks.onAnswerReceived) socket.on("video:answer", callbacks.onAnswerReceived);
  if (callbacks.onICECandidateReceived) socket.on("video:ice-candidate", callbacks.onICECandidateReceived);

  return () => {
    if (callbacks.onCallRequested) socket.off("video:call-request", callbacks.onCallRequested);
    if (callbacks.onCallAccepted) socket.off("video:call-accepted", callbacks.onCallAccepted);
    if (callbacks.onCallRejected) socket.off("video:call-rejected", callbacks.onCallRejected);
    if (callbacks.onParticipantJoined) socket.off("video:participant-joined", callbacks.onParticipantJoined);
    if (callbacks.onParticipantLeft) socket.off("video:participant-left", callbacks.onParticipantLeft);
    if (callbacks.onSessionEnded) socket.off("video:session-ended", callbacks.onSessionEnded);
    if (callbacks.onOfferReceived) socket.off("video:offer", callbacks.onOfferReceived);
    if (callbacks.onAnswerReceived) socket.off("video:answer", callbacks.onAnswerReceived);
    if (callbacks.onICECandidateReceived) socket.off("video:ice-candidate", callbacks.onICECandidateReceived);
  };
};
