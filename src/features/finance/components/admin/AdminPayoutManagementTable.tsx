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
  Eye,
  Building2,
  FileText,
  Copy,
  Check,
  Zap,
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
  // Modal states
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    payoutId: string | null;
    reason: string;
    submitting: boolean;
  }>({ isOpen: false, payoutId: null, reason: "", submitting: false });

  const [completeModal, setCompleteModal] = useState<{
    isOpen: boolean;
    payout: PayoutRequest | null;
    bankTransferReference: string;
    transferredAt: string;
    adminNote: string;
    payoutMethod: string;
    submitting: boolean;
  }>({
    isOpen: false,
    payout: null,
    bankTransferReference: "",
    transferredAt: new Date().toISOString().slice(0, 16),
    adminNote: "",
    payoutMethod: "MANUAL_BANK_TRANSFER",
    submitting: false,
  });

  const [stripePayModal, setStripePayModal] = useState<{
    isOpen: boolean;
    payout: PayoutRequest | null;
    submitting: boolean;
  }>({ isOpen: false, payout: null, submitting: false });

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    payout: PayoutRequest | null;
  }>({ isOpen: false, payout: null });

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getPayoutStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={12} />
            Pending Review
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
            Processing Transfer
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
      toast.success("Payout request approved! Use \"Start Processing\" to continue.");
      onActionComplete();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to approve payout");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStripePay = async () => {
    if (!stripePayModal.payout) return;
    try {
      setStripePayModal((prev) => ({ ...prev, submitting: true }));
      const result = await financeService.stripePayPayout(stripePayModal.payout.id);
      toast.success(
        `Payout paid via Stripe! Reference: ${result.providerPayoutId ?? result.bankTransferReference ?? "—"}`,
        { duration: 6000 },
      );
      setStripePayModal({ isOpen: false, payout: null, submitting: false });
      onActionComplete();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Stripe payout failed. Try manual bank transfer.");
      setStripePayModal((prev) => ({ ...prev, submitting: false }));
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
    if (!completeModal.payout || !completeModal.bankTransferReference.trim()) {
      toast.error("Bank transfer reference / UTR is required");
      return;
    }

    try {
      setCompleteModal((prev) => ({ ...prev, submitting: true }));
      await financeService.completePayout(completeModal.payout.id, {
        bankTransferReference: completeModal.bankTransferReference.trim(),
        transferredAt: completeModal.transferredAt,
        adminNote: completeModal.adminNote.trim() || undefined,
        payoutMethod: completeModal.payoutMethod,
      });
      toast.success("Payout confirmed as PAID and bank transfer recorded!");
      setCompleteModal({
        isOpen: false,
        payout: null,
        bankTransferReference: "",
        transferredAt: new Date().toISOString().slice(0, 16),
        adminNote: "",
        payoutMethod: "MANUAL_BANK_TRANSFER",
        submitting: false,
      });
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
    { label: "Failed", value: "FAILED" },
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
            Review, approve, and execute trainer manual bank fund transfers
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
              <th className="py-3.5 px-6">Trainer</th>
              <th className="py-3.5 px-6">Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Transfer / Reference</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500">
                  <Loader2 size={20} className="animate-spin inline mr-2" />
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
              payouts.map((p) => {
                const ref = p.bankTransferReference || p.providerPayoutId;
                return (
                  <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-6 text-neutral-400 whitespace-nowrap">
                      {format(new Date(p.requestedAt), "MMM d, yyyy • h:mm a")}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-white">Trainer</div>
                      <div className="font-mono text-[11px] text-neutral-400 truncate max-w-[120px]">
                        {p.trainerId}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-white whitespace-nowrap">
                      ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-6">
                      {getPayoutStatusBadge(p.status)}
                    </td>
                    <td className="py-3.5 px-6 text-neutral-400">
                      {p.rejectionReason && (
                        <span className="text-rose-400 block truncate max-w-[180px]">
                          Reason: {p.rejectionReason}
                        </span>
                      )}
                      {ref && (
                        p.payoutMethod === "STRIPE" ? (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-violet-400">
                            <Zap size={10} />
                            {ref}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-emerald-400 block">
                            UTR: {ref}
                          </span>
                        )
                      )}
                      {!p.rejectionReason && !ref && (
                        <span className="text-neutral-500">
                          {p.bankDetails?.accountNumber
                            ? `A/C: ••••${p.bankDetails.accountNumber.slice(-4)}`
                            : "—"}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      {actionLoadingId === p.id ? (
                        <Loader2 size={16} className="animate-spin inline text-neutral-400" />
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailModal({ isOpen: true, payout: p })}
                            title="View Details"
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>

                          {p.status === "PENDING" && (
                            <>
                              {/* Primary: Approve & Pay via Stripe */}
                              <button
                                onClick={() =>
                                  setStripePayModal({
                                    isOpen: true,
                                    payout: p,
                                    submitting: false,
                                  })
                                }
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-xs font-medium border border-violet-500/20 transition-colors cursor-pointer"
                                title="Approve and pay immediately via Stripe"
                              >
                                <Zap size={12} />
                                <span>Stripe Pay</span>
                              </button>
                              {/* Secondary: Manual approve only */}
                              <button
                                onClick={() => handleApprove(p.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/20 transition-colors cursor-pointer"
                                title="Approve only — continue with manual bank transfer"
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
                              <span>Start Processing</span>
                              <ArrowRight size={12} />
                            </button>
                          )}

                          {p.status === "PROCESSING" && (
                            <button
                              onClick={() =>
                                setCompleteModal({
                                  isOpen: true,
                                  payout: p,
                                  bankTransferReference: "",
                                  transferredAt: new Date().toISOString().slice(0, 16),
                                  adminNote: "",
                                  payoutMethod: "MANUAL_BANK_TRANSFER",
                                  submitting: false,
                                })
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
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
                className="text-neutral-400 hover:text-white cursor-pointer"
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
                  placeholder="e.g. Bank account details invalid, please update in profile."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModal({ isOpen: false, payoutId: null, reason: "", submitting: false })}
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectModal.reason.trim() || rejectModal.submitting}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer"
                >
                  {rejectModal.submitting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete / Confirm Bank Transfer Modal */}
      {completeModal.isOpen && completeModal.payout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Building2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Record Bank Transfer</h3>
                  <p className="text-[11px] text-neutral-400">Confirm offline manual bank transfer</p>
                </div>
              </div>
              <button
                onClick={() => setCompleteModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Payout Details / Destination Card */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3.5 mb-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Payout Amount</span>
                <span className="text-sm font-bold text-emerald-400">
                  ₹{completeModal.payout.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Trainer ID</span>
                <span className="font-mono text-[11px] text-neutral-300">
                  {completeModal.payout.trainerId}
                </span>
              </div>

              {/* Bank Details if present */}
              {completeModal.payout.bankDetails && (
                <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    Beneficiary Bank Details
                  </div>
                  {completeModal.payout.bankDetails.accountHolderName && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">A/C Name:</span>
                      <span className="text-white font-medium">
                        {completeModal.payout.bankDetails.accountHolderName}
                      </span>
                    </div>
                  )}
                  {completeModal.payout.bankDetails.accountNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">A/C Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-white font-bold">
                          {completeModal.payout.bankDetails.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              completeModal.payout?.bankDetails?.accountNumber || "",
                              "Account Number",
                            )
                          }
                          className="text-neutral-400 hover:text-white"
                        >
                          {copiedField === "Account Number" ? (
                            <Check size={12} className="text-emerald-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {completeModal.payout.bankDetails.ifscCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">IFSC Code:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-white">
                          {completeModal.payout.bankDetails.ifscCode}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              completeModal.payout?.bankDetails?.ifscCode || "",
                              "IFSC Code",
                            )
                          }
                          className="text-neutral-400 hover:text-white"
                        >
                          {copiedField === "IFSC Code" ? (
                            <Check size={12} className="text-emerald-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {completeModal.payout.bankDetails.bankName && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Bank Name:</span>
                      <span className="text-neutral-300">
                        {completeModal.payout.bankDetails.bankName}
                      </span>
                    </div>
                  )}
                  {completeModal.payout.bankDetails.upiId && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">UPI ID:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-emerald-300">
                          {completeModal.payout.bankDetails.upiId}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              completeModal.payout?.bankDetails?.upiId || "",
                              "UPI ID",
                            )
                          }
                          className="text-neutral-400 hover:text-white"
                        >
                          {copiedField === "UPI ID" ? (
                            <Check size={12} className="text-emerald-400" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={submitComplete} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Bank Transfer Reference / UTR Number *
                </label>
                <input
                  type="text"
                  required
                  value={completeModal.bankTransferReference}
                  onChange={(e) =>
                    setCompleteModal((prev) => ({
                      ...prev,
                      bankTransferReference: e.target.value,
                    }))
                  }
                  placeholder="e.g. UTR1234567890 or IMPS98765432"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Transfer Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={completeModal.transferredAt}
                  onChange={(e) =>
                    setCompleteModal((prev) => ({
                      ...prev,
                      transferredAt: e.target.value,
                    }))
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Admin Note (Optional)
                </label>
                <input
                  type="text"
                  value={completeModal.adminNote}
                  onChange={(e) =>
                    setCompleteModal((prev) => ({
                      ...prev,
                      adminNote: e.target.value,
                    }))
                  }
                  placeholder="e.g. Transferred via Corporate NetBanking"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModal((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!completeModal.bankTransferReference.trim() || completeModal.submitting}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-neutral-950 disabled:opacity-50 cursor-pointer"
                >
                  {completeModal.submitting ? "Confirming..." : "Confirm & Mark Paid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {/* ─── Stripe Pay Confirmation Modal ─── */}
      {stripePayModal.isOpen && stripePayModal.payout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-violet-500/30 shadow-2xl shadow-violet-500/10 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Approve & Pay via Stripe</h3>
                  <p className="text-[11px] text-neutral-400">Instant automated disbursement</p>
                </div>
              </div>
              <button
                onClick={() => setStripePayModal({ isOpen: false, payout: null, submitting: false })}
                disabled={stripePayModal.submitting}
                className="text-neutral-400 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Payout summary */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 mb-5 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Amount to Transfer</span>
                <span className="text-lg font-bold text-violet-400">
                  ₹{stripePayModal.payout.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Currency</span>
                <span className="text-white font-medium">{stripePayModal.payout.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Method</span>
                <span className="flex items-center gap-1 text-violet-300 font-medium">
                  <Zap size={11} />
                  Stripe Automated Payout
                </span>
              </div>
              {stripePayModal.payout.bankDetails?.accountNumber && (
                <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80">
                  <span className="text-neutral-400">A/C on file</span>
                  <span className="font-mono text-white">
                    ••••{stripePayModal.payout.bankDetails.accountNumber.slice(-4)}
                  </span>
                </div>
              )}
            </div>

            {/* Info banner */}
            <div className="flex gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-5 text-xs text-amber-300">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <p>
                This will immediately approve the payout and initiate a Stripe disbursement.
                The payout will be marked as <strong>PAID</strong> and cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setStripePayModal({ isOpen: false, payout: null, submitting: false })}
                disabled={stripePayModal.submitting}
                className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStripePay}
                disabled={stripePayModal.submitting}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white disabled:opacity-60 cursor-pointer transition-colors"
              >
                {stripePayModal.submitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={13} />
                    Confirm & Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {detailModal.isOpen && detailModal.payout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Payout Request Details</h3>
              </div>
              <button
                onClick={() => setDetailModal({ isOpen: false, payout: null })}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <span className="text-neutral-400">Status</span>
                <span>{getPayoutStatusBadge(detailModal.payout.status)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/80">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Payout Amount</span>
                  <span className="text-base font-bold text-white">
                    ₹{detailModal.payout.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Currency</span>
                  <span className="text-white font-medium">{detailModal.payout.currency}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Payout Method</span>
                  {detailModal.payout.payoutMethod === "STRIPE" ? (
                    <span className="flex items-center gap-1 text-violet-400 font-semibold">
                      <Zap size={11} />
                      Stripe Automated Payout
                    </span>
                  ) : (
                    <span className="text-neutral-300 font-medium">
                      {detailModal.payout.payoutMethod || "MANUAL_BANK_TRANSFER"}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Payout ID</span>
                  <span className="font-mono text-[11px] text-neutral-400 truncate block">
                    {detailModal.payout.id}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Reference / Stripe Payout ID */}
              {(detailModal.payout.bankTransferReference || detailModal.payout.providerPayoutId) && (
                <div className={`p-3 rounded-xl ${
                  detailModal.payout.payoutMethod === "STRIPE"
                    ? "bg-violet-500/5 border border-violet-500/20"
                    : "bg-emerald-500/5 border border-emerald-500/20"
                }`}>
                  <span className={`font-medium block mb-1.5 flex items-center gap-1.5 ${
                    detailModal.payout.payoutMethod === "STRIPE" ? "text-violet-400" : "text-emerald-400"
                  }`}>
                    {detailModal.payout.payoutMethod === "STRIPE" ? (
                      <><Zap size={12} /> Stripe Payout ID</>
                    ) : (
                      "Bank Transfer Reference / UTR"
                    )}
                  </span>
                  <span className="font-mono text-sm text-white font-bold break-all">
                    {detailModal.payout.bankTransferReference || detailModal.payout.providerPayoutId}
                  </span>
                </div>
              )}

              {/* Beneficiary Details */}
              {detailModal.payout.bankDetails && (
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                  <span className="text-neutral-400 font-semibold block text-[11px] uppercase tracking-wider">
                    Trainer Bank Details
                  </span>
                  {detailModal.payout.bankDetails.accountHolderName && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Account Holder:</span>
                      <span className="text-white">{detailModal.payout.bankDetails.accountHolderName}</span>
                    </div>
                  )}
                  {detailModal.payout.bankDetails.accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Account Number:</span>
                      <span className="font-mono text-white">{detailModal.payout.bankDetails.accountNumber}</span>
                    </div>
                  )}
                  {detailModal.payout.bankDetails.ifscCode && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">IFSC Code:</span>
                      <span className="font-mono text-white">{detailModal.payout.bankDetails.ifscCode}</span>
                    </div>
                  )}
                  {detailModal.payout.bankDetails.bankName && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Bank:</span>
                      <span className="text-white">{detailModal.payout.bankDetails.bankName}</span>
                    </div>
                  )}
                  {detailModal.payout.bankDetails.upiId && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">UPI ID:</span>
                      <span className="font-mono text-emerald-400">{detailModal.payout.bankDetails.upiId}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-1.5 p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60 text-[11px] text-neutral-400">
                <div className="flex justify-between">
                  <span>Requested At:</span>
                  <span className="text-neutral-300">
                    {format(new Date(detailModal.payout.requestedAt), "MMM d, yyyy • h:mm a")}
                  </span>
                </div>
                {detailModal.payout.approvedAt && (
                  <div className="flex justify-between">
                    <span>Approved At:</span>
                    <span className="text-neutral-300">
                      {format(new Date(detailModal.payout.approvedAt), "MMM d, yyyy • h:mm a")}
                    </span>
                  </div>
                )}
                {detailModal.payout.processedAt && (
                  <div className="flex justify-between">
                    <span>Processed At:</span>
                    <span className="text-neutral-300">
                      {format(new Date(detailModal.payout.processedAt), "MMM d, yyyy • h:mm a")}
                    </span>
                  </div>
                )}
                {detailModal.payout.completedAt && (
                  <div className="flex justify-between">
                    <span>Paid / Transferred At:</span>
                    <span className="text-emerald-400 font-medium">
                      {format(new Date(detailModal.payout.completedAt), "MMM d, yyyy • h:mm a")}
                    </span>
                  </div>
                )}
                {detailModal.payout.rejectedAt && (
                  <div className="flex justify-between">
                    <span>Rejected At:</span>
                    <span className="text-rose-400 font-medium">
                      {format(new Date(detailModal.payout.rejectedAt), "MMM d, yyyy • h:mm a")}
                    </span>
                  </div>
                )}
                {detailModal.payout.adminNote && (
                  <div className="flex justify-between pt-1 border-t border-neutral-800">
                    <span>Admin Note:</span>
                    <span className="text-neutral-300">{detailModal.payout.adminNote}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-2">
              <button
                type="button"
                onClick={() => setDetailModal({ isOpen: false, payout: null })}
                className="w-full py-2.5 rounded-xl border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
