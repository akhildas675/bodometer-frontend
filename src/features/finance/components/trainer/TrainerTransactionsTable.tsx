import React from "react";
import { format } from "date-fns";
import {
  FinancialTransaction,
  PayoutRequest,
  PayoutStatus,
  TransactionStatus,
} from "../../types/finance.types";
import { PaginationMeta } from "@/types/common.types";
import Pagination from "@/components/ui/Pagination";
import {
  Receipt,
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface Props {
  activeTab: "earnings" | "payouts";
  onTabChange: (tab: "earnings" | "payouts") => void;
  transactions: FinancialTransaction[];
  transactionsPagination: PaginationMeta;
  onTransactionsPageChange: (page: number) => void;
  payouts: PayoutRequest[];
  payoutsPagination: PaginationMeta;
  onPayoutsPageChange: (page: number) => void;
  loading: boolean;
}

export const TrainerTransactionsTable: React.FC<Props> = ({
  activeTab,
  onTabChange,
  transactions,
  transactionsPagination,
  onTransactionsPageChange,
  payouts,
  payoutsPagination,
  onPayoutsPageChange,
  loading,
}) => {
  const getTransactionStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            Completed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={12} />
            Pending
          </span>
        );
      case "REVERSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={12} />
            Reversed
          </span>
        );
    }
  };

  const getPayoutStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock size={12} />
              Pending
            </span>
            <span className="block text-[10px] text-neutral-400 mt-0.5">
              Waiting for admin review
            </span>
          </div>
        );
      case "APPROVED":
        return (
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <CheckCircle2 size={12} />
              Approved
            </span>
            <span className="block text-[10px] text-neutral-400 mt-0.5">
              Approved by admin
            </span>
          </div>
        );
      case "PROCESSING":
        return (
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock size={12} className="animate-spin" />
              Processing
            </span>
            <span className="block text-[10px] text-neutral-400 mt-0.5">
              Bank transfer is being processed
            </span>
          </div>
        );
      case "PAID":
        return (
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={12} />
              Paid
            </span>
            <span className="block text-[10px] text-emerald-400/80 mt-0.5">
              Payment transferred
            </span>
          </div>
        );
      case "REJECTED":
        return (
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle size={12} />
              Rejected
            </span>
            <span className="block text-[10px] text-rose-400/80 mt-0.5">
              Request rejected
            </span>
          </div>
        );
      case "FAILED":
        return (
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle size={12} />
              Failed
            </span>
            <span className="block text-[10px] text-red-400/80 mt-0.5">
              Payment failed
            </span>
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden backdrop-blur-sm">
      {/* Table Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 px-6 py-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange("earnings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "earnings"
                ? "bg-neutral-800 text-white border border-neutral-700 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <Receipt size={14} />
            <span>Session Earnings</span>
          </button>
          <button
            onClick={() => onTabChange("payouts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "payouts"
                ? "bg-neutral-800 text-white border border-neutral-700 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <ArrowDownToLine size={14} />
            <span>Payout History</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {activeTab === "earnings" ? (
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800/80">
              <tr>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Session Ref</th>
                <th className="py-3.5 px-6">Service</th>
                <th className="py-3.5 px-6">Gross Amount</th>
                <th className="py-3.5 px-6">Your Share (70%)</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <Loader2 size={20} className="animate-spin inline mr-2" />
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No earning transactions recorded yet. Complete video coaching sessions to start earning!
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-6 text-neutral-400">
                      {format(new Date(t.createdAt), "MMM d, yyyy • h:mm a")}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[11px] text-neutral-300">
                      {t.bookingId ? `Booking #${t.bookingId.slice(-6)}` : t.referenceKey}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-white">
                      {t.serviceName || "1-on-1 Coaching Session"}
                    </td>
                    <td className="py-3.5 px-6 text-neutral-400">
                      ₹{t.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-400">
                      +₹{t.trainerAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-6">
                      {getTransactionStatusBadge(t.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800/80">
              <tr>
                <th className="py-3.5 px-6">Requested Date</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status & Meaning</th>
                <th className="py-3.5 px-6">Paid / Transferred Date</th>
                <th className="py-3.5 px-6">Bank Transfer Reference / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    <Loader2 size={20} className="animate-spin inline mr-2" />
                    Loading payout history...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    No payout requests submitted yet.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => {
                  const ref = p.bankTransferReference || p.providerPayoutId;
                  const datePaid = p.transferredAt || p.completedAt;
                  return (
                    <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3.5 px-6 text-neutral-400">
                        {format(new Date(p.requestedAt), "MMM d, yyyy • h:mm a")}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-white whitespace-nowrap">
                        ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-6">
                        {getPayoutStatusBadge(p.status)}
                      </td>
                      <td className="py-3.5 px-6 text-neutral-400 whitespace-nowrap">
                        {datePaid ? format(new Date(datePaid), "MMM d, yyyy • h:mm a") : "—"}
                      </td>
                      <td className="py-3.5 px-6 text-neutral-300">
                        {ref && (
                          <div className="font-mono text-[11px] text-emerald-400 font-medium">
                            UTR: {ref}
                          </div>
                        )}
                        {p.rejectionReason && (
                          <div className="text-rose-400 text-xs">
                            Reason: {p.rejectionReason}
                          </div>
                        )}
                        {p.failureReason && (
                          <div className="text-red-400 text-xs">
                            Failure: {p.failureReason}
                          </div>
                        )}
                        {p.adminNote && (
                          <div className="text-neutral-400 text-[11px] mt-0.5">
                            Note: {p.adminNote}
                          </div>
                        )}
                        {!ref && !p.rejectionReason && !p.failureReason && !p.adminNote && (
                          <span className="text-neutral-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="border-t border-neutral-800 px-6 py-4">
        {activeTab === "earnings" ? (
          <Pagination
            currentPage={transactionsPagination.currentPage}
            totalPages={transactionsPagination.totalPages}
            totalItems={transactionsPagination.totalItems}
            itemsPerPage={transactionsPagination.itemsPerPage}
            onPageChange={onTransactionsPageChange}
          />
        ) : (
          <Pagination
            currentPage={payoutsPagination.currentPage}
            totalPages={payoutsPagination.totalPages}
            totalItems={payoutsPagination.totalItems}
            itemsPerPage={payoutsPagination.itemsPerPage}
            onPageChange={onPayoutsPageChange}
          />
        )}
      </div>
    </div>
  );
};
