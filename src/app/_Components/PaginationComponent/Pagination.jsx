import React from 'react'
import IconButton from './IconButton';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import PageButton from './PageButton';
import getCompactPages from './getCompactPages';

function Pagination({ meta, onPageChange }) {
  // guard: nothing to paginate
  if (!meta || typeof meta !== "object" || (meta.totalPages ?? 0) <= 1)
    return null;

  const {
    page,
    total,
    limit,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
  } = meta;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = getCompactPages(page, totalPages);

  const goFirst = () => onPageChange?.(1);
  const goPrev = () => hasPrev && onPageChange?.(prevPage || page - 1);
  const goNext = () => hasNext && onPageChange?.(nextPage || page + 1);
  const goLast = () => onPageChange?.(totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full p-2">
      <div className="text-xs text-gray-700">
        Showing <span className="font-medium">{start}</span>–
        {/* <span className="font-medium">{end}</span>  */}
        {/* of{" "} */}
        <span className="font-medium">{total}</span>
      </div>

      <div className="flex items-center gap-1">
        <IconButton onClick={goFirst} disabled={!hasPrev} title="First">
          <ChevronsLeft className="h-4 w-4 cursor-pointer" />
        </IconButton>
        <IconButton onClick={goPrev} disabled={!hasPrev} title="Previous">
          <ChevronLeft className="h-4 w-4 cursor-pointer" />
        </IconButton>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-gray-400 select-none cursor-pointer"
            >
              …
            </span>
          ) : (
            <PageButton
              key={p}
              active={p === page}
              onClick={() => onPageChange?.(p)}
            >
              {p}
            </PageButton>
          )
        )}

        <IconButton onClick={goNext} disabled={!hasNext} title="Next">
          <ChevronRight className="h-4 w-4 cursor-pointer" />
        </IconButton>
        <IconButton onClick={goLast} disabled={!hasNext} title="Last">
          <ChevronsRight className="h-4 w-4 cursor-pointer" />
        </IconButton>
      </div>
    </div>
  );
}
export default Pagination
