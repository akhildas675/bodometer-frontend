import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Wallet,
  ArrowUpRight,
  Video,
  PhoneOff,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  clientBookingService,
  BookingResponseData,
  BookingRescheduleRequestDetails,
} from "@/modules/booking/service/client-booking.service";
import { walletService, UserWalletData, WalletTransactionData } from "@/modules/wallet/service/wallet.service";
import { videoSessionService } from "@/modules/video.session/service/video-session.service";
import { VideoSession } from "@/modules/video.session/types";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import SearchBar from "@/features/controls/search/search";
import SortDropdown, { SortConfig } from "@/features/controls/sort/sort";
import Pagination from "@/features/controls/pagination/pagination";
import { toast } from "sonner";

export const UserMyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponseData[]>([]);
  const [pendingRequests, setPendingRequests] = useState<{ request: BookingRescheduleRequestDetails; booking: BookingResponseData }[]>([]);
  const [wallet, setWallet] = useState<UserWalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionHistory, setSessionHistory] = useState<VideoSession[]>([]);
  const [requestingRefundId, setRequestingRefundId] = useState<string | null>(null);
  const [claimingRefundBookingId, setClaimingRefundBookingId] = useState<string | null>(null);
  // bookingId → videoSessionId (or null if none active)
  const [activeSessions, setActiveSessions] = useState<Record<string, string | null>>({});
  const [nowMs, setNowMs] = useState(Date.now());

  // Search, Filter, Sort, Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<SortConfig<"bookingDate" | "price">>({
    field: "bookingDate",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Cancellation Modal State
  const [selectedForCancel, setSelectedForCancel] = useState<BookingResponseData | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Respond Reschedule Modal State
  const [confirmModal, setConfirmModal] = useState<{
    request: BookingRescheduleRequestDetails;
    booking: BookingResponseData;
    action: "ACCEPT" | "DECLINE";
  } | null>(null);
  const [responding, setResponding] = useState(false);

  // Disconnect Video Call Modal State
  const [disconnectModal, setDisconnectModal] = useState<{
    bookingId: string;
    videoSessionId: string;
  } | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      clientBookingService.getUserBookings(),
      clientBookingService.getUserPendingRescheduleRequests(),
      walletService.getWalletBalance().catch(() => null),
      walletService.getWalletTransactions().catch(() => []),
      videoSessionService.getVideoSessionHistory({ limit: 50 }).catch(() => null),
    ])
      .then(([bookingsData, requestsData, walletData, txsData, historyData]) => {
        setBookings(bookingsData);
        setPendingRequests(requestsData);
        if (walletData) setWallet(walletData);
        if (txsData) setTransactions(txsData);
        if (historyData?.sessions) setSessionHistory(historyData.sessions);

        const now = Date.now();
        const inWindowBookings = bookingsData.filter((b) => {
          const start = new Date(b.startTime).getTime();
          const end   = new Date(b.endTime).getTime();
          return (
            b.status.toUpperCase() === "CONFIRMED" &&
            now >= start - 10 * 60 * 1000 &&
            now <= end + 10 * 60 * 1000
          );
        });

        if (inWindowBookings.length > 0) {
          const fetches = inWindowBookings.map((b) =>
            videoSessionService
              .getVideoSessionByBookingId(b.id)
              .then((vs) => ({ bookingId: b.id, videoSessionId: vs?.id ?? null }))
              .catch(() => ({ bookingId: b.id, videoSessionId: null }))
          );
          Promise.all(fetches).then((results) => {
            const map: Record<string, string | null> = {};
            results.forEach(({ bookingId, videoSessionId }) => {
              map[bookingId] = videoSessionId;
            });
            setActiveSessions((prev) => ({ ...prev, ...map }));
          });
        }
      })
      .catch(() => toast.error("Failed to load your booking sessions."))
      .finally(() => setLoading(false));
  };

  const handleRequestSessionRefund = async (videoSessionId: string) => {
    try {
      setRequestingRefundId(videoSessionId);
      await videoSessionService.requestRefund(videoSessionId);
      toast.success("100% session refund successfully credited to your Bodometer Wallet!");
      loadData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to request refund.";
      toast.error(msg);
    } finally {
      setRequestingRefundId(null);
    }
  };

  const handleClaimExpiredRefund = async (bookingId: string) => {
    try {
      setClaimingRefundBookingId(bookingId);
      await videoSessionService.claimExpiredBookingRefund(bookingId);
      toast.success("100% session refund successfully credited to your Bodometer Wallet!");
      loadData();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to claim expired session refund.";
      toast.error(msg);
    } finally {
      setClaimingRefundBookingId(null);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirmDisconnect = async () => {
    if (!disconnectModal) return;
    try {
      setDisconnecting(true);
      await videoSessionService.endSession(disconnectModal.videoSessionId);
      toast.success("Call session disconnected.");
      setActiveSessions((prev) => ({
        ...prev,
        [disconnectModal.bookingId]: null,
      }));
      setDisconnectModal(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to disconnect call.";
      toast.error(msg);
    } finally {
      setDisconnecting(false);
    }
  };

  const getRefundPreview = (booking: BookingResponseData) => {
    const isStartWindowExpired = Date.now() > new Date(booking.startTime).getTime() + 10 * 60 * 1000;
    if (isStartWindowExpired) {
      return {
        pct: 100,
        amount: booking.price,
        text: `Start window expired (Trainer did not take session) — 100% Instant Wallet Credit (Rs.${booking.price})`,
      };
    }
    const hours = (new Date(booking.startTime).getTime() - Date.now()) / (3600 * 1000);
    if (hours >= 24) {
      return { pct: 100, amount: booking.price, text: `More than 24h notice — 100% Instant Wallet Credit (Rs.${booking.price})` };
    } else if (hours >= 6) {
      const half = booking.price * 0.5;
      return { pct: 50, amount: half, text: `6 to 24h notice — 50% Instant Wallet Credit (Rs.${half})` };
    } else {
      return { pct: 0, amount: 0, text: "Less than 6h notice — 0% Refund (No Credit)" };
    }
  };

  const handleConfirmUserCancel = async () => {
    if (!selectedForCancel) return;
    try {
      setCancelling(true);
      const res = await clientBookingService.cancelBooking(selectedForCancel.id, cancelReason || "User requested cancellation");
      toast.success(`Booking cancelled. ${res.cancellation.refundPercentage}% (Rs.${res.cancellation.refundAmount}) credited to your Wallet!`);
      setSelectedForCancel(null);
      setCancelReason("");
      loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to cancel booking.";
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const executeRespondToReschedule = async () => {
    if (!confirmModal) return;
    const { request, action } = confirmModal;
    const accept = action === "ACCEPT";

    try {
      setResponding(true);
      await clientBookingService.respondToRescheduleRequest(request.id, accept);
      toast.success(accept ? "Reschedule accepted! New time confirmed." : "Reschedule declined. Original time kept.");
      setConfirmModal(null);
      setPendingRequests((prev) => prev.filter((p) => p.request.id !== request.id));
      loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to process reschedule response.";
      toast.error(msg);
    } finally {
      setResponding(false);
    }
  };

  // Compile all bookings including any completed video sessions
  const allBookings: BookingResponseData[] = [...bookings];
  sessionHistory.forEach((vs) => {
    if (
      (vs.status === "COMPLETED" || vs.status === "INCOMPLETE" || vs.status === "EXPIRED") &&
      !allBookings.some((b) => String(b.id) === String(vs.bookingId))
    ) {
      allBookings.push({
        id: vs.bookingId || vs.id,
        bookingNumber: vs.bookingNumber || `CALL-${vs.id.slice(-6).toUpperCase()}`,
        trainerId: vs.trainerId,
        userId: vs.userId,
        serviceId: "coaching",
        bookingDate:
          typeof vs.scheduledStartTime === "string"
            ? vs.scheduledStartTime
            : new Date(vs.scheduledStartTime).toISOString(),
        startTime:
          typeof vs.scheduledStartTime === "string"
            ? vs.scheduledStartTime
            : new Date(vs.scheduledStartTime).toISOString(),
        endTime:
          typeof vs.scheduledEndTime === "string"
            ? vs.scheduledEndTime
            : new Date(vs.scheduledEndTime).toISOString(),
        bufferEndTime:
          typeof vs.scheduledEndTime === "string"
            ? vs.scheduledEndTime
            : new Date(vs.scheduledEndTime).toISOString(),
        status: vs.status,
        price: vs.sessionPrice || 0,
        trainerName: vs.otherParticipantName,
        trainerEmail: vs.otherParticipantEmail,
        serviceSnapshot: {
          name: vs.serviceName || "1-on-1 Video Coaching",
          durationMinutes: vs.actualDurationMinutes || 60,
        },
      });
    }
  });

  const isBookingCompletedOrEnded = (b: BookingResponseData) => {
    const vs = sessionHistory.find((s) => String(s.bookingId) === String(b.id));
    return (
      b.status.toUpperCase() === "COMPLETED" ||
      b.status.toUpperCase() === "INCOMPLETE" ||
      b.status.toUpperCase() === "EXPIRED" ||
      vs?.status === "COMPLETED" ||
      vs?.status === "INCOMPLETE" ||
      vs?.status === "EXPIRED"
    );
  };

  const getStatusBadge = (b: BookingResponseData, vs?: VideoSession) => {
    if (b.status.toUpperCase() === "EXPIRED" || vs?.status === "EXPIRED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle size={13} /> Missed • Refunded
        </span>
      );
    }
    if (vs?.status === "INCOMPLETE" || b.status.toUpperCase() === "INCOMPLETE") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle size={13} /> Ended Early (&lt; 20m)
        </span>
      );
    }
    if (vs?.status === "COMPLETED" || b.status.toUpperCase() === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 size={13} /> Completed
        </span>
      );
    }
    const isPastStartWindow = Date.now() > new Date(b.startTime).getTime() + 10 * 60 * 1000;
    switch (b.status.toUpperCase()) {
      case "CONFIRMED":
        if (isPastStartWindow && !activeSessions[b.id]) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <AlertTriangle size={13} /> Missed by Trainer
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock size={13} /> Upcoming
          </span>
        );
      case "RESCHEDULE_PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertCircle size={13} /> Reschedule Requested
          </span>
        );
      case "PENDING_PAYMENT":
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertCircle size={13} /> Pending Payment
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle size={13} /> Cancelled
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle size={13} /> Missed • Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            {b.status}
          </span>
        );
    }
  };

  const filterCounts = {
    ALL: allBookings.length,
    CONFIRMED: allBookings.filter(
      (b) => b.status.toUpperCase() === "CONFIRMED" && !isBookingCompletedOrEnded(b),
    ).length,
    COMPLETED: allBookings.filter((b) => isBookingCompletedOrEnded(b)).length,
    RESCHEDULE_PENDING: allBookings.filter(
      (b) => b.status.toUpperCase() === "RESCHEDULE_PENDING",
    ).length,
    CANCELLED: allBookings.filter(
      (b) => b.status.toUpperCase() === "CANCELLED" || b.status.toUpperCase() === "EXPIRED",
    ).length,
  };

  let processedBookings = [...allBookings];

  // 1. Status Filter
  if (statusFilter === "CONFIRMED") {
    processedBookings = processedBookings.filter(
      (b) => b.status.toUpperCase() === "CONFIRMED" && !isBookingCompletedOrEnded(b),
    );
  } else if (statusFilter === "COMPLETED") {
    processedBookings = processedBookings.filter((b) => isBookingCompletedOrEnded(b));
  } else if (statusFilter === "CANCELLED") {
    processedBookings = processedBookings.filter(
      (b) => b.status.toUpperCase() === "CANCELLED" || b.status.toUpperCase() === "EXPIRED",
    );
  } else if (statusFilter !== "ALL") {
    processedBookings = processedBookings.filter(
      (b) => b.status.toUpperCase() === statusFilter,
    );
  }

  // 2. Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    processedBookings = processedBookings.filter(
      (b) =>
        b.bookingNumber.toLowerCase().includes(q) ||
        (b.serviceSnapshot?.name && b.serviceSnapshot.name.toLowerCase().includes(q)) ||
        (b.trainerName && b.trainerName.toLowerCase().includes(q)) ||
        (b.trainerId && b.trainerId.toLowerCase().includes(q)) ||
        String(b.price).includes(q),
    );
  }

  // 3. Sort
  processedBookings.sort((a, b) => {
    let comparison = 0;
    if (sortConfig.field === "bookingDate") {
      comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    } else if (sortConfig.field === "price") {
      comparison = a.price - b.price;
    }
    return sortConfig.order === "asc" ? comparison : -comparison;
  });

  // 4. Pagination
  const totalItems = processedBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedBookings = processedBookings.slice(startIndex, startIndex + pageSize);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-white">
      {/* Header & Wallet Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            <Sparkles className="text-purple-400" size={28} />
            My Booked Sessions
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            View and manage all your scheduled coaching sessions with trainers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Wallet Balance Card -> Links to /wallet */}
          <a
            href="/wallet"
            className="bg-gradient-to-r from-purple-900/50 via-purple-900/30 to-purple-800/20 border border-purple-500/30 hover:border-purple-400/60 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg transition group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 text-purple-300 flex items-center justify-center transition">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] text-purple-300/80 font-bold uppercase tracking-wider flex items-center gap-1">
                Wallet Balance <ArrowUpRight size={10} className="text-purple-400 opacity-60 group-hover:opacity-100 transition" />
              </p>
              <p className="text-base font-extrabold text-white">Rs.{wallet?.balance || 0}</p>
            </div>
          </a>

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Pending Trainer Reschedule Request Banners */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={16} /> Reschedule Proposals Needing Your Response ({pendingRequests.length})
          </h2>

          {pendingRequests.map(({ request, booking }) => {
            const oldStart = new Date(request.oldStartTime);
            const newStart = new Date(request.proposedStartTime);
            const newEnd = new Date(request.proposedEndTime);

            const oldDateStr = oldStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            const oldTimeStr = oldStart.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            const newDateStr = newStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            const newTimeStr = `${newStart.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${newEnd.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

            return (
              <div
                key={request.id}
                className="bg-gradient-to-r from-amber-950/70 via-[#1A1005] to-[#0A0500] border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-amber-200">
                      Trainer Proposed New Session Time
                    </h3>
                    <p className="text-xs text-amber-300/70">
                      Booking #{booking.bookingNumber} &bull; {booking.serviceSnapshot?.name || "Coaching Session"}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
                    ACTION REQUIRED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                    <p className="text-white/40 font-semibold uppercase text-[10px]">Original Time (Still Active)</p>
                    <p className="text-white font-bold">{oldDateStr} at {oldTimeStr}</p>
                  </div>

                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 space-y-1">
                    <p className="text-amber-300 font-semibold uppercase text-[10px]">Trainer Proposed New Time</p>
                    <p className="text-amber-100 font-bold">{newDateStr} ({newTimeStr})</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    onClick={() => setConfirmModal({ request, booking, action: "DECLINE" })}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-xs font-bold transition border border-white/10 hover:border-rose-500/30 cursor-pointer"
                  >
                    Decline & Keep Original Time
                  </button>
                  <button
                    onClick={() => setConfirmModal({ request, booking, action: "ACCEPT" })}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    Accept Proposed New Time
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter, Search & Sort Controls Bar */}
      <div className="bg-[#03000D]/80 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
            {[
              { id: "ALL", label: `All (${filterCounts.ALL})` },
              { id: "CONFIRMED", label: `Upcoming (${filterCounts.CONFIRMED})` },
              { id: "COMPLETED", label: `Completed (${filterCounts.COMPLETED})` },
              { id: "RESCHEDULE_PENDING", label: `Reschedule (${filterCounts.RESCHEDULE_PENDING})` },
              { id: "CANCELLED", label: `Cancelled (${filterCounts.CANCELLED})` },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { setStatusFilter(id); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === id ? "bg-purple-600 text-white shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <SearchBar
              value={searchQuery}
              onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
              placeholder="Search by booking #, service name..."
            />
          </div>
          <div>
            <SortDropdown<"bookingDate" | "price">
              options={[
                { label: "Session Date", value: "bookingDate" },
                { label: "Session Price", value: "price" },
              ]}
              value={sortConfig}
              onSortChange={(newSort) => setSortConfig(newSort)}
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center text-purple-300 animate-pulse">Loading your booked sessions...</div>
      ) : paginatedBookings.length === 0 ? (
        <div className="p-12 text-center bg-[#03000D]/80 border border-white/10 rounded-3xl space-y-3">
          <Calendar size={36} className="text-white/20 mx-auto" />
          <p className="text-xs font-semibold text-white/60">No booking sessions found matching criteria.</p>
          <a
            href="/trainers"
            className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition shadow-lg shadow-purple-600/30 mt-2"
          >
            Browse Trainers & Book Session
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedBookings.map((b) => {
            const vs = sessionHistory.find((s) => s.bookingId === b.id);
            const isCompletedOrEnded = isBookingCompletedOrEnded(b);
            const isConfirmed = b.status.toUpperCase() === "CONFIRMED" && !isCompletedOrEnded;
            const start = new Date(b.startTime);
            const end = new Date(b.endTime);
            const dateStr = start.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
            const startMs = start.getTime();
            const endMs = end.getTime();
            const deadlineMs = startMs + 10 * 60 * 1000;
            const isBeforeStart = nowMs < startMs;
            const isWithinStartWindow = nowMs >= startMs && nowMs <= deadlineMs;
            const isPastStartWindow = nowMs > deadlineMs;
            const isPastSession = nowMs > endMs;
            const trainerDisplayName = b.trainerName || vs?.otherParticipantName || "Assigned Trainer";
            const trainerDisplayEmail = b.trainerEmail || vs?.otherParticipantEmail;

            return (
              <div
                key={b.id}
                className={`bg-[#03000D]/80 border ${
                  isCompletedOrEnded
                    ? "border-emerald-500/25 hover:border-emerald-500/40"
                    : "border-white/10 hover:border-purple-500/30"
                } rounded-3xl p-6 space-y-4 transition shadow-lg`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">
                        {b.serviceSnapshot?.name || "1-on-1 Coaching Session"}
                      </h3>
                      {getStatusBadge(b, vs)}
                    </div>
                    <p className="text-xs text-white/40 mt-1 font-mono">
                      Booking #{b.bookingNumber} &bull; {b.serviceSnapshot?.durationMinutes || 60} minutes
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <p className="text-base font-extrabold text-white">Rs.{b.price}</p>
                  </div>
                </div>

                {/* Trainer Information Row */}
                <div className="flex items-center gap-2 text-xs bg-white/[0.02] px-3.5 py-2 rounded-xl border border-white/5">
                  <User size={14} className="text-purple-400 shrink-0" />
                  <span className="text-white/60">Coach / Trainer:</span>
                  <span className="font-bold text-white">{trainerDisplayName}</span>
                  {trainerDisplayEmail && (
                    <span className="text-white/40 text-[11px] font-mono">({trainerDisplayEmail})</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    <Calendar size={18} className="text-purple-400" />
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-semibold">Date</p>
                      <p className="text-white font-bold">{dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    <Clock size={18} className="text-purple-400" />
                    <div>
                      <p className="text-white/40 text-[10px] uppercase font-semibold">Time Slot</p>
                      <p className="text-white font-bold">{timeStr}</p>
                    </div>
                  </div>
                </div>

                {/* Completed / Ended / Expired Session Display */}
                {isCompletedOrEnded && (
                  <div className="pt-1 space-y-3">
                    {b.status.toUpperCase() === "EXPIRED" || vs?.status === "EXPIRED" ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-emerald-300">Session Missed by Trainer • 100% Refund Credited</p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Refund Completed
                              </span>
                            </div>
                            <p className="text-xs text-white/70 mt-0.5">
                              The trainer did not take the call within the scheduled start window. ₹{b.price} was credited in full to your Bodometer Wallet.
                            </p>
                          </div>
                        </div>

                        <a
                          href="/trainers"
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 hover:border-purple-500/40 transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                        >
                          <Sparkles size={13} className="text-purple-400" /> Book Another Session
                        </a>
                      </div>
                    ) : vs?.status === "INCOMPLETE" || b.status.toUpperCase() === "INCOMPLETE" ? (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                              <AlertTriangle size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-amber-300">
                                  Session Ended Early ({vs?.actualDurationMinutes ?? 0} mins conducted)
                                </p>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  &lt; 20 Mins Policy
                                </span>
                              </div>
                              <p className="text-xs text-white/70 mt-0.5">
                                Because the session was under 20 minutes, you are entitled to a full refund of ₹{b.price} to your Bodometer Wallet.
                              </p>
                            </div>
                          </div>
                          {vs?.refundStatus === "COMPLETED" ? (
                            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                              <CheckCircle2 size={14} /> ₹{b.price} Refund Credited
                            </span>
                          ) : vs ? (
                            <button
                              onClick={() => handleRequestSessionRefund(vs.id)}
                              disabled={requestingRefundId === vs.id}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                            >
                              {requestingRefundId === vs.id ? "Crediting Wallet…" : `Claim ₹${b.price} Refund`}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-emerald-300">Coaching Session Successfully Completed</p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Verified
                              </span>
                            </div>
                            <p className="text-xs text-emerald-400/80 mt-0.5">
                              Video Call Conducted: <strong>{vs?.actualDurationMinutes ?? b.serviceSnapshot?.durationMinutes ?? 60} mins</strong>
                              {vs?.actualEndTime && (
                                <span className="text-white/40 ml-2">
                                  &bull; Concluded at {new Date(vs.actualEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <a
                          href="/trainers"
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 hover:border-purple-500/40 transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                        >
                          <Sparkles size={13} className="text-purple-400" /> Book Again
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Expired Start Window - Trainer did not take call banner */}
                {isConfirmed && isPastStartWindow && !activeSessions[b.id] && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-amber-300">
                              Session Expired • Trainer Did Not Start Call
                            </p>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              100% Refund Guarantee
                            </span>
                          </div>
                          <p className="text-xs text-white/70 mt-0.5">
                            The 10-minute start window elapsed without the trainer starting the session. You can claim an instant 100% refund of ₹{b.price} directly to your Bodometer Wallet.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleClaimExpiredRefund(b.id)}
                        disabled={claimingRefundBookingId === b.id}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Wallet size={14} />
                        {claimingRefundBookingId === b.id ? "Crediting Wallet…" : `Claim ₹${b.price} Full Refund`}
                      </button>
                    </div>
                  </div>
                )}

                {isConfirmed && (
                  <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-white/10">
                    <span className="text-[11px] text-white/50 flex items-center gap-1.5">
                      <HelpCircle size={14} className="text-purple-400" /> Cancellation refunds credit directly to your Bodometer Wallet
                    </span>

                    <div className="flex items-center gap-2">
                      {activeSessions[b.id] ? (
                        // Active VideoSession exists → show Remaining Time, Rejoin and Disconnect buttons
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                            <Clock size={12} />
                            {(() => {
                              const diffMs = endMs - nowMs;
                              if (diffMs <= 0) return "Ending…";
                              const mins = Math.max(0, Math.ceil(diffMs / 60000));
                              return `${mins}m left`;
                            })()}
                          </span>
                          <a
                            href={USER_UI_ROUTES.VIDEO_CALL_SESSION.replace(
                              ":videoSessionId",
                              activeSessions[b.id]!,
                            )}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition border border-emerald-500/40 flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                          >
                            <Video size={13} /> Rejoin Call
                          </a>
                          <button
                            onClick={() =>
                              setDisconnectModal({
                                bookingId: b.id,
                                videoSessionId: activeSessions[b.id]!,
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            <PhoneOff size={13} /> Disconnect
                          </button>
                        </div>
                      ) : isBeforeStart ? (
                        <span className="px-3 py-1.5 rounded-xl bg-white/5 text-white/40 font-semibold text-xs border border-white/10 flex items-center gap-1.5 cursor-not-allowed">
                          <Clock size={13} /> Starts at {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      ) : isPastSession || isPastStartWindow ? (
                        <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 font-semibold text-xs border border-rose-500/20 flex items-center gap-1.5">
                          <XCircle size={13} /> {isPastSession ? "Session Time Expired" : "Start Window Expired"}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                          <Video size={13} /> Waiting for trainer to call…
                        </span>
                      )}

                      {!isPastStartWindow && !activeSessions[b.id] && (
                        <button
                          onClick={() => setSelectedForCancel(b)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle size={13} /> Cancel Session
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="pt-4 border-t border-white/10 bg-[#03000D]/80 p-4 rounded-2xl">
              <Pagination
                currentPage={validCurrentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }}
              />
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Reschedule Response */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A051D] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="text-amber-400" size={20} />
              Confirm {confirmModal.action === "ACCEPT" ? "Accepting" : "Declining"} Reschedule
            </h3>

            <p className="text-xs text-white/70 leading-relaxed">
              {confirmModal.action === "ACCEPT"
                ? `Are you sure you want to accept the trainer's proposed new time for Booking #${confirmModal.booking.bookingNumber}? The session time will update atomically.`
                : `Are you sure you want to decline the proposed time? Booking #${confirmModal.booking.bookingNumber} will remain active at its original scheduled time.`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={executeRespondToReschedule}
                disabled={responding}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white transition cursor-pointer shadow-lg ${
                  confirmModal.action === "ACCEPT" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30" : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
                }`}
              >
                {responding ? "Processing..." : confirmModal.action === "ACCEPT" ? "Yes, Accept New Time" : "Yes, Decline Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {selectedForCancel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A051D] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="text-rose-400" size={20} />
                Cancel Session #{selectedForCancel.bookingNumber}
              </h3>
              <button
                onClick={() => setSelectedForCancel(null)}
                className="text-white/40 hover:text-white transition cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-xs space-y-1">
              <p className="text-purple-300 font-bold">Policy Refund Preview</p>
              <p className="text-purple-200/80">{getRefundPreview(selectedForCancel).text}</p>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/50 block mb-1">Reason for Cancellation (Optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g. Schedule conflict..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedForCancel(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmUserCancel}
                disabled={cancelling}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-rose-600/30"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Disconnecting Video Call */}
      {disconnectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A051D] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneOff className="text-rose-400" size={20} />
              Disconnect Video Call?
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to disconnect this active video session? This will end the call for both participants.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDisconnectModal(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white transition cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmDisconnect}
                disabled={disconnecting}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition cursor-pointer disabled:opacity-50"
              >
                {disconnecting ? "Disconnecting..." : "Yes, Disconnect Call"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMyBookingsPage;
