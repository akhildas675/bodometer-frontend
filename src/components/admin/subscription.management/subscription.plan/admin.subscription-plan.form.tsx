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
import { PaginatedResponse, SubscriptionPlan, SubscriptionPlanListItem } from "@/interface/admin.interface";
import { SubscriptionModalConfig, useSubscriptionActions } from "./admin.subscription-plan.action";
import { subscriptionColumns } from "./admin.subscription-plan.columns";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";



const AdminSubscriptionPlanList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof SubscriptionPlanListItem>>({
    field: "" as keyof SubscriptionPlanListItem,
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchFn = useCallback(
    async () =>
      adminServices.getAllSubscriptionPlans(
        searchQuery,
        sortConfig.field ? String(sortConfig.field) : undefined,
        sortConfig.order,
        currentPage,
        itemsPerPage
      ),
    [searchQuery, sortConfig, currentPage, itemsPerPage]
  );

  const { data: response, loading, refetch } =
    useTableFetch<PaginatedResponse<SubscriptionPlan>>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const [modalConfig, setModalConfig] = useState<SubscriptionModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const actions = useSubscriptionActions(refetch, setModalConfig);

  const sortOptions = extractSortOptions(subscriptionColumns);

  return (
    <>
      <div className="text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Subscription Plans</h1>
          <button
            onClick={() => navigate(ADMIN_UI_ROUTES.SUBSCRIPTION_PLAN_CREATE)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
          >
            <Plus size={18} />
            New Plan
          </button>
        </div>

        <div className="mb-4 flex gap-4">
          <SearchBar
            value={searchQuery}
            onSearch={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            placeholder="Search plans..."
            disabled={loading}
            className="flex-1 max-w-md"
          />
          <SortDropdown<keyof SubscriptionPlanListItem>
            options={sortOptions}
            value={sortConfig}
            onSortChange={(sort) => { setSortConfig(sort); setCurrentPage(1); }}
            disabled={loading}
            className="w-64"
            placeholder="Sort by..."
          />
        </div>

        {loading ? (
          <p className="text-purple-300">Loading plans...</p>
        ) : (
          <>
            <DataTable<SubscriptionPlanListItem>
              columns={subscriptionColumns}
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
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => { setItemsPerPage(items); setCurrentPage(1); }}
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

export default AdminSubscriptionPlanList;