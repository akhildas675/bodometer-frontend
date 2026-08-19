import React, { useEffect, useState, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  Check,
  Calendar,
  CreditCard,
  Wallet,
  Dumbbell,
  Utensils,
  UserCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { notificationService } from "@/modules/notification/service/notification.service";
import type { NotificationItem } from "@/interface/notification.interface";
import { useNotificationStore } from "@/stores/notification.store";
import { toast } from "sonner";

interface NotificationCenterProps {
  role?: "admin" | "trainer" | "user";
  title?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  role = "user",
  title = "Notification Center",
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const limit = 10;

  const loadNotifications = useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      const [res, unreadRes] = await Promise.all([
        notificationService.getNotifications(currentPage, limit),
        notificationService.getUnreadCount(),
      ]);

      if (res.success && res.data) {
        setNotifications(res.data);
        const total = res.totalItems || res.data.length;
        setTotalItems(total);
        setTotalPages(Math.ceil(total / limit) || 1);
      }

      if (unreadRes && unreadRes.success) {
        const count = unreadRes.unreadCount ?? unreadRes.data?.unreadCount ?? 0;
        setUnreadCount(count);
        useNotificationStore.getState().setUnreadCount(count);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(page);
  }, [page, loadNotifications]);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      useNotificationStore.getState().decrementUnreadCount(1);

      const res = await notificationService.markAsRead(id);
      if (res.success) {
        toast.success("Marked as read");
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      toast.error("Failed to update notification");
      loadNotifications(page);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      setActionLoading(true);
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        useNotificationStore.getState().setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to mark all notifications as read");
    } finally {
      setActionLoading(false);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEntityIcon = (entityType?: string, type?: string) => {
    const et = (entityType || "").toUpperCase();
    const t = (type || "").toUpperCase();

    if (et === "BOOKING" || et === "RESCHEDULE_REQUEST" || t.includes("BOOKING")) {
      return <Calendar className="w-5 h-5 text-indigo-400" />;
    }
    if (et === "PAYMENT" || et === "REFUND" || t.includes("PAYMENT") || t.includes("REFUND")) {
      return <CreditCard className="w-5 h-5 text-emerald-400" />;
    }
    if (et === "WALLET" || t.includes("WALLET")) {
      return <Wallet className="w-5 h-5 text-amber-400" />;
    }
    if (et === "WORKOUT" || t.includes("WORKOUT")) {
      return <Dumbbell className="w-5 h-5 text-cyan-400" />;
    }
    if (et === "MEAL_PLAN" || et === "HEALTH_LOG" || t.includes("MEAL")) {
      return <Utensils className="w-5 h-5 text-rose-400" />;
    }
    if (et === "TRAINER" || t.includes("TRAINER")) {
      return <UserCheck className="w-5 h-5 text-purple-400" />;
    }
    if (et === "SUBSCRIPTION" || t.includes("SUBSCRIPTION")) {
      return <Zap className="w-5 h-5 text-yellow-400" />;
    }
    return <Sparkles className="w-5 h-5 text-blue-400" />;
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.isRead;
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 text-white">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-900/90 p-6 rounded-3xl border border-purple-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="relative p-3.5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl shadow-lg shadow-purple-500/30">
            <Bell className="w-7 h-7 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-rose-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-slate-900 shadow-md">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200">
                {title}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {role}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Stay updated with system activities, bookings, and alerts.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadNotifications(page)}
            disabled={loading}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition duration-200"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
          </button>
          <button
            onClick={handleMarkAllAsRead}
            disabled={actionLoading || unreadCount === 0}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              unreadCount > 0
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30"
                : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800"
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition duration-200 ${
              filter === "all"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            All Notifications ({totalItems})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl transition duration-200 ${
              filter === "unread"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <span>Unread Only</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-500/90 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notification List Content */}
      {loading && notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
          <RefreshCw className="w-10 h-10 text-purple-400 animate-spin mb-4" />
          <p className="text-slate-400 font-medium">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/80 text-center p-6">
          <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4">
            <Bell className="w-10 h-10 text-purple-400/60" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">No Notifications Found</h3>
          <p className="text-slate-400 max-w-md text-sm">
            {filter === "unread"
              ? "Great job! You have read all your notifications."
              : "You're all caught up. New updates will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id, item.isRead)}
              className={`group relative flex items-start space-x-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                item.isRead
                  ? "bg-slate-900/40 border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700/80 hover:bg-slate-900/70"
                  : "bg-gradient-to-r from-purple-950/30 via-slate-900/90 to-slate-900/90 border-purple-500/30 shadow-lg shadow-purple-950/20 hover:border-purple-500/50"
              }`}
            >
              {/* Unread indicator bar */}
              {!item.isRead && (
                <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full" />
              )}

              {/* Icon Container */}
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 shrink-0 group-hover:scale-105 transition duration-200">
                {getEntityIcon(item.entityType, item.type)}
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`text-base font-semibold truncate ${item.isRead ? "text-slate-300" : "text-white"}`}>
                    {item.title}
                  </h4>
                  <span className="flex items-center text-xs text-slate-400 shrink-0">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {item.message}
                </p>
              </div>

              {/* Action */}
              {!item.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(item.id, false);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-xl border border-purple-500/30 transition duration-200 shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
          <span className="text-sm text-slate-400">
            Page <span className="font-semibold text-white">{page}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`p-2 rounded-xl border transition ${
                page === 1
                  ? "bg-slate-800/30 text-slate-600 border-slate-800 cursor-not-allowed"
                  : "bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`p-2 rounded-xl border transition ${
                page === totalPages
                  ? "bg-slate-800/30 text-slate-600 border-slate-800 cursor-not-allowed"
                  : "bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
