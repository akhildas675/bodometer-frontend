import { NotificationItem } from "@/interface/notification.interface";
import { VideoSession } from "@/modules/video.session/types";

export interface SocketProviderProps {
  isAuthenticated: boolean;
  children?: React.ReactNode;
}

export interface ClientSocketConfig {
  url: string;
  autoConnect: boolean;
  withCredentials: boolean;
}

export interface ServerToClientEvents {
  "notification:new": (notification: NotificationItem) => void;

  "video:participant-joined": (data: {
    participantId: string;
    session?: VideoSession;
  }) => void;

  "video:participant-left": (data: {
    participantId: string;
    session?: VideoSession;
  }) => void;

  "video:offer": (data: {
    participantId: string;
    offer: RTCSessionDescriptionInit;
  }) => void;

  "video:answer": (data: {
    participantId: string;
    answer: RTCSessionDescriptionInit;
  }) => void;

  "video:ice-candidate": (data: {
    participantId: string;
    candidate: RTCIceCandidateInit;
  }) => void;

  "video:error": (data: {
    event: string;
    message: string;
  }) => void;

  "video:call-request": (data: {
    videoSessionId: string;
  }) => void;

  "video:call-accepted": (data: {
    videoSessionId: string;
    session?: VideoSession;
  }) => void;

  "video:session-ended": (data: {
    videoSessionId: string;
    session?: VideoSession;
  }) => void;
}

export interface ClientToServerEvents {
  "video:join-session": (videoSessionId: string) => void;

  "video:leave-session": (videoSessionId: string) => void;

  "video:offer": (
    videoSessionId: string,
    offer: RTCSessionDescriptionInit,
  ) => void;

  "video:answer": (
    videoSessionId: string,
    answer: RTCSessionDescriptionInit,
  ) => void;

  "video:ice-candidate": (
    videoSessionId: string,
    candidate: RTCIceCandidateInit,
  ) => void;
}