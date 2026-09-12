import { useEffect } from "react";
import { socket } from "./socket.client";
import { initializeNotificationSocket } from "@/modules/notification/socket/notification.listener";
import { initializeVideoCallSocket } from "@/modules/video.session/socket/video-call.listener";
import { SocketProviderProps } from "./socket.types";

export function SocketProvider({
  isAuthenticated,
  children,
}: SocketProviderProps) {
  useEffect(() => {
    if (!isAuthenticated) {
      if (socket.connected) {
        socket.disconnect();
      }

      return;
    }

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleDisconnect = (reason: string) => {
      console.log("Socket disconnected:", reason);
    };

   
  socket.on("connect", handleConnect);
socket.on("disconnect", handleDisconnect);

const cleanupNotificationListener =
  initializeNotificationSocket();

const cleanupVideoCallListener =
  initializeVideoCallSocket();

socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      cleanupNotificationListener();
      cleanupVideoCallListener();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}