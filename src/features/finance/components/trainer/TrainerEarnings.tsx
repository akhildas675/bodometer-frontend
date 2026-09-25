import { useState, useEffect, useCallback } from "react";
import { TrainerEarningsOverview } from "./TrainerEarningsOverview";
import { TrainerEarningsChart } from "./TrainerEarningsChart";
import { TrainerTransactionsTable } from "./TrainerTransactionsTable";
import { RequestPayoutModal } from "./RequestPayoutModal";
import { financeService } from "../../services/finance.service";
import {
  ChartPeriod,
  FinancialTransaction,
  PayoutRequest,
  TrainerChartPoint,
  TrainerFinanceSummary,
} from "../../types/finance.types";
import { PaginationMeta } from "@/types/common.types";
import { RefreshCw } from "lucide-react";

const TrainerEarnings = () => {
  const [summary, setSummary] = useState<TrainerFinanceSummary | null>(null);
  const [activePayout, setActivePayout] = useState<PayoutRequest | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Chart state
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [chartData, setChartData] = useState<TrainerChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Table state
  const [activeTab, setActiveTab] = useState<"earnings" | "payouts">("earnings");
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [transactionsPagination, setTransactionsPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [payoutsPagination, setPayoutsPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [payoutsLoading, setPayoutsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load summary and active payout
  const loadSummaryData = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const [sum, active] = await Promise.all([
        financeService.getTrainerSummary(),
        financeService.getTrainerActivePayout(),
      ]);
      setSummary(sum);
      setActivePayout(active);
    } catch (err) {
      console.error("Failed to load trainer finance summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Load chart
  const loadChartData = useCallback(async (period: ChartPeriod) => {
    try {
      setChartLoading(true);
      const data = await financeService.getTrainerChart({ period });
      setChartData(data);
    } catch (err) {
      console.error("Failed to load trainer earnings chart:", err);
    } finally {
      setChartLoading(false);
    }
  }, []);

  // Load transactions
  const loadTransactions = useCallback(async (page: number) => {
    try {
      setTransactionsLoading(true);
      const res = await financeService.getTrainerTransactions({ page, limit: 10 });
      setTransactions(res.data);
      setTransactionsPagination(res.pagination);
    } catch (err) {
      console.error("Failed to load trainer transactions:", err);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  // Load payouts
  const loadPayouts = useCallback(async (page: number) => {
    try {
      setPayoutsLoading(true);
      const res = await financeService.getTrainerPayouts({ page, limit: 10 });
      setPayouts(res.data);
      setPayoutsPagination(res.pagination);
    } catch (err) {
      console.error("Failed to load trainer payouts:", err);
    } finally {
      setPayoutsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummaryData();
  }, [loadSummaryData]);

  useEffect(() => {
    loadChartData(chartPeriod);
  }, [chartPeriod, loadChartData]);

  useEffect(() => {
    if (activeTab === "earnings") {
      loadTransactions(transactionsPagination.currentPage);
    } else {
      loadPayouts(payoutsPagination.currentPage);
    }
  }, [activeTab, loadTransactions, loadPayouts, transactionsPagination.currentPage, payoutsPagination.currentPage]);

  const handleRefreshAll = () => {
    loadSummaryData();
    loadChartData(chartPeriod);
    if (activeTab === "earnings") {
      loadTransactions(1);
    } else {
      loadPayouts(1);
    }
  };

  return (
    <div className="text-white max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Earnings & Payouts
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track your coaching session revenue, platform split, and withdraw your funds
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={summaryLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 1. Overview Stat Cards */}
      <TrainerEarningsOverview
        summary={summary}
        activePayout={activePayout}
        onRequestPayout={() => setIsModalOpen(true)}
        loading={summaryLoading}
      />

      {/* 2. Interactive Revenue Progression Chart */}
      <TrainerEarningsChart
        data={chartData}
        period={chartPeriod}
        onPeriodChange={setChartPeriod}
        loading={chartLoading}
      />

      {/* 3. Transactions & Payouts Table */}
      <TrainerTransactionsTable
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transactions={transactions}
        transactionsPagination={transactionsPagination}
        onTransactionsPageChange={(p) => loadTransactions(p)}
        payouts={payouts}
        payoutsPagination={payoutsPagination}
        onPayoutsPageChange={(p) => loadPayouts(p)}
        loading={activeTab === "earnings" ? transactionsLoading : payoutsLoading}
      />

      {/* 4. Request Payout Modal */}
      <RequestPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={summary?.availableBalance ?? 0}
        onSuccess={handleRefreshAll}
      />
    </div>
  );
};

export default TrainerEarnings;
