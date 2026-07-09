import React, { useEffect, useState, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {

  ChevronDown,
  Loader2,
} from "lucide-react";
import { bookingService } from "@/modules/booking/service/booking.service";
import {
  TrainerBookingItem,

} from "@/modules/booking/types/booking.interface";
import { PaginationMeta } from "@/interface/common.interface";
import { parseApiError } from "@/api/error.helper";
import Pagination from "@/features/controls/pagination/pagination";
import DataTable from "@/ui.components/ui/table/data.table";
import type { TableColumn, TableAction } from "@/ui.components/ui/table/table.types";
import ConfirmationModal from "@/ui.components/ui/confirm.dialog";



const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  accepted: { label: "Accepted", classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  rejected: { label: "Rejected", classes: "bg-red-500/20 text-red-400 border-red-500/30" },
  cancelled_by_trainer: { label: "Cancelled", classes: "bg-white/10 text-white/40 border-white/10" },
  cancelled_by_user: { label: "Cancelled by User", classes: "bg-white/10 text-white/40 border-white/10" },
  completed: { label: "Completed", classes: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    classes: "bg-white/10 text-white/40 border-white/10",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}



interface RejectModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  loading: boolean;
}

function RejectModal({ onClose, onSubmit, loading }: RejectModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    onSubmit(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Reject Booking</h3>
        <p className="text-sm text-white/50">
          Provide a reason for the rejection. The user will be notified.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. I am unavailable at this time."
          className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder:text-white/30"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}



const TrainerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<TrainerBookingItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "primary" | "purple";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await bookingService.getTrainerBookings({
        page,
        limit,
        status: statusFilter || undefined,
      });
      if (res.success && res.data) {
        setBookings(res.data as unknown as TrainerBookingItem[]);
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

  const handleAccept = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await bookingService.acceptBooking(bookingId);
      toast.success("Booking accepted.");
      fetchBookings();
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!rejectBookingId) return;
    setRejectLoading(true);
    try {
      await bookingService.rejectBooking(rejectBookingId, { reason });
      toast.success("Booking rejected.");
      setRejectBookingId(null);
      fetchBookings();
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setRejectLoading(false);
    }
  };

  const columns: TableColumn<TrainerBookingItem>[] = [
    {
      key: "user",
      label: "Client",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.user.profilePic ? (
            <img
              src={row.user.profilePic}
              alt={row.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-300">
                {row.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">{row.user.name}</p>
            <p className="text-xs text-white/40">{row.user.email}</p>
            {row.note && (
              <p className="text-xs text-indigo-400 mt-1 max-w-[200px] truncate" title={row.note}>
                Note: {row.note}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) => format(parseISO(row.startTime), "MMM dd, yyyy"),
    },
    {
      key: "time",
      label: "Time",
      render: (row) =>
        `${format(parseISO(row.startTime), "HH:mm")} - ${format(parseISO(row.endTime), "HH:mm")}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const actions: TableAction<TrainerBookingItem>[] = [
    {
      label: "Accept",
      onClick: (row) => setConfirmConfig({
        isOpen: true,
        title: "Accept Booking",
        message: `Are you sure you want to accept this booking request from ${row.user.name}?`,
        variant: "primary",
        onConfirm: () => handleAccept(row.id),
      }),
      variant: "primary",
      visible: (row) => row.status === "pending",
    },
    {
      label: "Reject",
      onClick: (row) => setRejectBookingId(row.id),
      variant: "danger",
      visible: (row) => row.status === "pending",
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bookings</h1>
        <p className="text-white/50 mt-1 text-sm">
          Manage session requests from users.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled_by_user">Cancelled by User</option>
            <option value="completed">Completed</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        </div>
        {bookings.length > 0 && !isLoading && (
          <span className="text-sm text-white/40">
            {pagination?.totalItems ?? bookings.length} booking{(pagination?.totalItems ?? 1) !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/40 text-base">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <DataTable columns={columns} data={bookings} actions={actions} />
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
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectBookingId && (
        <RejectModal
          onClose={() => setRejectBookingId(null)}
          onSubmit={handleRejectSubmit}
          loading={rejectLoading}
        />
      )}

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
      />
    </div>
  );
};

export default TrainerBookings;
