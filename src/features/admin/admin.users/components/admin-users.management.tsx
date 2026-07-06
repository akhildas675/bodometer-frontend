import { useState, useCallback, useEffect } from "react";


import DataTable from "@/ui.components/ui/table/data.table";
import ConfirmationModal from "@/ui.components/ui/confirm.dialog";

import SearchBar from "@/features/controls/search/search";
import SortDropdown, { type SortConfig } from "@/features/controls/sort/sort";
import { extractSortOptions } from "@/features/controls/sort/sort.label";
import Pagination from "@/features/controls/pagination/pagination";

import { useAuthStore } from "@/stores/auth.store";
import { useTableFetch } from "@/hooks/useTableFetch";

import { userService } from "@/modules/user/service/user.service";
import { PaginatedResponse } from "@/interface/common.interface";
import { AdminGetUsersResponse } from "@/interface/user.interface";
import { userColumns } from "./admin-users.columns";
import { useUserActions } from "./admin-users.actions";


const AdminUsersManagement = () => {
  const user = useAuthStore((state) => state.user);
    const [searchQuery, setSearchQuery] = useState("");
      const [sortConfig, setSortConfig] = useState<SortConfig<keyof AdminGetUsersResponse>>({
        field: "" as keyof AdminGetUsersResponse,
        order: "asc",
      });
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage, setItemsPerPage] = useState(10)

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<PaginatedResponse<AdminGetUsersResponse>>(
    () =>
      userService.getUsers({
        search: searchQuery,
        sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
        sortOrder: sortConfig.order,
        page: currentPage,
        limit: itemsPerPage,
      }),
    false
  );


  const [modalConfig, setModalConfig] = useState<import("./admin-users.actions").UserModalConfig>({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });

  const actions = useUserActions(refetch,setModalConfig);

  
     const handleSearch = useCallback((value: string) => {
       setSearchQuery(value);
       setCurrentPage(1);
     }, []);
   
     const handleSortChange = useCallback(
       (sort: SortConfig<keyof AdminGetUsersResponse>) => {
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
   
     const sortOptions = extractSortOptions(userColumns);

  if (!user) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
   <>
      <div className="text-white">
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        <div className="mb-4 flex gap-4">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search trainers by name or email..."
            disabled={loading}
            className="flex-1 max-w-md"
          />

          <SortDropdown<keyof AdminGetUsersResponse>
            options={sortOptions}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={loading}
            className="w-64"
            placeholder="Sort by..."
          />

          
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : (
           <>
            <DataTable<AdminGetUsersResponse>
              columns={userColumns}
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

export default AdminUsersManagement;
