"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

  return (
    <Pagination className="justify-end">
      <PaginationContent className="gap-2">
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

        <PaginationItem>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            className={cn(
              "h-8 min-w-8 rounded-[4px] border px-2 text-xs font-medium",
              currentPage === 1
                ? "border-[#FBBF24] bg-[#FBBF24] text-[#111827] hover:bg-[#F5B718]"
                : "border-[#D1D5DB] bg-white text-[#4B5563] hover:bg-[#F8F8F8]"
            )}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {totalPages > 2 && (
          <PaginationItem>
            <PaginationEllipsis className="h-8 min-w-8 rounded-[4px] border border-[#D1D5DB] bg-white text-[#6B7280]" />
          </PaginationItem>
        )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              className="h-8 min-w-8 rounded-[4px] border border-[#D1D5DB] bg-white px-2 text-xs font-medium text-[#4B5563] hover:bg-[#F8F8F8]"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

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
