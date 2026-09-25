import React from "react";
import { format } from "date-fns";
import {
  FinancialTransaction,
  TransactionStatus,
} from "../../types/finance.types";
import { PaginationMeta } from "@/types/common.types";
import Pagination from "@/components/ui/Pagination";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Props {
  transactions: FinancialTransaction[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export const AdminTransactionsTable: React.FC<Props> = ({
  transactions,
  pagination,
  onPageChange,
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

  return (
    <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden backdrop-blur-sm">
      <div className="border-b border-neutral-800 px-6 py-4">
        <h3 className="text-base font-semibold text-white">
          Financial Ledger Audit Trail
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Comprehensive ledger of all booking revenue splits and transactions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-950/60 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800/80">
            <tr>
              <th className="py-3.5 px-6">Timestamp</th>
              <th className="py-3.5 px-6">Type</th>
              <th className="py-3.5 px-6">Reference / Booking</th>
              <th className="py-3.5 px-6">Trainer ID</th>
              <th className="py-3.5 px-6">Gross Amount</th>
              <th className="py-3.5 px-6">Platform (30%)</th>
              <th className="py-3.5 px-6">Trainer (70%)</th>
              <th className="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-500">
                  Loading ledger transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-500">
                  No financial transactions recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-6 text-neutral-400 whitespace-nowrap">
                    {format(new Date(t.createdAt), "MMM d, yyyy • h:mm a")}
                  </td>
                  <td className="py-3.5 px-6 font-medium text-white">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
                      {t.transactionType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[11px] text-neutral-300">
                    {t.bookingId ? `Booking #${t.bookingId.slice(-6)}` : t.referenceKey}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[11px] text-neutral-400">
                    {t.trainerId}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-white whitespace-nowrap">
                    ₹{t.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-6 text-purple-400 font-semibold whitespace-nowrap">
                    +₹{t.platformAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-6 text-emerald-400 font-semibold whitespace-nowrap">
                    ₹{t.trainerAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-6">
                    {getTransactionStatusBadge(t.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-neutral-800 px-6 py-4">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
