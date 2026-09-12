import { socket } from "@/infrastructure/socket/socket.client";
import { VideoSession } from "../types";


export interface VideoParticipantEvent {
  participantId: string;
  session?: VideoSession;
}

export interface VideoOfferEvent {
  participantId: string;
  offer: RTCSessionDescriptionInit;
}

export interface VideoAnswerEvent {
  participantId: string;
  answer: RTCSessionDescriptionInit;
}

export interface VideoIceCandidateEvent {
  participantId: string;
  candidate: RTCIceCandidateInit;
}

export interface VideoErrorEvent {
  event: string;
  message: string;
}

export const joinVideoSession = (
  videoSessionId: string,
): void => {
  socket.emit(
    "video:join-session",
    videoSessionId,
  );
};

export const leaveVideoSession = (
  videoSessionId: string,
): void => {
  socket.emit(
    "video:leave-session",
    videoSessionId,
  );
};

export const sendVideoOffer = (
  videoSessionId: string,
  offer: RTCSessionDescriptionInit,
): void => {
  socket.emit(
    "video:offer",
    videoSessionId,
    offer,
  );
};

export const sendVideoAnswer = (
  videoSessionId: string,
  answer: RTCSessionDescriptionInit,
): void => {
  socket.emit(
    "video:answer",
    videoSessionId,
    answer,
  );
};

export const sendIceCandidate = (
  videoSessionId: string,
  candidate: RTCIceCandidateInit,
): void => {
  socket.emit(
    "video:ice-candidate",
    videoSessionId,
    candidate,
  );
};

export const subscribeToParticipantJoined = (
  callback: (data: VideoParticipantEvent) => void,
): void => {
  socket.on(
    "video:participant-joined",
    callback,
  );
};

export const unsubscribeFromParticipantJoined = (
  callback: (data: VideoParticipantEvent) => void,
): void => {
  socket.off(
    "video:participant-joined",
    callback,
  );
};

export const subscribeToParticipantLeft = (
  callback: (data: VideoParticipantEvent) => void,
): void => {
  socket.on(
    "video:participant-left",
    callback,
  );
};

export const unsubscribeFromParticipantLeft = (
  callback: (data: VideoParticipantEvent) => void,
): void => {
  socket.off(
    "video:participant-left",
    callback,
  );
};

export const subscribeToVideoOffer = (
  callback: (data: VideoOfferEvent) => void,
): void => {
  socket.on(
    "video:offer",
    callback,
  );
};

export const unsubscribeFromVideoOffer = (
  callback: (data: VideoOfferEvent) => void,
): void => {
  socket.off(
    "video:offer",
    callback,
  );
};

export const subscribeToVideoAnswer = (
  callback: (data: VideoAnswerEvent) => void,
): void => {
  socket.on(
    "video:answer",
    callback,
  );
};

export const unsubscribeFromVideoAnswer = (
  callback: (data: VideoAnswerEvent) => void,
): void => {
  socket.off(
    "video:answer",
    callback,
  );
};

export const subscribeToIceCandidate = (
  callback: (data: VideoIceCandidateEvent) => void,
): void => {
  socket.on(
    "video:ice-candidate",
    callback,
  );
};

export const unsubscribeFromIceCandidate = (
  callback: (data: VideoIceCandidateEvent) => void,
): void => {
  socket.off(
    "video:ice-candidate",
    callback,
  );
};

export const subscribeToVideoError = (
  callback: (data: VideoErrorEvent) => void,
): void => {
  socket.on(
    "video:error",
    callback,
  );
};

export const unsubscribeFromVideoError = (
  callback: (data: VideoErrorEvent) => void,
): void => {
  socket.off(
    "video:error",
    callback,
  );
};

export interface VideoCallRequestEvent {
  videoSessionId: string;
}

export const subscribeToCallRequest = (
  callback: (data: VideoCallRequestEvent) => void,
): void => {
  socket.on("video:call-request", callback);
};

export const unsubscribeFromCallRequest = (
  callback: (data: VideoCallRequestEvent) => void,
): void => {
  socket.off("video:call-request", callback);
};

export interface VideoCallAcceptedEvent {
  videoSessionId: string;
  session?: VideoSession;
}

export const subscribeToCallAccepted = (
  callback: (data: VideoCallAcceptedEvent) => void,
): void => {
  socket.on("video:call-accepted", callback);
};

export const unsubscribeFromCallAccepted = (
  callback: (data: VideoCallAcceptedEvent) => void,
): void => {
  socket.off("video:call-accepted", callback);
};

export interface VideoSessionEndedEvent {
  videoSessionId: string;
  session?: VideoSession;
}

export const subscribeToSessionEnded = (
  callback: (data: VideoSessionEndedEvent) => void,
): void => {
  socket.on("video:session-ended", callback);
};

export const unsubscribeFromSessionEnded = (
  callback: (data: VideoSessionEndedEvent) => void,
): void => {
  socket.off("video:session-ended", callback);
};