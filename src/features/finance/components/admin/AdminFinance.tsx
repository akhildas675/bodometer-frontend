import { useState, useEffect, useCallback } from "react";
import { AdminPlatformFinanceOverview } from "./AdminPlatformFinanceOverview";
import { AdminFinanceChart } from "./AdminFinanceChart";
import { AdminPayoutManagementTable } from "./AdminPayoutManagementTable";
import { AdminTransactionsTable } from "./AdminTransactionsTable";
import { financeService } from "../../services/finance.service";
import {
  AdminChartPoint,
  AdminPayoutSummary,
  ChartPeriod,
  FinancialTransaction,
  PayoutRequest,
  PayoutStatus,
  PlatformFinanceSummary,
} from "../../types/finance.types";
import { PaginationMeta } from "@/types/common.types";
import { RefreshCw } from "lucide-react";

const AdminFinance = () => {
  const [summary, setSummary] = useState<PlatformFinanceSummary | null>(null);
  const [payoutSummary, setPayoutSummary] = useState<AdminPayoutSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Chart
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [chartData, setChartData] = useState<AdminChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Payout queue
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<PayoutStatus | undefined>(undefined);
  const [payoutsPagination, setPayoutsPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [payoutsLoading, setPayoutsLoading] = useState(true);

  // Ledger transactions
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

  const loadSummaryData = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const [platSum, paySum] = await Promise.all([
        financeService.getPlatformSummary(),
        financeService.getAdminPayoutSummary(),
      ]);
      setSummary(platSum);
      setPayoutSummary(paySum);
    } catch (err) {
      console.error("Failed to load platform finance summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadChartData = useCallback(async (period: ChartPeriod) => {
    try {
      setChartLoading(true);
      const data = await financeService.getAdminChart({ period });
      setChartData(data);
    } catch (err) {
      console.error("Failed to load admin finance chart:", err);
    } finally {
      setChartLoading(false);
    }
  }, []);

  const loadPayouts = useCallback(
    async (page: number, status?: PayoutStatus) => {
      try {
        setPayoutsLoading(true);
        const res = await financeService.getAllPayouts({
          page,
          limit: 10,
          status,
        });
        setPayouts(res.data);
        setPayoutsPagination(res.pagination);
      } catch (err) {
        console.error("Failed to load admin payouts:", err);
      } finally {
        setPayoutsLoading(false);
      }
    },
    [],
  );

  const loadTransactions = useCallback(async (page: number) => {
    try {
      setTransactionsLoading(true);
      const res = await financeService.getAllTransactions({ page, limit: 10 });
      setTransactions(res.data);
      setTransactionsPagination(res.pagination);
    } catch (err) {
      console.error("Failed to load admin transactions:", err);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummaryData();
  }, [loadSummaryData]);

  useEffect(() => {
    loadChartData(chartPeriod);
  }, [chartPeriod, loadChartData]);

  useEffect(() => {
    loadPayouts(payoutsPagination.currentPage, payoutStatusFilter);
  }, [loadPayouts, payoutsPagination.currentPage, payoutStatusFilter]);

  useEffect(() => {
    loadTransactions(transactionsPagination.currentPage);
  }, [loadTransactions, transactionsPagination.currentPage]);

  const handleRefreshAll = () => {
    loadSummaryData();
    loadChartData(chartPeriod);
    loadPayouts(payoutsPagination.currentPage, payoutStatusFilter);
    loadTransactions(transactionsPagination.currentPage);
  };

  return (
    <div className="text-white max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Finance & Payout Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Monitor platform revenue, approve coach withdrawal requests, and audit ledger distributions
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

      {/* 1. Platform Overview Stats */}
      <AdminPlatformFinanceOverview
        summary={summary}
        payoutSummary={payoutSummary}
        loading={summaryLoading}
      />

      {/* 2. Platform Analytics Chart */}
      <AdminFinanceChart
        data={chartData}
        period={chartPeriod}
        onPeriodChange={setChartPeriod}
        loading={chartLoading}
      />

      {/* 3. Payout Requests Approval Queue */}
      <AdminPayoutManagementTable
        payouts={payouts}
        pagination={payoutsPagination}
        onPageChange={(page) => loadPayouts(page, payoutStatusFilter)}
        statusFilter={payoutStatusFilter}
        onStatusFilterChange={(status) => {
          setPayoutStatusFilter(status);
          loadPayouts(1, status);
        }}
        loading={payoutsLoading}
        onActionComplete={handleRefreshAll}
      />

      {/* 4. Financial Transactions Audit Trail */}
      <AdminTransactionsTable
        transactions={transactions}
        pagination={transactionsPagination}
        onPageChange={(page) => loadTransactions(page)}
        loading={transactionsLoading}
      />
    </div>
  );
};

export default AdminFinance;
