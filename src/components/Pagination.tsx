import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <div>
        <label htmlFor="pageSize" className="mr-2">Restaurants per page:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={onPageSizeChange}
          className="border border-gray-300 p-2 rounded text-gray-900"
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="mx-1 px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-2">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="mx-1 px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;