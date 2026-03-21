"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type AppPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export default function AppPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AppPaginationProps) {
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="justify-end">
      <PaginationContent className="gap-2 flex-wrap">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (isPrevDisabled) return;
              handlePageChange(currentPage - 1);
            }}
            className={cn(
              "h-8 w-8 rounded-[4px] border px-0 text-[#6B7280] [&>span]:hidden",
              isPrevDisabled
                ? "border-[#D1D5DB] bg-[#F3F4F6] text-[#9CA3AF] pointer-events-none"
                : "border-[#9CA3AF] bg-white hover:bg-[#F8F8F8]"
            )}
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={currentPage === page}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              className={cn(
                "h-8 min-w-8 rounded-[4px] border px-2 text-xs font-medium",
                currentPage === page
                  ? "border-[#FBBF24] bg-[#FBBF24] text-[#111827] hover:bg-[#F5B718]"
                  : "border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-[#F8F8F8]"
              )}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (isNextDisabled) return;
              handlePageChange(currentPage + 1);
            }}
            className={cn(
              "h-8 w-8 rounded-[4px] border px-0 text-[#6B7280] [&>span]:hidden",
              isNextDisabled
                ? "border-[#D1D5DB] bg-[#F3F4F6] text-[#9CA3AF] pointer-events-none"
                : "border-[#9CA3AF] bg-white hover:bg-[#F8F8F8]"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
