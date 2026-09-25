import { create } from "zustand";
import { notificationService } from "@/features/notification/services/notification.service";
import { NotificationItem } from "@/features/notification/types/notification.types";

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  fetchUnreadCount: (force?: boolean) => Promise<number>;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: (amount?: number) => void;
  decrementUnreadCount: (amount?: number) => void;
  addNotification: (notification: NotificationItem) => void;
  setNotifications: (notifications: NotificationItem[]) => void;
}

let isFetchingUnread = false;
let lastUnreadFetchTime = 0;
const UNREAD_CACHE_TTL = 15000; // 15 seconds cache

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  fetchUnreadCount: async (force = false) => {
    const now = Date.now();
    if (!force && now - lastUnreadFetchTime < UNREAD_CACHE_TTL) {
      return get().unreadCount;
    }
    if (isFetchingUnread) {
      return get().unreadCount;
    }

    isFetchingUnread = true;
    try {
      set({ loading: true });
      const res = await notificationService.getUnreadCount();
      lastUnreadFetchTime = Date.now();
      if (res && res.success) {
        const count = res.unreadCount ?? res.data?.unreadCount ?? 0;
        set({ unreadCount: count });
        return count;
      }
    } catch (err) {
      console.error("Failed to fetch unread notification count:", err);
    } finally {
      isFetchingUnread = false;
      set({ loading: false });
    }
    return get().unreadCount;
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
