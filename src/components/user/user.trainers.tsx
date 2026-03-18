// pages/user/trainers/user-trainers.page.tsx
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";
import { useAuthStore } from "@/stores/auth.store";
import { useTableFetch } from "@/hooks/useTableFetch";
import SearchBar from "@/components/controls/search/search";
import SortDropdown, { type SortConfig } from "@/components/controls/sort/sort";
import Pagination from "@/components/controls/pagination/pagination";
import userServices from "@/services/user/user.services";
import type { PaginationMeta } from "@/interface/admin.interface";
import type { TrainerListItem } from "@/interface/user.interface";
import { Dumbbell, Star } from "lucide-react";

const TRAINER_SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Experience", value: "experienceInYears" },
  { label: "Latest", value: "createdAt" },
];

const UserTrainers = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<string>>({
    field: "",
    order: "asc",
  });

  const { data: response, loading, refetch } =
    useTableFetch<{ data: TrainerListItem[]; pagination: PaginationMeta }>(
      () =>
        userServices
          .getTrainers(
            currentPage,
            itemsPerPage,
            searchQuery,
            sortConfig.field || undefined,
            sortConfig.order,
          )
          .then((res) => ({
            data: res.data,
            pagination: res.pagination,
          })),
      false,
    );

  useEffect(() => {
    refetch();
  }, [currentPage, searchQuery, sortConfig, refetch]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortConfig<string>) => {
    setSortConfig(sort);
    setCurrentPage(1);
  }, []);

  const trainers = response?.data ?? [];
  const pagination = response?.pagination;

  return (
    <SidebarLayout role={user?.role || "user"}>
      <div className="text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Trainers</h1>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-3 mb-6">
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            placeholder="Search trainers by name..."
            disabled={loading}
            className="flex-1 max-w-md"
          />
          <SortDropdown<string>
            options={TRAINER_SORT_OPTIONS}
            value={sortConfig}
            onSortChange={handleSortChange}
            disabled={loading}
            className="w-56"
            placeholder="Sort by..."
          />
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="text-center text-purple-300 py-20">
            Loading trainers...
          </div>
        ) : !trainers.length ? (
          <div className="text-center text-purple-300 py-20">
            No trainers found.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer._id}
                className="bg-gradient-to-b from-[#140b3a] to-[#0a0624] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition"
              >
                {/* Cover + Avatar */}
                <div className="relative h-28 bg-gradient-to-r from-purple-900 to-indigo-900">
                  <div className="absolute -bottom-8 left-4">
                    <img
                      src={trainer.profilePic || "https://via.placeholder.com/80"}
                      alt={trainer.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-10 px-4 pb-4">
                  <h3 className="text-white font-bold text-lg truncate">
                    {trainer.name}
                  </h3>

                  {/* Experience */}
                  <div className="flex items-center gap-1 text-purple-300 text-sm mt-1">
                    <Star size={14} className="text-yellow-400" />
                    <span>{trainer.experienceInYears} yrs experience</span>
                  </div>

                  {/* Bio */}
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                    {trainer.bio || "No bio provided"}
                  </p>

                  {/* Specializations */}
                  {trainer.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {trainer.specializations.slice(0, 3).map((spec) => (
                        <span
                          key={spec._id}
                          className="flex items-center gap-1 px-2 py-0.5 bg-indigo-800/60 text-indigo-300 rounded-full text-xs"
                        >
                          <Dumbbell size={10} />
                          {spec.workoutName}
                        </span>
                      ))}
                      {trainer.specializations.length > 3 && (
                        <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded-full text-xs">
                          +{trainer.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Visit Button */}
                  <button
                    onClick={() => navigate(`/trainers/${trainer._id}`)}
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg transition"
                  >
                    Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="mt-10">
            <Pagination
              currentPage={Number(pagination.currentPage)}
              totalPages={Number(pagination.totalPages)}
              totalItems={Number(pagination.totalItems)}
              itemsPerPage={Number(pagination.itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={() => {}}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default UserTrainers;