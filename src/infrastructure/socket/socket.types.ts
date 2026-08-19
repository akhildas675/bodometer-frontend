import { NotificationItem } from "@/interface/notification.interface";

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
}

export interface ClientToServerEvents {}
