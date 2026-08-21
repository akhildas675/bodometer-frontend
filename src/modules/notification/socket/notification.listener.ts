import { NotificationItem } from "@/interface/notification.interface";
import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "./notification.socket";
import { useNotificationStore } from "@/stores/notification.store";
import { toast } from "sonner";

export const initializeNotificationSocket = (
  onNotification?: (notification: NotificationItem) => void,
) => {
  const handleNotification = (
    notification: NotificationItem,
  ) => {
    console.log("New notification received via socket:", notification);

    useNotificationStore.getState().addNotification(notification);

    if (notification?.title) {
      toast.success(notification.title);
    }

    if (onNotification) {
      onNotification(notification);
    }
  };

  subscribeToNotifications(handleNotification);

  return () => {
    unsubscribeFromNotifications(handleNotification);
  };
};
