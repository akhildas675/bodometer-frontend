import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTableFetch } from "@/hooks/useTableFetch";
import userServices from "@/services/user/user.services";
import type { PaginationMeta } from "@/interface/admin.interface";
import type { TrainerListItem } from "@/interface/user.interface";
import {Search, SlidersHorizontal } from "lucide-react";
import Pagination from "@/components/controls/pagination/pagination";

const TRAINER_SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Experience", value: "experienceInYears" },
  { label: "Latest", value: "createdAt" },
];

const UserTrainers = () => {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const {
    data: response,
    loading,
    refetch,
  } = useTableFetch<{ data: TrainerListItem[]; pagination: PaginationMeta }>(
    () =>
      userServices
        .getTrainers(
          currentPage,
          itemsPerPage,
          searchQuery,
          sortField || undefined,
          sortOrder,
        )
        .then((res) => ({
          data: res.data,
          pagination: res.pagination,
        })),
    false,
  );

  useEffect(() => {
    refetch();
  }, [currentPage, searchQuery, sortField, sortOrder, refetch]);

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const trainers = response?.data ?? [];
  const pagination = response?.pagination;

  console.log("trainers page ",trainers)

  return (
   
      <div className="text-white min-h-screen">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <h1 className="text-3xl font-extrabold text-purple-400 tracking-tight">
            Trainers
          </h1>

          <div className="flex items-center gap-3 ml-auto">
            {/* Search Bar */}
            <div className="flex items-center bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 gap-2 w-64">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search"
                className="bg-transparent text-white text-sm placeholder-white/40 outline-none flex-1"
              />
              <button onClick={handleSearch}>
                <Search size={18} className="text-white/60 hover:text-white transition" />
              </button>
            </div>

            {/* Sort / Filter */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu((v) => !v)}
                className="flex items-center gap-2 bg-[#1a1535] border border-purple-700/40 rounded-full px-4 py-2 text-sm text-white/70 hover:text-white transition"
              >
                <SlidersHorizontal size={15} />
                Sort / Filter
              </button>

              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-[#1a1535] border border-purple-700/40 rounded-xl overflow-hidden z-50 shadow-xl">
                  {TRAINER_SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (sortField === opt.value) {
                          setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
                        } else {
                          setSortField(opt.value);
                          setSortOrder("asc");
                        }
                        setCurrentPage(1);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-purple-700/20 ${
                        sortField === opt.value
                          ? "text-purple-400 font-semibold"
                          : "text-white/70"
                      }`}
                    >
                      {opt.label}
                      {sortField === opt.value && (
                        <span className="ml-1 text-xs">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-purple-300 py-20">
            Loading trainers...
          </div>
        ) : !trainers.length ? (
          <div className="text-center text-purple-300 py-20">
            No trainers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer._id}
                className="relative rounded-2xl overflow-hidden border border-purple-700/30 hover:border-purple-500/60 transition group cursor-pointer"
                style={{ height: "380px" }}
                onClick={() => navigate(`/trainers/${trainer.profileId}`)}
              >
                {/* Full Background Image */}
                <img
                  src={trainer.profilePic || "https://via.placeholder.com/400x380?text=No+Photo"}
                  alt={trainer.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay - bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0624] via-[#0a0624]/60 to-transparent" />

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 text-center">
                  {/* Name */}
                  <h3 className="text-white font-extrabold text-xl tracking-widest uppercase mb-1">
                    {trainer.name}
                  </h3>

                  {/* Experience + Rating row */}
                  <div className="flex items-center justify-center gap-4 text-sm mb-2">
                    <span className="text-purple-300 font-medium">
                      {trainer.experienceInYears}+{" "}
                      <span className="text-white/60 font-normal">Experience</span>
                    </span>
                    {/* <span className="flex items-center gap-1 text-white/60">
                      <Star size={13} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white/70">
                        {trainer.rating ?? "4.5"}
                      </span>
                    </span> */}
                  </div>

                  {/* Skills */}
                  {trainer.specializations.length > 0 && (
                    <p className="text-white/50 text-xs mb-4 truncate">
                      {trainer.specializations
                        .slice(0, 4)
                        .map((s) => s.workoutName)
                        .join(", ")}
                      {trainer.specializations.length > 4 && "..."}
                    </p>
                  )}

                  {/* Visit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trainers/${trainer.profileId}`);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-2.5 rounded-xl transition"
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
   
  );
};

export default UserTrainers;