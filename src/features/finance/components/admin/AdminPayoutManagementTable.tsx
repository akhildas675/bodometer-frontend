import React, { useState } from "react";
import { format } from "date-fns";
import {
  PayoutRequest,
  PayoutStatus,
} from "../../types/finance.types";
import { PaginationMeta } from "@/types/common.types";
import Pagination from "@/components/ui/Pagination";
import { toast } from "sonner";
import { financeService } from "../../services/finance.service";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

interface Props {
  payouts: PayoutRequest[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  statusFilter?: PayoutStatus;
  onStatusFilterChange: (status?: PayoutStatus) => void;
  loading: boolean;
  onActionComplete: () => void;
}

export const AdminPayoutManagementTable: React.FC<Props> = ({
  payouts,
  pagination,
  onPageChange,
  statusFilter,
  onStatusFilterChange,
  loading,
  onActionComplete,
}) => {
  // Modal states for actions requiring input
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    payoutId: string | null;
    reason: string;
    submitting: boolean;
  }>({ isOpen: false, payoutId: null, reason: "", submitting: false });

  const [completeModal, setCompleteModal] = useState<{
    isOpen: boolean;
    payoutId: string | null;
    providerPayoutId: string;
    submitting: boolean;
  }>({ isOpen: false, payoutId: null, providerPayoutId: "", submitting: false });

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const getPayoutStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={12} />
            Pending
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <CheckCircle2 size={12} />
            Approved
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock size={12} className="animate-spin" />
            Processing
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            Paid
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={12} />
            Rejected
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle size={12} />
            Failed
          </span>
        );
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await financeService.approvePayout(id);
      toast.success("Payout request approved!");
      onActionComplete();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to approve payout");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleProcess = async (id: string) => {
    try {
      setActionLoadingId(id);
      await financeService.processPayout(id);
      toast.success("Payout moved to processing status!");
      onActionComplete();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to process payout");
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModal.payoutId || !rejectModal.reason.trim()) return;

    try {
      setRejectModal((prev) => ({ ...prev, submitting: true }));
      await financeService.rejectPayout(rejectModal.payoutId, rejectModal.reason.trim());
      toast.success("Payout request rejected");
      setRejectModal({ isOpen: false, payoutId: null, reason: "", submitting: false });
      onActionComplete();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to reject payout");
      setRejectModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const submitComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeModal.payoutId) return;

    try {
      setCompleteModal((prev) => ({ ...prev, submitting: true }));
      await financeService.completePayout(
        completeModal.payoutId,
        completeModal.providerPayoutId.trim() || undefined,
      );
      toast.success("Payout marked as completed/transferred!");
      setCompleteModal({ isOpen: false, payoutId: null, providerPayoutId: "", submitting: false });
      onActionComplete();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to complete payout");
      setCompleteModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const filterTabs: { label: string; value?: PayoutStatus }[] = [
    { label: "All" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Paid", value: "PAID" },
    { label: "Rejected", value: "REJECTED" },
  ];

  return (
    <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden backdrop-blur-sm mb-8">
      {/* Filter Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 px-6 py-4 gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Payout Requests Queue
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Review, approve, and execute trainer fund withdrawals
          </p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => onStatusFilterChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800/80">
            <tr>
              <th className="py-3.5 px-6">Requested</th>
              <th className="py-3.5 px-6">Trainer ID</th>
              <th className="py-3.5 px-6">Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Audit Info</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500">
                  Loading payout requests...
                </td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500">
                  No payout requests found for the selected filter.
                </td>
              </tr>
            ) : (
              payouts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-6 text-neutral-400 whitespace-nowrap">
                    {format(new Date(p.requestedAt), "MMM d, yyyy • h:mm a")}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[11px] text-neutral-300">
                    {p.trainerId}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-white whitespace-nowrap">
                    ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-6">
                    {getPayoutStatusBadge(p.status)}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-400">
                    {p.rejectionReason && (
                      <span className="text-rose-400 block">Reason: {p.rejectionReason}</span>
                    )}
                    {p.providerPayoutId && (
                      <span className="font-mono text-[11px] text-neutral-500 block">Ref: {p.providerPayoutId}</span>
                    )}
                    {!p.rejectionReason && !p.providerPayoutId && "—"}
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    {actionLoadingId === p.id ? (
                      <Loader2 size={16} className="animate-spin inline text-neutral-400" />
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {p.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/20 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setRejectModal({
                                  isOpen: true,
                                  payoutId: p.id,
                                  reason: "",
                                  submitting: false,
                                })
                              }
                              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {p.status === "APPROVED" && (
                          <button
                            onClick={() => handleProcess(p.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-medium border border-sky-500/20 transition-colors cursor-pointer"
                          >
                            <span>Mark Processing</span>
                            <ArrowRight size={12} />
                          </button>
                        )}

                        {p.status === "PROCESSING" && (
                          <button
                            onClick={() =>
                              setCompleteModal({
                                isOpen: true,
                                payoutId: p.id,
                                providerPayoutId: "",
                                submitting: false,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/20 transition-colors cursor-pointer"
                          >
                            Complete / Paid
                          </button>
                        )}

                        {(p.status === "PAID" || p.status === "REJECTED" || p.status === "FAILED") && (
                          <span className="text-neutral-500 text-xs">—</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-neutral-800 px-6 py-4">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Reject Payout Request</h3>
              <button
                onClick={() => setRejectModal({ isOpen: false, payoutId: null, reason: "", submitting: false })}
                className="text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submitReject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectModal.reason}
                  onChange={(e) =>
                    setRejectModal((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="e.g. Bank account details unverified, please update KYC."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModal({ isOpen: false, payoutId: null, reason: "", submitting: false })}
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectModal.reason.trim() || rejectModal.submitting}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {rejectModal.submitting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {completeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Confirm Payout Completion</h3>
              <button
                onClick={() => setCompleteModal({ isOpen: false, payoutId: null, providerPayoutId: "", submitting: false })}
                className="text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submitComplete} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Bank / IMPS UTR Reference Number (Optional)
                </label>
                <input
                  type="text"
                  value={completeModal.providerPayoutId}
                  onChange={(e) =>
                    setCompleteModal((prev) => ({ ...prev, providerPayoutId: e.target.value }))
                  }
                  placeholder="e.g. UTR1234567890"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCompleteModal({ isOpen: false, payoutId: null, providerPayoutId: "", submitting: false })}
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completeModal.submitting}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-neutral-950 disabled:opacity-50"
                >
                  {completeModal.submitting ? "Completing..." : "Mark as Transferred"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
