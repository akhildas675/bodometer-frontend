import { socket } from "@/infrastructure/socket/socket.client";
import { NotificationItem } from "@/features/notification/types/notification.types";

export const NOTIFICATION_SOCKET_EVENTS = {
  NEW_NOTIFICATION: "notification:new",
} as const;

export const subscribeToNotifications = (
  callback: (notification: NotificationItem) => void,
) => {
  socket.on(
    NOTIFICATION_SOCKET_EVENTS.NEW_NOTIFICATION,
    callback,
  );
};

export const unsubscribeFromNotifications = (
  callback: (notification: NotificationItem) => void,
) => {
  socket.off(
    NOTIFICATION_SOCKET_EVENTS.NEW_NOTIFICATION,
    callback,
  );
};
