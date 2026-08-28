import { NotificationItem } from "@/interface/notification.interface";
import { VideoSession } from "@/modules/video-call/types/video-session.types";

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
  "video:call-request": (session: VideoSession) => void;
  "video:call-accepted": (session: VideoSession) => void;
  "video:call-rejected": (session: VideoSession) => void;
  "video:participant-joined": (data: { participantId: string; session?: VideoSession; role?: string }) => void;
  "video:participant-left": (data: { participantId: string; session?: VideoSession; role?: string }) => void;
  "video:session-ended": (session: VideoSession) => void;
  "video:offer": (data: { senderId: string; offer: RTCSessionDescriptionInit }) => void;
  "video:answer": (data: { senderId: string; answer: RTCSessionDescriptionInit }) => void;
  "video:ice-candidate": (data: { senderId: string; candidate: RTCIceCandidateInit }) => void;
}

export interface ClientToServerEvents {
  "video:join-room": (roomId: string) => void;
  "video:leave-room": (roomId: string) => void;
  "video:offer": (data: { bookingId: string; offer: RTCSessionDescriptionInit }) => void;
  "video:answer": (data: { bookingId: string; answer: RTCSessionDescriptionInit }) => void;
  "video:ice-candidate": (data: { bookingId: string; candidate: RTCIceCandidateInit }) => void;
}
