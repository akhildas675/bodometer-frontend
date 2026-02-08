import { useAuthStore } from "../../../stores/auth.store";
import type { AdminGetTrainersResponse } from "../../../interface/admin.interface";
import adminServices from "../../../services/admin/admin.services";
import SidebarLayout from "../../ui/app.sidebar/sidebar.layout";
import DataTable from "../../ui/table/data.table";
import { useTrainerActions } from "./admin-trainer.actions";
import { trainerColumns } from "./admin-trainer.columns";
import { useTableFetch } from "../../../hooks/useTableFetch";
import type { PaginatedResponse } from "../../../interface/common.interface";
import ActiveFilters from "../../ui/controls/filter/active.filter";
import TableToolbar from "../../ui/table/table.toolbar";
import SearchBar from "../../ui/controls/search/search";
import FilterSelect from "../../ui/controls/filter/filter";
import SortSelect from "../../ui/controls/sort/sort";
import Pagination from "../../ui/controls/pagination/pagination";


const AdminTrainerManagement = () => {
  const user = useAuthStore((state) => state.user);

  const { data, loading, refetch, setParams, params } = useTableFetch<PaginatedResponse<AdminGetTrainersResponse>>(
    (params) => adminServices.getTrainers(params).then((res) => res.data)
  );

  const actions = useTrainerActions(refetch);

  const handleSearch = (search: string) => {
    setParams({ ...params, search: search || undefined, page: 1 });
  };

  const handleFilterChange = (key: string, value: boolean | undefined) => {
    setParams({ ...params, [key]: value, page: 1 });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setParams({ ...params, sortBy, sortOrder });
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleLimitChange = (limit: number) => {
    setParams({ ...params, limit, page: 1 });
  };

  const handleClearAll = () => {
    setParams({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
  };

  const activeFilters: ActiveFilterItem[] = [
    params.search && {
      key: 'search',
      label: 'Search',
      value: params.search,
      onRemove: () => setParams({ ...params, search: undefined, page: 1 }),
    },
    params.isBlocked !== undefined && {
      key: 'isBlocked',
      label: 'Status',
      value: params.isBlocked ? 'Blocked' : 'Active',
      onRemove: () => setParams({ ...params, isBlocked: undefined, page: 1 }),
    },
    params.isVerified !== undefined && {
      key: 'isVerified',
      label: 'Verification',
      value: params.isVerified ? 'Verified' : 'Not Verified',
      onRemove: () => setParams({ ...params, isVerified: undefined, page: 1 }),
    },
  ].filter((filter): filter is ActiveFilterItem => Boolean(filter));

  if (!user) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <SidebarLayout role={user.role}>
      <div className="text-white">
        <h1 className="text-2xl font-semibold mb-6">Trainer Management</h1>

        <TableToolbar>
          <SearchBar
            value={params.search}
            onSearch={handleSearch}
            placeholder="Search trainers by name or email..."
          />

          <div className="flex flex-wrap gap-4">
            <FilterSelect
              label="Status"
              value={params.isBlocked}
              options={[
                { label: 'Active', value: false },
                { label: 'Blocked', value: true },
              ]}
              onChange={(value) => handleFilterChange('isBlocked', value as boolean | undefined)}
              placeholder="All Status"
            />

            <FilterSelect
              label="Verification"
              value={params.isVerified}
              options={[
                { label: 'Verified', value: true },
                { label: 'Not Verified', value: false },
              ]}
              onChange={(value) => handleFilterChange('isVerified', value as boolean | undefined)}
              placeholder="All Verification"
            />

            <SortSelect
              sortBy={params.sortBy || 'createdAt'}
              sortOrder={params.sortOrder || 'desc'}
              sortOptions={[
                { label: 'Date Created', value: 'createdAt' },
                { label: 'Name', value: 'name' },
                { label: 'Email', value: 'email' },
              ]}
              onSortChange={handleSortChange}
            />
          </div>

          <ActiveFilters filters={activeFilters} onClearAll={handleClearAll} />
        </TableToolbar>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <DataTable<AdminGetTrainersResponse>
              columns={trainerColumns}
              data={data.data}
              actions={actions}
            />
            <Pagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              itemName="trainers"
            />
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl mb-2">No trainers found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default AdminTrainerManagement;
