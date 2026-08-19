import { create } from "zustand";
import { notificationService } from "@/modules/notification/service/notification.service";
import { NotificationItem } from "@/interface/notification.interface";

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  fetchUnreadCount: () => Promise<number>;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: (amount?: number) => void;
  decrementUnreadCount: (amount?: number) => void;
  addNotification: (notification: NotificationItem) => void;
  setNotifications: (notifications: NotificationItem[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  fetchUnreadCount: async () => {
    try {
      set({ loading: true });
      const res = await notificationService.getUnreadCount();
      if (res && res.success) {
        const count = res.unreadCount ?? res.data?.unreadCount ?? 0;
        set({ unreadCount: count });
        return count;
      }
    } catch (err) {
      console.error("Failed to fetch unread notification count:", err);
    } finally {
      set({ loading: false });
    }
    return 0;
  },
  setUnreadCount: (count: number) => set({ unreadCount: count }),
  incrementUnreadCount: (amount = 1) =>
    set((state) => ({ unreadCount: state.unreadCount + amount })),
  decrementUnreadCount: (amount = 1) =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - amount) })),
  addNotification: (notification: NotificationItem) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  setNotifications: (notifications: NotificationItem[]) =>
    set({ notifications }),
}));
