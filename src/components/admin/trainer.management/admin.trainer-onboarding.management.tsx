import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTrainerOnboardingActions } from "./admin.trainer-onboarding.actions";
import { trainerOnboardingColumns } from "./admin.trainer-onboarding.columns";

import type { TrainerWithProfile } from "@/components/ui/table/table.types";
import type { PaginatedResponse } from "@/interface/admin.interface";

import adminServices from "@/services/admin/admin.services";
import { useAuthStore } from "@/stores/auth.store";
import { useTableFetch } from "@/hooks/useTableFetch";


import DataTable from "@/components/ui/table/data.table";

import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import { extractSortOptions } from "@/components/controls/sort/sort.label";
import Pagination from "@/components/controls/pagination/pagination";
type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

const AdminTrainerOnboardingManagement = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<keyof TrainerWithProfile>>({
    field: '' as keyof TrainerWithProfile,
    order: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: response, loading, refetch } = useTableFetch<PaginatedResponse<TrainerWithProfile>>(
    () =>
      adminServices.getTrainerAppointments({
        search: searchQuery,
        sortBy: sortConfig.field ? String(sortConfig.field) : undefined,
        sortOrder: sortConfig.order,
        page: currentPage,
        limit: itemsPerPage,
        status: filter !== 'all' ? filter : undefined,
      }),
    false
  );

  useEffect(() => {
    refetch();
  }, [searchQuery, sortConfig, currentPage, itemsPerPage, filter, refetch]);

  const handleViewDetails = (trainer: TrainerWithProfile) => {
    navigate(`/admin/appointments/${trainer.profile._id}`);
  };

  const trainerActions = useTrainerOnboardingActions(handleViewDetails);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortConfig<keyof TrainerWithProfile>) => {
    setSortConfig(sort);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((status: FilterStatus) => {
    setFilter(status);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  const sortOptions = extractSortOptions(trainerOnboardingColumns);


  const trainers = response?.data || [];

  if (!user) {
    return (
     
        <div className="text-white p-6">Loading...</div>
     
    );
  }

  return (
 
      <div className="max-w-7xl mx-auto py-8 px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trainer Management</h1>
          <p className="text-slate-400">Review and manage trainer applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="mb-4 flex gap-4">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search trainers by name or email..."
            disabled={loading}
            className="flex-1 max-w-md"
          />
          <SortDropdown<keyof TrainerWithProfile>
            options={sortOptions}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={loading}
            className="w-64"
            placeholder="Sort by..."
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-white">Loading trainers...</p>
        ) : (
          <>
            <DataTable
              columns={trainerOnboardingColumns}
              data={trainers}
              actions={trainerActions}
            />

            {trainers.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                No trainers found for this filter
              </div>
            )}

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
   
  );
};

export default AdminTrainerOnboardingManagement;