/*eslint-disable */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppPagination from "@/components/share/AppPagination";
import InspectorDetailsModal from "./_components/InspectorDetailsModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Inspector, InspectorApiResponse } from "./_types";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const fetchInspectors = async (
  page: number,
  token?: string | null
): Promise<InspectorApiResponse> => {
  const { data } = await axios.get<InspectorApiResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-inspectors`,
    {
      params: { page, limit: PAGE_SIZE },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );

  return data;
};

export default function InspectorManagementTable() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery<
    InspectorApiResponse,
    Error
  >({
    queryKey: ["inspectors", currentPage, PAGE_SIZE],
    queryFn: () => fetchInspectors(currentPage, token),
    placeholderData: keepPreviousData,
    enabled: status !== "loading",
  });

  const inspectors = data?.data.inspectors ?? [];
  const pagination = data?.data.paginationInfo;

  const totalPages = pagination?.totalPages ?? 1;
  const isTableLoading = isLoading || status === "loading";

  const handleApprovalChange = async (
    inspectorId: string,
    isApproved: boolean
  ) => {
    if (!token) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    const actionKey = `${inspectorId}-${isApproved ? "approve" : "remove"}`;
    setActionLoadingId(actionKey);

    try {
      const response = await axios.patch<{ status: boolean; message?: string }>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/inspectors/${inspectorId}/approval`,
        { isApproved },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.status === false) {
        throw new Error(response.data?.message || "Request failed");
      }
      toast.success(
        response.data?.message ||
          (isApproved ? "Inspector approved" : "Inspector removed")
      );
      await refetch();
    } catch (err) {
      let message = "Failed to update inspector status";
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        message = data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Skeleton row
  const SkeletonRow = () => (
    <TableRow className="h-[92px] border-b border-[#d8d8d8]">
      <TableCell className="px-8">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
        </div>
      </TableCell>
      <TableCell className="px-4">
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="px-4">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="px-8">
        <div className="flex justify-end gap-2">
          <div className="h-[28px] w-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-[28px] w-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <section className="min-h-screen p-2 sm:p-4 lg:p-5">
      <div className="w-full rounded-[4px]">
        {/* Header */}
        <div className="px-4 pt-5 sm:px-6 lg:px-9 lg:pt-6">
          <h1 className="text-[28px] font-semibold leading-none text-[#202020] sm:text-[36px]">
            Inspector Management
          </h1>
          <div className="mt-4 flex items-center gap-3 text-[14px] text-[#8a8a8a]">
            <span>Dashboard</span>
            <span className="text-[#b0b0b0]">&gt;</span>
            <span>Inspector Management</span>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-[#cccccc]" />

        {/* Table Content */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow className="h-[44px] border-b border-[#cfcfcf] hover:bg-transparent">
                  <TableHead className="px-8 text-[14px] font-semibold text-[#202020]">
                    Inspector Name
                  </TableHead>
                  <TableHead className="px-4 text-[14px] font-semibold text-[#202020]">
                    Phone
                  </TableHead>
                  <TableHead className="px-4 text-[14px] font-semibold text-[#202020]">
                    Email
                  </TableHead>
                  <TableHead className="px-8 text-right text-[14px] font-semibold text-[#202020]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="[&_tr:last-child]:border-b">
                {isTableLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-red-600">
                        <AlertCircle size={48} />
                        <p className="text-lg font-medium">
                          Failed to load inspectors
                        </p>
                        <p className="text-sm text-muted-foreground">
                   
                          {(error as any)?.message || "Something went wrong"}
                        </p>
                        <button
                          onClick={() => refetch()}
                          className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                          Try Again
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : inspectors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                        <p className="text-lg font-medium">No inspectors found</p>
                        <p className="text-sm">There are no inspectors in the system yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  inspectors.map((item) => (
                    <TableRow
                      key={item._id}
                      className="h-[92px] border-b border-[#d8d8d8] hover:bg-transparent"
                    >
                      <TableCell className="px-8">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-gray-100">
                            {item.profileImage ? (
                              <Image
                                src={item.profileImage}
                                alt={`${item.firstName} ${item.lastName}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 text-xs font-medium">
                                {item.firstName?.[0]}
                                {item.lastName?.[0]}
                              </div>
                            )}
                          </div>
                          <span className="text-[15px] font-medium text-[#222222]">
                            {item.firstName} {item.lastName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-4 text-[15px] text-[#4d4d4d]">
                        {item.phone || "—"}
                      </TableCell>

                      <TableCell className="px-4 text-[15px] text-[#4d4d4d]">
                        {item.email}
                      </TableCell>

                      <TableCell className="px-8">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprovalChange(item._id, true)}
                            disabled={actionLoadingId === `${item._id}-approve`}
                            className="inline-flex h-[28px] items-center rounded-full bg-[#0a990a] px-4 text-[11px] font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApprovalChange(item._id, false)}
                            disabled={actionLoadingId === `${item._id}-remove`}
                            className="inline-flex h-[28px] items-center rounded-full bg-[#ff4f70] px-4 text-[11px] font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                          >
                            Remove
                          </button>

                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#f4bc18] text-white transition hover:opacity-90"
                            onClick={() => {
                              setSelectedInspector(item);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex flex-col gap-4 bg-[#fafafa] px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-9">
            <p className="text-[16px] text-[#666666] text-nowrap">
              {isTableLoading
                ? "Loading..."
                : `Showing ${inspectors.length} of ${pagination?.totalData ?? 0} inspectors`}
            </p>

            {/* {!isTableLoading && !isError && totalPages > 1 && ( */}
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            {/* )} */}
          </div>
        </div>
      </div>

      <InspectorDetailsModal
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedInspector(null);
        }}
        inspector={selectedInspector}
      />
    </section>
  );
}
