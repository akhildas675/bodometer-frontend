import React from "react";
import { DollarSign, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { TrainerFinanceSummary, PayoutRequest } from "../../types/finance.types";

interface Props {
  summary: TrainerFinanceSummary | null;
  activePayout: PayoutRequest | null;
  onRequestPayout: () => void;
  loading: boolean;
}

export const TrainerEarningsOverview: React.FC<Props> = ({
  summary,
  activePayout,
  onRequestPayout,
  loading,
}) => {
  const availableBalance = summary?.availableBalance ?? 0;
  const netEarnings = summary?.netEarnings ?? 0;
  const totalPaidOut = summary?.totalPaidOut ?? 0;
  const pendingPayout = summary?.pendingPayout ?? 0;

  const canRequestPayout = availableBalance >= 100 && !activePayout;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Available Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Available for Payout
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Minimum threshold: ₹1,000.00
          </p>
        </div>

        {activePayout ? (
          <div className="flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <Clock size={14} />
            <span>Active payout in progress (₹{activePayout.amount})</span>
          </div>
        ) : (
          <button
            onClick={onRequestPayout}
            disabled={!canRequestPayout || loading}
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
              canRequestPayout && !loading
                ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-[0.98]"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50"
            }`}
          >
            <span>Request Payout</span>
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>

      {/* Net Earnings Card */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Net Earnings
          </span>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${netEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Total sessions conducted
        </p>
      </div>

      {/* Total Paid Out Card */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Transferred
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ArrowUpRight size={20} />
          </div>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${totalPaidOut.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Completed payout transfers
        </p>
      </div>

      {/* Pending / In-Review Payouts Card */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Under Review
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle size={20} />
          </div>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${pendingPayout.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Reserved in queue
        </p>
      </div>
    </div>
  );
};
