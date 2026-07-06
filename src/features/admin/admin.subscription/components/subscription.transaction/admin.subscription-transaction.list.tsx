import { useState, useCallback, useEffect } from "react";
import DataTable from "@/ui.components/ui/table/data.table";
import SearchBar from "@/features/controls/search/search";
import SortDropdown, { type SortConfig } from "@/features/controls/sort/sort";
import { extractSortOptions } from "@/features/controls/sort/sort.label";
import Pagination from "@/features/controls/pagination/pagination";
import { useTableFetch } from "@/hooks/useTableFetch";
import { subscriptionService } from "@/modules/subscription/service/subscription.service";
import { PaginatedResponse } from "@/interface/common.interface";
import { SubscriptionTransaction } from "@/modules/subscription/types/subscription.interface";
import { transactionColumns } from "./admin.subscription-transaction.columns";

const AdminSubscriptionTransactionList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof SubscriptionTransaction>>({
    field: "createdAt" as keyof SubscriptionTransaction,
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchFn = useCallback(
    async () =>
      subscriptionService.getAllSubscriptionTransactions({
        search: searchQuery,
        status: statusFilter || undefined,
        sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
        sortOrder: sortConfig.order,
        page: currentPage,
        limit: itemsPerPage,
      }),
    [searchQuery, statusFilter, sortConfig, currentPage, itemsPerPage]
  );

  const { data: response, loading, refetch } =
    useTableFetch<PaginatedResponse<SubscriptionTransaction>>(fetchFn, false);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (sort: SortConfig<keyof SubscriptionTransaction>) => {
      setSortConfig(sort);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    refetch();
  }, [searchQuery, statusFilter, sortConfig, currentPage, itemsPerPage, refetch]);

  const sortOptions = extractSortOptions(transactionColumns);

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Subscription Transactions</h1>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <SearchBar
          value={searchQuery}
          onSearch={handleSearch}
          placeholder="Search ID, user, or plan..."
          disabled={loading}
          className="flex-1 min-w-[280px] max-w-md"
        />

        {/* Status Filter Dropdown */}
        <div className="flex items-center bg-[#171c35] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300">
          <label htmlFor="status-select" className="mr-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Status:
          </label>
          <select
            id="status-select"
            value={statusFilter}
            onChange={handleStatusChange}
            disabled={loading}
            className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer focus:ring-0"
          >
            <option value="" className="bg-slate-900 text-white">All Statuses</option>
            <option value="success" className="bg-slate-900 text-white">Success</option>
            <option value="pending" className="bg-slate-900 text-white">Pending</option>
            <option value="failed" className="bg-slate-900 text-white">Failed</option>
          </select>
        </div>

        <SortDropdown<keyof SubscriptionTransaction>
          options={sortOptions}
          value={sortConfig}
          onSortChange={handleSortChange}
          disabled={loading}
          className="w-64"
          placeholder="Sort by..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-purple-300 gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
          <span>Loading transactions...</span>
        </div>
      ) : (
        <>
          <DataTable<SubscriptionTransaction>
            columns={transactionColumns}
            data={response?.data || []}
          />

          {(!response?.data || response.data.length === 0) && (
            <div className="text-center py-12 text-slate-400 border border-white/5 rounded-xl bg-white/[0.02] mt-4">
              No transactions found matching your criteria.
            </div>
          )}

          {response?.pagination && response.data.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={Number(response.pagination.currentPage)}
                totalPages={Number(response.pagination.totalPages)}
                totalItems={Number(response.pagination.totalItems)}
                itemsPerPage={Number(response.pagination.itemsPerPage)}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                disabled={loading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminSubscriptionTransactionList;
