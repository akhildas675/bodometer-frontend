import React from "react";
import { DollarSign, Percent, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { AdminPayoutSummary, PlatformFinanceSummary } from "../../types/finance.types";

interface Props {
  summary: PlatformFinanceSummary | null;
  payoutSummary: AdminPayoutSummary | null;
  loading: boolean;
}

export const AdminPlatformFinanceOverview: React.FC<Props> = ({
  summary,
  payoutSummary,
  loading,
}) => {
  const grossRevenue = summary?.grossRevenue ?? 0;
  const platformEarnings = summary?.totalPlatformEarnings ?? 0;
  const trainerEarnings = summary?.totalTrainerEarnings ?? 0;
  const pendingPayouts = payoutSummary?.pendingAmount ?? 0;
  const completedPayouts = payoutSummary?.paidAmount ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* Gross Revenue */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Gross Volume
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <DollarSign size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${grossRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Total customer payments
        </p>
      </div>

      {/* Platform Net (30%) */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-950/40 via-neutral-900 to-neutral-900 border border-purple-500/30 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Platform Cut (30%)
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Percent size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${platformEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-[11px] text-purple-300/70 mt-1">
          Platform retained revenue
        </p>
      </div>

      {/* Trainer Share (70%) */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Trainer Share (70%)
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${trainerEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Earned by fitness coaches
        </p>
      </div>

      {/* Pending Payout Queue */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Pending Approval
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${pendingPayouts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Awaiting admin review
        </p>
      </div>

      {/* Completed Payouts */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Paid to Date
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {loading ? "..." : `₹${completedPayouts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Transferred to trainers
        </p>
      </div>
    </div>
  );
};
