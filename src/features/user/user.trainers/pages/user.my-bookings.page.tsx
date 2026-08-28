import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  ArrowDownLeft,
  Video,
} from "lucide-react";
import {
  clientBookingService,
  BookingResponseData,
  BookingRescheduleRequestDetails,
} from "@/modules/booking/service/client-booking.service";
import { walletService, UserWalletData, WalletTransactionData } from "@/modules/wallet/service/wallet.service";
import SearchBar from "@/features/controls/search/search";
import { USER_UI_ROUTES } from "@/constants/constant-routes/ui-routes/user.ui-constant.routes";
import SortDropdown, { SortConfig } from "@/features/controls/sort/sort";
import Pagination from "@/features/controls/pagination/pagination";
import { toast } from "sonner";

export const UserMyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponseData[]>([]);
  const [pendingRequests, setPendingRequests] = useState<{ request: BookingRescheduleRequestDetails; booking: BookingResponseData }[]>([]);
  const [wallet, setWallet] = useState<UserWalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const loadData = () => {
    setLoading(true);
    Promise.all([
      clientBookingService.getUserBookings(),
      clientBookingService.getUserPendingRescheduleRequests(),
      walletService.getWalletBalance().catch(() => null),
      walletService.getWalletTransactions().catch(() => []),
    ])
      .then(([bookingsData, requestsData, walletData, txsData]) => {
        setBookings(bookingsData);
        setPendingRequests(requestsData);
        if (walletData) setWallet(walletData);
        if (txsData) setTransactions(txsData);
      })
      .catch(() => toast.error("Failed to load your booking sessions."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRefundPreview = (booking: BookingResponseData) => {
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

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={13} /> Confirmed
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
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            {status}
          </span>
        );
    }
  };

  // Filter, Search, Sort calculation for Bookings
  let processedBookings = [...bookings];

  // 1. Status Filter
  if (statusFilter !== "ALL") {
    processedBookings = processedBookings.filter((b) => b.status.toUpperCase() === statusFilter);
  }

  // 2. Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    processedBookings = processedBookings.filter(
      (b) =>
        b.bookingNumber.toLowerCase().includes(q) ||
        (b.serviceSnapshot?.name && b.serviceSnapshot.name.toLowerCase().includes(q)) ||
        (b.trainerId && b.trainerId.toLowerCase().includes(q)) ||
        String(b.price).includes(q)
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
            {["ALL", "CONFIRMED", "RESCHEDULE_PENDING", "COMPLETED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st ? "bg-purple-600 text-white shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                {st === "ALL" ? `All (${bookings.length})` : st.replace("_", " ")}
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
            const start = new Date(b.startTime);
            const end = new Date(b.endTime);
            const dateStr = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
            const timeStr = `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
            const nowMs = Date.now();
            const startMs = start.getTime();
            const endMs = end.getTime();
            const isBeforeStart = nowMs < startMs;
            const isWithinWindow = nowMs >= startMs && nowMs <= endMs + 10 * 60 * 1000;
            const isPastSession = nowMs > endMs + 10 * 60 * 1000;
            const isConfirmed = b.status.toUpperCase() === "CONFIRMED";

            return (
              <div
                key={b.id}
                className="bg-[#03000D]/80 border border-white/10 hover:border-purple-500/30 rounded-3xl p-6 space-y-4 transition shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">
                        {b.serviceSnapshot?.name || "1-on-1 Coaching Session"}
                      </h3>
                      {getStatusBadge(b.status)}
                    </div>
                    <p className="text-xs text-white/40 mt-1 font-mono">
                      Booking #{b.bookingNumber} &bull; {b.serviceSnapshot?.durationMinutes || 60} minutes
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <p className="text-base font-extrabold text-white">Rs.{b.price}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">100% Session Refund Guarantee</p>
                  </div>
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

                {isConfirmed && (
                  <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-white/10">
                    <span className="text-[11px] text-white/50 flex items-center gap-1.5">
                      <HelpCircle size={14} className="text-purple-400" /> Cancellation refunds credit directly to your Bodometer Wallet
                    </span>

                    <div className="flex items-center gap-2">
                      {isWithinWindow ? (
                        <Link
                          to={USER_UI_ROUTES.USER_VIDEO_CALL.replace(":bookingId", b.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition flex items-center gap-1.5 animate-pulse shadow-lg shadow-emerald-900/30"
                        >
                          <Video size={14} /> Join Video Call (Live)
                        </Link>
                      ) : isBeforeStart ? (
                        <span className="px-3.5 py-2 rounded-xl bg-white/5 text-white/50 text-xs font-semibold border border-white/10 flex items-center gap-1.5 cursor-not-allowed">
                          <Clock size={14} className="text-purple-400" /> Starts at {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      ) : (
                        <span className="px-3.5 py-2 rounded-xl bg-zinc-800/80 text-zinc-400 text-xs font-semibold border border-zinc-700/60 flex items-center gap-1.5">
                          Session Expired
                        </span>
                      )}

                      {!isPastSession && (
                        <button
                          onClick={() => setSelectedForCancel(b)}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition cursor-pointer"
                        >
                          Cancel Session
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
    </div>
  );
};

export default UserMyBookingsPage;
