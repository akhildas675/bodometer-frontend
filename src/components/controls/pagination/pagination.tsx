interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  disabled?: boolean;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
//   onItemsPerPageChange,
  disabled = false,
  className = '',
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
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Items per page selector */}
      {/* <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          disabled={disabled}
          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div> */}

      {/* Page info */}
      <div className="text-gray-400 text-sm">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        <button
          onClick={handleFirst}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          title="First page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...' || page === currentPage || disabled}
              className={`px-3 py-1 rounded focus:outline-none ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                  ? 'bg-transparent text-gray-400 cursor-default'
                  : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
              } disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || disabled}
          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>

        {/* Last page button */}
        <button
          onClick={handleLast}
          disabled={currentPage === totalPages || disabled}
          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          title="Last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;