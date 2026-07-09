import { bookingService } from "@/modules/booking/service/booking.service";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "@/api/error.helper";
import { UserBookingItem, BookingStatus } from "@/modules/booking/types/booking.interface";
import { PaginationMeta } from "@/interface/common.interface";
import Pagination from "@/features/controls/pagination/pagination";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  ChevronDown,
  XCircle,
  Loader2,
} from "lucide-react";

// ── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  accepted: { label: "Accepted", classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  rejected: { label: "Rejected", classes: "bg-red-500/20 text-red-400 border-red-500/30" },
  cancelled_by_trainer: { label: "Cancelled by Trainer", classes: "bg-white/10 text-white/40 border-white/10" },
  cancelled_by_user: { label: "Cancelled", classes: "bg-white/10 text-white/40 border-white/10" },
  completed: { label: "Completed", classes: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  not_attended: { label: "No Show", classes: "bg-white/10 text-white/30 border-white/10" },
  expired: { label: "Expired", classes: "bg-white/10 text-white/30 border-white/10" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, classes: "bg-white/10 text-white/40 border-white/10" };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ── Cancel modal ──────────────────────────────────────────────────────────────

interface CancelModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  loading: boolean;
}

function CancelModal({ onClose, onSubmit, loading }: CancelModalProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Cancel Booking</h3>
        <p className="text-sm text-white/50">
          Let the trainer know why you are cancelling.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. I have a scheduling conflict."
          className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder:text-white/30"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm transition"
          >
            Keep Booking
          </button>
          <button
            onClick={() => {
              if (!reason.trim()) { toast.error("Please provide a reason."); return; }
              onSubmit(reason.trim());
            }}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Booking card ──────────────────────────────────────────────────────────────

interface BookingCardProps {
  booking: UserBookingItem;
  onCancel: (id: string) => void;
}

function BookingCard({ booking, onCancel }: BookingCardProps) {
  const navigate = useNavigate();
  const start = parseISO(booking.startTime);
  const end = parseISO(booking.endTime);
  const isCancellable = booking.status === "pending" || booking.status === "accepted";
  const isReschedulable = booking.status === "rejected" || booking.status === "cancelled_by_trainer";

  return (
    <div className="rounded-xl border border-white/8 bg-white/4 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/6 transition-colors">
      {/* Trainer info */}
      <div className="flex items-center gap-3">
        {booking.trainer.profilePic ? (
          <img
            src={booking.trainer.profilePic}
            alt={booking.trainer.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center">
            <span className="text-sm font-bold text-indigo-300">
              {booking.trainer.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-white">{booking.trainer.name}</p>
          <p className="text-xs text-white/40">Personal Trainer</p>
        </div>
      </div>

      {/* Session details */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
          <span>{format(start, "EEEE, MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{format(start, "HH:mm")} – {format(end, "HH:mm")}</span>
        </div>
        {booking.cancelReason && (
          <p className="text-xs text-white/30 italic mt-1">
            Reason: {booking.cancelReason}
          </p>
        )}
      </div>

      {/* Status + action */}
      <div className="flex items-center gap-3">
        <StatusBadge status={booking.status} />
        {isCancellable && (
          <button
            onClick={() => onCancel(booking.id)}
            title="Cancel Booking"
            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
        {isReschedulable && (
          <button
            onClick={() => navigate(`/trainers/${booking.trainer.profileId || booking.trainer.id}`)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const UserMyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<UserBookingItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await bookingService.getUserBookings({
        page,
        limit,
        status: statusFilter || undefined,
      });
      if (res.success && res.data) {
        setBookings(res.data as unknown as UserBookingItem[]);
        setPagination(res.pagination);
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelSubmit = async (reason: string) => {
    if (!cancelBookingId) return;
    setCancelLoading(true);
    try {
      await bookingService.cancelBooking(cancelBookingId, { reason });
      toast.success("Booking cancelled.");
      setCancelBookingId(null);
      fetchBookings();
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">My Bookings</h1>
        <p className="text-white/50 mt-1 text-sm">
          Track all your trainer session requests.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled_by_trainer">Cancelled by Trainer</option>
            <option value="cancelled_by_user">Cancelled by Me</option>
            <option value="completed">Completed</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        </div>
        {!isLoading && (
          <span className="text-sm text-white/40">
            {pagination?.totalItems ?? bookings.length} booking{(pagination?.totalItems ?? 1) !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 space-y-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/40 text-base">No bookings found.</p>
            <p className="text-white/25 text-sm mt-1">
              Find a trainer and book your first session.
            </p>
          </div>
        ) : (
          <>
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={(id) => setCancelBookingId(id)}
              />
            ))}
            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={setPage}
                onItemsPerPageChange={() => {}}
              />
            )}
          </>
        )}
      </div>

      {cancelBookingId && (
        <CancelModal
          onClose={() => setCancelBookingId(null)}
          onSubmit={handleCancelSubmit}
          loading={cancelLoading}
        />
      )}
    </div>
  );
};

export default UserMyBookingsPage;
