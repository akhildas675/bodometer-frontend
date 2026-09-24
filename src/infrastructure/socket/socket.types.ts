import { NotificationItem } from "@/features/notification/types/notification.types";
import { VideoSession } from "@/features/video-session/types/video-session-socket.types";
import { ChatMessage } from "@/features/chat/types/chat.types";

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

  "chat:message": (message: ChatMessage) => void;
  "chat:sent": (message: ChatMessage) => void;
  "chat:joined": (data: { conversationId: string }) => void;
  "chat:left": (data: { conversationId: string }) => void;
  "chat:notification": (data: {
    conversationId: string;
    message: ChatMessage;
  }) => void;
  "chat:seen": (data: {
    conversationId: string;
    readerId: string;
    readAt: string;
  }) => void;
  "chat:error": (data: { event?: string; message: string }) => void;
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

  "chat:join": (conversationId: string) => void;
  "chat:leave": (conversationId: string) => void;
  "chat:read": (conversationId: string) => void;
  "chat:send": (payload: {
    conversationId: string;
    content: string;
    messageType: string;
  }) => void;
}