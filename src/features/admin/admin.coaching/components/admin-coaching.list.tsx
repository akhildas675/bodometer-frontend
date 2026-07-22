import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter } from "lucide-react";

import DataTable from "@/ui.components/ui/table/data.table";
import ConfirmationModal from "@/ui.components/ui/confirm.dialog";
import SearchBar from "@/features/controls/search/search";
import SortDropdown, { type SortConfig } from "@/features/controls/sort/sort";
import { extractSortOptions } from "@/features/controls/sort/sort.label";
import Pagination from "@/features/controls/pagination/pagination";
import { useTableFetch } from "@/hooks/useTableFetch";
import { PaginatedResponse } from "@/interface/common.interface";
import { UpdateCoaching } from "@/modules/coaching/types/coaching.interface";
import { coachingColumns } from "./admin-coaching.columns";
import { useCoachingActions, type CoachingModalConfig } from "./admin-coaching.actions";
import { coachingService } from "@/modules/coaching/service/coaching.service";
import { ADMIN_UI_ROUTES } from "@/constants/constant-routes/ui-routes/admin.ui-constant-routes";
import { SLOT_DURATION_OPTIONS } from "@/constants/booking.constant";

const AdminCoachingList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof UpdateCoaching>>({
    field: "" as keyof UpdateCoaching,
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchFn = useCallback(async () => {
    return coachingService.getCoachingServices({
      search: searchQuery || undefined,
      sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
      sortOrder: sortConfig.order,
      page: currentPage,
      limit: itemsPerPage,
      durationMinutes: durationFilter ? Number(durationFilter) : undefined,
    });
  }, [searchQuery, sortConfig, currentPage, itemsPerPage, durationFilter]);

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<UpdateCoaching>>(fetchFn, false);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const [modalConfig, setModalConfig] = useState<CoachingModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const actions = useCoachingActions(refetch, setModalConfig);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (sort: SortConfig<keyof UpdateCoaching>) => {
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

  const sortOptions = extractSortOptions(coachingColumns);

  return (
    <>
      <div className="text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Coaching Services</h1>
            <p className="text-sm text-purple-300 mt-1">
              Manage coaching packages, durations, pricing, and availability.
            </p>
          </div>
          <button
            onClick={() => navigate(ADMIN_UI_ROUTES.COACHING_CREATE)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition cursor-pointer"
          >
            <Plus size={18} />
            New Coaching Service
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search service type or description..."
            disabled={loading}
            className="flex-1 min-w-[240px] max-w-md"
          />

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 bg-indigo-900/50 border border-purple-600/50 rounded-lg px-3 py-2 text-sm">
            <Filter size={16} className="text-purple-300" />
            <select
              value={durationFilter}
              onChange={(e) => {
                setDurationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
              disabled={loading}
            >
              <option value="" className="bg-indigo-900 text-white">
                All Durations
              </option>
              {SLOT_DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-indigo-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <SortDropdown<keyof UpdateCoaching>
            options={sortOptions}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={loading}
            className="w-64"
            placeholder="Sort by..."
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-purple-300">Loading coaching services...</div>
        ) : (
          <>
            <DataTable<UpdateCoaching>
              columns={coachingColumns}
              data={Array.isArray(response?.data) ? response.data : []}
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

export default AdminCoachingList;
