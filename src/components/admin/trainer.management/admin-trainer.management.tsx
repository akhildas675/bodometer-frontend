import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth.store";

import type {
  AdminGetTrainersResponse,
  PaginatedResponse,
} from "@/interface/admin.interface";

import adminServices from "@/services/admin/admin.services";

import DataTable from "@/components/ui/table/data.table";
import ConfirmationModal from "@/components/ui/confirm.dialog";

import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import { extractSortOptions } from "@/components/controls/sort/sort.label";
import Pagination from "@/components/controls/pagination/pagination";

import { useTableFetch } from "@/hooks/useTableFetch";
import { trainerColumns } from "./admin-trainer.columns";
import { useTrainerActions } from "./admin-trainer.actions";

const AdminTrainerManagement = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof AdminGetTrainersResponse>>({
    field: "" as keyof AdminGetTrainersResponse,
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<AdminGetTrainersResponse>>(
    () =>
      adminServices.getTrainers(
        searchQuery,
        sortConfig.field ? String(sortConfig.field) : undefined,
        sortConfig.order,
        currentPage,
        itemsPerPage
      ),
    false
  );

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "danger" | "primary";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const actions = useTrainerActions(refetch, setModalConfig);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (sort: SortConfig<keyof AdminGetTrainersResponse>) => {
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
  }, [searchQuery, sortConfig, currentPage, itemsPerPage, refetch]);

  const sortOptions = extractSortOptions(trainerColumns);

  if (!user) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <>
      <div className="text-white">
        <h1 className="text-2xl font-semibold mb-6">Trainer Management</h1>

        <div className="mb-4 flex gap-4">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search trainers by name or email..."
            disabled={loading}
            className="flex-1 max-w-md"
          />

          <SortDropdown<keyof AdminGetTrainersResponse>
            options={sortOptions}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={loading}
            className="w-64"
            placeholder="Sort by..."
          />
        </div>

        {loading ? (
          <p>Loading trainers....</p>
        ) : (
          <>
            <DataTable<AdminGetTrainersResponse>
              columns={trainerColumns}
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

export default AdminTrainerManagement;