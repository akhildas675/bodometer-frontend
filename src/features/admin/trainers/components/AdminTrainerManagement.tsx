import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { PaginatedResponse } from "@/types/common.types";
import { AdminGetTrainersResponse } from "@/features/trainer/types/trainer.types";
import { trainerService } from "@/features/trainer/services/trainer.service";

import DataTable from "@/components/ui/DataTable";
import ConfirmationModal from "@/components/ui/ConfirmDialog";

import SearchBar from "@/components/ui/SearchInput";
import SortDropdown, { type SortConfig } from "@/components/ui/SortControl";
import { extractSortOptions } from "@/components/ui/SortLabel";
import Pagination from "@/components/ui/Pagination";

import { useTableFetch } from "@/hooks/useTableFetch";
import { trainerColumns } from "@/features/admin/trainers/components/AdminTrainerColumns";
import { useTrainerActions } from "@/features/admin/trainers/components/AdminTrainerActions";

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
    setData,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<AdminGetTrainersResponse>>(
    () =>
      trainerService.getTrainers({
        search: searchQuery,
        sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
        sortOrder: sortConfig.order,
        page: currentPage,
        limit: itemsPerPage,
      }),
    false
  );

  const [modalConfig, setModalConfig] = useState<import("./AdminTrainerActions").TrainerModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const updateTrainerStatusLocally = useCallback((trainerId: string) => {
    setData((prev) => {
      if (!prev || !prev.data) return prev;
      return {
        ...prev,
        data: prev.data.map((t) =>
          t.id === trainerId ? { ...t, isBlocked: !t.isBlocked } : t
        ),
      };
    });
  }, [setData]);

  const actions = useTrainerActions(refetch, setModalConfig, updateTrainerStatusLocally);

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
        {...modalConfig}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default AdminTrainerManagement;