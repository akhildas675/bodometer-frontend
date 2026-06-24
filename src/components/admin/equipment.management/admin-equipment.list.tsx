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
import { equipmentService } from "@/modules/equipment/service/equipment.service";
import { PaginatedResponse } from "@/interface/common.interface";
import type { UpdateEquipment } from "@/interface/equipment.interface";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";

import { equipmentColumns } from "./admin-equipment.columns";
import { useEquipmentActions, type EquipmentModalConfig } from "./admin-equipment.actions";


const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Active", value: "true" },
  { label: "Blocked", value: "false" },
] as const;

type StatusFilter = "" | "true" | "false";

// Skeleton Cache Loader
const SkeletonLoader = () => (
  <div className="w-full rounded-xl overflow-hidden bg-[#1f1b2e] border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-purple-500/20">
            {[1, 2, 3, 4, 5].map((i) => (
              <th key={i} className="py-4 px-6">
                <div className="h-4 bg-purple-500/20 rounded w-24 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row} className="border-b border-purple-500/10">
              <td className="py-4 px-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg animate-pulse"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-4 bg-purple-500/20 rounded w-32 animate-pulse mb-2"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-4 bg-purple-500/20 rounded w-20 animate-pulse"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-4 bg-purple-500/20 rounded w-48 animate-pulse mb-1"></div>
                <div className="h-4 bg-purple-500/20 rounded w-32 animate-pulse"></div>
              </td>
              <td className="py-4 px-6">
                <div className="h-6 bg-purple-500/20 rounded-full w-16 animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminEquipmentList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof UpdateEquipment>>({
    field: "" as keyof UpdateEquipment,
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");

  const fetchFn = useCallback(async () => {
    return equipmentService.getAllEquipment({
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
      sortOrder: sortConfig.order,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [searchQuery, statusFilter, sortConfig, currentPage, itemsPerPage]);

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<UpdateEquipment>>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const [modalConfig, setModalConfig] = useState<EquipmentModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const actions = useEquipmentActions(refetch, setModalConfig);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (sort: SortConfig<keyof UpdateEquipment>) => {
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

  const sortOptions = extractSortOptions(equipmentColumns);

  return (
    <>
      <div className="text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Equipment Management</h1>
          <button
            onClick={() => navigate(ADMIN_UI_ROUTES.EQUIPMENT_FORM)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus size={18} />
            Create
          </button>
        </div>

        <div className="mb-6 flex gap-4">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search equipment..."
            disabled={loading}
            className="flex-1 max-w-md"
          />
          <SortDropdown<keyof UpdateEquipment>
            options={sortOptions}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={loading}
            className="w-64"
            placeholder="Sort by..."
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-purple-400 font-medium">Status:</span>
          {STATUS_FILTERS.map((opt) => (
            <button
              key={opt.value}
              disabled={loading}
              onClick={() => handleStatusFilter(opt.value as StatusFilter)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                statusFilter === opt.value
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-purple-700 text-purple-400 hover:border-purple-500 hover:text-purple-200 bg-transparent"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DataTable<UpdateEquipment>
              columns={equipmentColumns}
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
          </div>
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

export default AdminEquipmentList;
