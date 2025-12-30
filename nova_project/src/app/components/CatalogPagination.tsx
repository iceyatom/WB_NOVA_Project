"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

type CatalogPaginationProps = {
  totalItems: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
};

const DEFAULT_PAGE_SIZES = [20, 50, 100];

function normalizePageSizes(
  initialPageSize: number,
  pageSizeOptions: number[],
) {
  const options = new Set(pageSizeOptions);
  options.add(initialPageSize);
  return Array.from(options).sort((a, b) => a - b);
}

export default function CatalogPagination({
  totalItems,
  initialPageSize = 12,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
}: CatalogPaginationProps) {
  const resolvedPageSizes = useMemo(
    () => normalizePageSizes(initialPageSize, pageSizeOptions),
    [initialPageSize, pageSizeOptions],
  );

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <section className="pagination" aria-label="Catalog pagination">
      <div className="pagination__meta">
        <span className="pagination__status">
          Page {currentPage} of {totalPages}
        </span>
        <label className="pagination__size">
          <span>Items per page</span>
          <select value={pageSize} onChange={handlePageSizeChange}>
            {resolvedPageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__nav"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="pagination__pages" role="radiogroup" aria-label="Page">
          {pages.map((page) => (
            <div key={page} className="pagination__page">
              <input
                id={`catalog-page-${page}`}
                type="radio"
                name="catalog-page"
                className="pagination__page-input"
                value={page}
                checked={page === currentPage}
                onChange={() => setCurrentPage(page)}
              />
              <label
                htmlFor={`catalog-page-${page}`}
                className="pagination__page-label"
              >
                {page}
              </label>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="pagination__nav"
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}
