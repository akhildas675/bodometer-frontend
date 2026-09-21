import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  disabled?: boolean;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange: _onItemsPerPageChange,
  disabled = false,
  className = "",
}: PaginationProps) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-xl ${className}`}
    >
      {/* Result stats */}
      <div className="text-xs sm:text-sm text-slate-400">
        Showing <strong className="text-white font-semibold">{startItem}</strong> to{" "}
        <strong className="text-white font-semibold">{endItem}</strong> of{" "}
        <strong className="text-white font-semibold">{totalItems}</strong> results
      </div>

      {/* Pagination button controls */}
      <div className="flex items-center gap-1.5">
        {/* First page button */}
        <button
          type="button"
          onClick={handleFirst}
          disabled={currentPage === 1 || disabled}
          className="p-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              type="button"
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..." || page === currentPage || disabled}
              className={`min-w-[34px] h-[34px] px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                page === currentPage
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40"
                  : page === "..."
                  ? "bg-transparent text-slate-500 cursor-default"
                  : "bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80 cursor-pointer"
              } disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages || disabled}
          className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button */}
        <button
          type="button"
          onClick={handleLast}
          disabled={currentPage >= totalPages || disabled}
          className="p-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;