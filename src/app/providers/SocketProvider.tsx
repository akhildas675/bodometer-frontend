import { useEffect } from "react";
import { socket } from "@/infrastructure/socket/socket.client";
import { initializeNotificationSocket } from "@/features/notification/sockets/notification.listener";
import { initializeVideoCallSocket } from "@/features/video-session/sockets/video-call.listener";
import { SocketProviderProps } from "@/infrastructure/socket/socket.types";

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

    const cleanupNotificationListener = initializeNotificationSocket();
    const cleanupVideoCallListener = initializeVideoCallSocket();

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      cleanupNotificationListener();
      cleanupVideoCallListener();
      socket.disconnect();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}