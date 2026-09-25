import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { financeService } from "@/features/finance/services/finance.service";
import {
  FinancialTransaction,
  PayoutRequest,
  TrainerChartPoint,
  TrainerFinanceSummary,
} from "@/features/finance/types/finance.types";
import { TRAiNER_UI_ROUTES } from "@/constants/routes/trainer.routes";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Sparkles,
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
  Filler,
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
  Filler,
);

const TrainerDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const [summary, setSummary] = useState<TrainerFinanceSummary | null>(null);
  const [activePayout, setActivePayout] = useState<PayoutRequest | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<FinancialTransaction[]>([]);
  const [chartData, setChartData] = useState<TrainerChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [sum, active, txRes, chart] = await Promise.all([
        financeService.getTrainerSummary(),
        financeService.getTrainerActivePayout(),
        financeService.getTrainerTransactions({ page: 1, limit: 5 }),
        financeService.getTrainerChart({ period: "daily" }),
      ]);
      setSummary(sum);
      setActivePayout(active);
      setRecentTransactions(txRes.data);
      setChartData(chart);
    } catch (err) {
      console.error("Failed to load trainer dashboard finance data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const availableBalance = summary?.availableBalance ?? 0;
  const netEarnings = summary?.netEarnings ?? 0;
  const totalPaidOut = summary?.totalPaidOut ?? 0;
  const pendingPayout = summary?.pendingPayout ?? 0;

  // Mini chart config
  const chartLabels = chartData.map((d) => d.label);
  const chartValues = chartData.map((d) => d.earnings);

  const miniChartData = {
    labels: chartLabels.length > 0 ? chartLabels.slice(-10) : ["No data"],
    datasets: [
      {
        label: "Earnings",
        data: chartValues.length > 0 ? chartValues.slice(-10) : [0],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  };

  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#171717",
        titleColor: "#e5e5e5",
        bodyColor: "#10b981",
        borderColor: "#262626",
        borderWidth: 1,
        callbacks: {
          label: (context: { parsed: { y: number | bigint | null } }) =>
            ` ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`,
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
              Welcome back, {user?.name || "Coach"}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles size={11} /> Verified Trainer
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Here is your live coaching activity, session earnings, and payout overview
          </p>
        </div>

        <Link
          to={TRAiNER_UI_ROUTES.TRAINER_EARNINGS}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
        >
          <DollarSign size={15} />
          <span>Manage Earnings</span>
        </Link>
      </div>

      {/* 1. OVERALL METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Ready to withdraw (min ₹1,000)
          </p>
        </div>

        {/* Net Earnings */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Total Earned
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${netEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Lifetime session earnings
          </p>
        </div>

        {/* Total Transferred */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Transferred to Bank
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${totalPaidOut.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Completed bank payouts
          </p>
        </div>

        {/* Pending Payout */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Pending Payout
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {loading ? "..." : `₹${pendingPayout.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {activePayout ? "1 request in queue" : "No active requests"}
          </p>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Progression & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Progression Chart */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  Earnings Trend
                </h3>
              </div>
              <Link
                to={TRAiNER_UI_ROUTES.TRAINER_EARNINGS}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>Full Analytics</span>
                <ChevronRight size={14} />
              </Link>
            </div>
            <div className="h-48 w-full">
              <Line data={miniChartData} options={miniChartOptions} />
            </div>
          </div>

          {/* Recent Sessions Ledger */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Recent Completed Sessions
              </h3>
              <Link
                to={TRAiNER_UI_ROUTES.TRAINER_EARNINGS}
                className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-neutral-500">
                Loading session activity...
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-500">
                No recent coaching earnings recorded yet.
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
                      <p className="text-xs font-bold text-emerald-400">
                        +₹{tx.trainerAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {tx.serviceName || "1-on-1 Coaching Session"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Active Payout & Quick Navigation */}
        <div className="space-y-6">
          {/* Active Payout Card */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white mb-3">
              Payout Status
            </h3>

            {activePayout ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {activePayout.status}
                    </span>
                    <span className="text-sm font-bold text-white">
                      ₹{activePayout.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Requested on {format(new Date(activePayout.requestedAt), "MMM d, yyyy")}
                  </p>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your withdrawal request is currently being processed by the administration team.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  You have no pending withdrawals. When your balance reaches ₹1,000, you can request a direct bank transfer.
                </p>
                <Link
                  to={TRAiNER_UI_ROUTES.TRAINER_EARNINGS}
                  className="block w-full py-2.5 text-center rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
                >
                  View Payout Options
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to={TRAiNER_UI_ROUTES.TRAINER_BOOKING_MANAGEMENT}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Calendar size={16} />
                  </div>
                  <span className="text-xs font-medium text-neutral-200 group-hover:text-white">
                    Manage Sessions & Slots
                  </span>
                </div>
                <ChevronRight size={14} className="text-neutral-500 group-hover:text-neutral-300" />
              </Link>

              <Link
                to={TRAiNER_UI_ROUTES.TRAINER_MESSAGES}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <MessageSquare size={16} />
                  </div>
                  <span className="text-xs font-medium text-neutral-200 group-hover:text-white">
                    Client Messages
                  </span>
                </div>
                <ChevronRight size={14} className="text-neutral-500 group-hover:text-neutral-300" />
              </Link>

              <Link
                to={TRAiNER_UI_ROUTES.TRAINER_EARNINGS}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-xs font-medium text-neutral-200 group-hover:text-white">
                    Earnings & Payouts
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

export default TrainerDashboard;
