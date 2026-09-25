import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { financeService } from "@/features/finance/services/finance.service";
import {
  AdminChartPoint,
  AdminPayoutSummary,
  FinancialTransaction,
  PayoutRequest,
  PlatformFinanceSummary,
} from "@/features/finance/types/finance.types";
import { ADMIN_UI_ROUTES } from "@/constants/routes/admin.routes";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Users,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDashboard = () => {
  const role = useAuthStore((state) => state.user?.role);

  const [summary, setSummary] = useState<PlatformFinanceSummary | null>(null);
  const [payoutSummary, setPayoutSummary] = useState<AdminPayoutSummary | null>(null);
  const [pendingPayouts, setPendingPayouts] = useState<PayoutRequest[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<FinancialTransaction[]>([]);
  const [chartData, setChartData] = useState<AdminChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [platSum, paySum, pendingRes, txRes, chart] = await Promise.all([
        financeService.getPlatformSummary(),
        financeService.getAdminPayoutSummary(),
        financeService.getAllPayouts({ page: 1, limit: 4, status: "PENDING" }),
        financeService.getAllTransactions({ page: 1, limit: 5 }),
        financeService.getAdminChart({ period: "daily" }),
      ]);
      setSummary(platSum);
      setPayoutSummary(paySum);
      setPendingPayouts(pendingRes.data);
      setRecentTransactions(txRes.data);
      setChartData(chart);
    } catch (err) {
      console.error("Failed to load admin dashboard finance data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (!role) return null;

  const grossRevenue = summary?.grossRevenue ?? 0;
  const platformEarnings = summary?.totalPlatformEarnings ?? 0;
  const trainerEarnings = summary?.totalTrainerEarnings ?? 0;
  const pendingAmount = payoutSummary?.pendingAmount ?? 0;
  const paidAmount = payoutSummary?.paidAmount ?? 0;

  // Chart config
  const chartLabels = chartData.map((d) => d.label);
  const grossValues = chartData.map((d) => d.grossRevenue);
  const trainerValues = chartData.map((d) => d.trainerEarnings);
  const platformValues = chartData.map((d) => d.platformEarnings);

  const miniChartData = {
    labels: chartLabels.length > 0 ? chartLabels.slice(-10) : ["No data"],
    datasets: [
      {
        label: "Gross",
        data: grossValues.length > 0 ? grossValues.slice(-10) : [0],
        borderColor: "#a855f7",
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 2.5,
      },
      {
        label: "Trainers (70%)",
        data: trainerValues.length > 0 ? trainerValues.slice(-10) : [0],
        borderColor: "#10b981",
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 2.5,
      },
      {
        label: "Platform (30%)",
        data: platformValues.length > 0 ? platformValues.slice(-10) : [0],
        borderColor: "#38bdf8",
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 2.5,
      },
    ],
  };

  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#a3a3a3",
          font: { size: 10 },
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      tooltip: {
        backgroundColor: "#171717",
        titleColor: "#e5e5e5",
        borderColor: "#262626",
        borderWidth: 1,
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number | bigint | null } }) =>
            ` ${context.dataset.label}: ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#737373", font: { size: 10 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.03)" },
        ticks: {
          color: "#737373",
          font: { size: 10 },
          callback: (value: string | number) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="text-white max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Platform Administration
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck size={12} /> System Admin
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time financial performance, revenue splits, and withdrawal request queues
          </p>
        </div>

        <Link
          to={ADMIN_UI_ROUTES.FINANCE}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all cursor-pointer active:scale-95"
        >
          <DollarSign size={15} />
          <span>Financial Suite</span>
        </Link>
      </div>

      {/* 1. OVERALL METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Gross Volume */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Gross Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${grossRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Total session bookings
          </p>
        </div>

        {/* Platform 30% Retained */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-950/40 via-neutral-900 to-neutral-900 border border-purple-500/30 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Platform Cut (30%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Percent size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${platformEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-purple-300/70 mt-1">
            Retained gross margin
          </p>
        </div>

        {/* Trainer Share (70%) */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Trainer Share (70%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${trainerEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Earned by coaches
          </p>
        </div>

        {/* Pending Payout Requests */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pending Payouts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${pendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-amber-400/80 mt-1 font-medium">
            {pendingPayouts.length > 0 ? `${pendingPayouts.length} review pending` : "No pending items"}
          </p>
        </div>

        {/* Total Paid Out */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Transferred
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Lifetime payouts paid
          </p>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Financial Progression & Recent Ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  Revenue Breakdown Trend
                </h3>
              </div>
              <Link
                to={ADMIN_UI_ROUTES.FINANCE}
                className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <span>Full Chart</span>
                <ChevronRight size={14} />
              </Link>
            </div>
            <div className="h-52 w-full">
              <Line data={miniChartData} options={miniChartOptions} />
            </div>
          </div>

          {/* Recent Ledger Activity */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Recent Revenue Distributions
              </h3>
              <Link
                to={ADMIN_UI_ROUTES.FINANCE}
                className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Audit Ledger</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-neutral-500">
                Loading ledger activity...
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-500">
                No financial transactions recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/60">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 hover:bg-neutral-800/20 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="text-xs font-medium text-white font-mono">
                        {tx.bookingId ? `Booking #${tx.bookingId.slice(-6)}` : tx.referenceKey}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {format(new Date(tx.createdAt), "MMM d, yyyy • h:mm a")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">
                        ₹{tx.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        Platform: <span className="text-purple-400">+₹{tx.platformAmount}</span> | Trainer: <span className="text-emerald-400">₹{tx.trainerAmount}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right (1 Col): Pending Payouts Action Box & Shortcuts */}
        <div className="space-y-6">
          {/* Action Box: Pending Payout Queue */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                Pending Approvals
              </h3>
              <Link
                to={ADMIN_UI_ROUTES.FINANCE}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>View Queue</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {pendingPayouts.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-400">
                    {pendingPayouts.length} Payout Request{pendingPayouts.length > 1 ? "s" : ""} Awaiting Review
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Total amount queued: ₹{pendingAmount.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="space-y-2">
                  {pendingPayouts.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-mono text-neutral-300">
                          {p.trainerId.slice(-8)}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          {format(new Date(p.requestedAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-white">
                        ₹{p.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to={ADMIN_UI_ROUTES.FINANCE}
                  className="block w-full py-2 text-center rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-medium text-amber-300 transition-colors"
                >
                  Review All Requests
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                  <CheckCircle2 size={18} />
                </div>
                <p className="text-xs font-semibold text-white">
                  Queue is clear
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  All trainer withdrawal requests have been processed.
                </p>
              </div>
            )}
          </div>

          {/* Quick Management Links */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white mb-3">
              Management Portals
            </h3>
            <div className="space-y-2">
              <Link
                to={ADMIN_UI_ROUTES.FINANCE}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-xs font-medium text-neutral-200 group-hover:text-white">
                    Finance & Payouts
                  </span>
                </div>
                <ChevronRight size={14} className="text-neutral-500 group-hover:text-neutral-300" />
              </Link>

              <Link
                to={ADMIN_UI_ROUTES.TRAINERS}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <UserCheck size={16} />
                  </div>
                  <span className="text-xs font-medium text-neutral-200 group-hover:text-white">
                    Manage Trainers
                  </span>
                </div>
                <ChevronRight size={14} className="text-neutral-500 group-hover:text-neutral-300" />
              </Link>

              <Link
                to={ADMIN_UI_ROUTES.SUBSCRIPTIONS}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <CreditCard size={16} />
                  </div>
                  <span className="text-xs font-medium text-neutral-200 group-hover:text-white">
                    Subscription Plans
                  </span>
                </div>
                <ChevronRight size={14} className="text-neutral-500 group-hover:text-neutral-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
