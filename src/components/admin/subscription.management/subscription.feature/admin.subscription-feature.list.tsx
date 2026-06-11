import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import DataTable from "@/components/ui/table/data.table";
import ConfirmationModal from "@/components/ui/confirm.dialog";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import { extractSortOptions } from "@/components/controls/sort/sort.label";
import Pagination from "@/components/controls/pagination/pagination";

import { useTableFetch } from "@/hooks/useTableFetch";
import adminServices from "@/services/admin/admin.services";

import type { SubscriptionFeature, PaginatedResponse } from "@/interface/admin.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { FeatureModalConfig, useSubscriptionFeatureActions } from "./admin.subscription-feature.action";
import { subscriptionFeatureColumns } from "./admin.subscription-feature.columns";



const TYPE_FILTERS = [
  { label: "All", value: "" },
  { label: "Boolean", value: "boolean" },
  { label: "Count", value: "count" },
] as const;

type TypeFilter = "" | "boolean" | "count";

const AdminSubscriptionFeatureList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof SubscriptionFeature>>({
    field: "" as keyof SubscriptionFeature,
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchFn = useCallback(
    () =>
      adminServices.getAllSubscriptionFeatures({
        search: searchQuery || undefined,
        type: typeFilter || undefined,
        sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
        sortOrder: sortConfig.order,
        page: currentPage,
        limit: itemsPerPage,
      }),
    [searchQuery, typeFilter, sortConfig, currentPage, itemsPerPage]
  );

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<SubscriptionFeature>>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const [modalConfig, setModalConfig] = useState<FeatureModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const actions = useSubscriptionFeatureActions(refetch, setModalConfig);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilter = useCallback((value: TypeFilter) => {
    setTypeFilter(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (sort: SortConfig<keyof SubscriptionFeature>) => {
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

  const sortOptions = extractSortOptions(subscriptionFeatureColumns);

  return (
    <>
      <div className="text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Subscription Features</h1>
          <button
            onClick={() => navigate(ADMIN_UI_ROUTES.SUBSCRIPTION_FEATURE_CREATE)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
          >
            <Plus size={18} />
            New Feature
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-3">
          <div className="flex gap-4">
            <SearchBar
              value={searchQuery}
              onSearch={handleSearch}
              placeholder="Search features by title or key..."
              disabled={loading}
              className="flex-1 max-w-md"
            />
            <SortDropdown<keyof SubscriptionFeature>
              options={sortOptions}
              value={sortConfig}
              onSortChange={handleSortChange}
              disabled={loading}
              className="w-64"
              placeholder="Sort by..."
            />
          </div>  

          {/* Type filter pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-400 font-medium">Type:</span>
            {TYPE_FILTERS.map((opt) => (
              <button
                key={opt.value}
                disabled={loading}
                onClick={() => handleTypeFilter(opt.value as TypeFilter)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                  typeFilter === opt.value
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "border-purple-700 text-purple-400 hover:border-purple-500 hover:text-purple-200 bg-transparent"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading features...</p>
        ) : (
          <>
            <DataTable<SubscriptionFeature>
              columns={subscriptionFeatureColumns}
              data={response?.data || []}
              actions={actions}
            />

            {response?.pagination && (
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

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
      />
    </>
  );
};

export default AdminSubscriptionFeatureList;