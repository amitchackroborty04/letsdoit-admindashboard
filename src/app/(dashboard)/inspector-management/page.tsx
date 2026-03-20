"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
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

const dealershipData = [
  {
    id: 1,
    name: "John Smith",
    avatar: "/avatar.png",
    date: "15/8/2025",
    email: "example@gmail.com",
    status: "Approved",
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "/avatar.png",
    date: "15/8/2025",
    email: "example@gmail.com",
    status: "Approved",
  },
  {
    id: 3,
    name: "John Smith",
    avatar: "/avatar.png",
    date: "15/8/2025",
    email: "example@gmail.com",
    status: "Approved",
  },
  {
    id: 4,
    name: "John Smith",
    avatar: "/avatar.png",
    date: "15/8/2025",
    email: "example@gmail.com",
    status: "Approved",
  },
  {
    id: 5,
    name: "John Smith",
    avatar: "/avatar.png",
    date: "15/8/2025",
    email: "example@gmail.com",
    status: "Approved",
  },
  {
    id: 6,
    name: "John Smith",
    avatar: "/avatar.png",
    date: "15/8/2025",
    email: "example@gmail.com",
    status: "Approved",
  },
  {
    id: 7,
    name: "John Smith",
    avatar: "/avatar.png",
    date: "15/8/2025",
    email: "example@gmail.com",
    status: "Approved",
  },
];

export default function DealershipManagementTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDealership, setSelectedDealership] = useState<
    (typeof dealershipData)[number] | null
  >(null);

  return (
    <section className="min-h-screen  p-2 sm:p-4 lg:p-5">
      <div className=" w-full  rounded-[4px] ">
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

        {/* Divider */}
        <div className="mt-6 h-px w-full bg-[#cccccc]" />

        {/* Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow className="h-[44px] border-b border-[#cfcfcf] hover:bg-transparent">
                  <TableHead className="px-8 text-[14px] font-semibold text-[#202020]">
                    Dealership Name
                  </TableHead>
                  <TableHead className="px-4 text-[14px] font-semibold text-[#202020]">
                    Date
                  </TableHead>
                  <TableHead className="px-4 text-[14px] font-semibold text-[#202020]">
                    Email
                  </TableHead>
                  <TableHead className="px-8 text-right text-[14px] font-semibold text-[#202020]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dealershipData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="h-[92px] border-b border-[#d8d8d8] hover:bg-transparent"
                  >
                    <TableCell className="px-8">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-full">
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[15px] font-medium text-[#222222]">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 text-[15px] text-[#4d4d4d]">
                      {item.date}
                    </TableCell>

                    <TableCell className="px-4 text-[15px] text-[#4d4d4d]">
                      {item.email}
                    </TableCell>

                    <TableCell className="px-8">
                      <div className="flex items-center justify-end gap-2">
                        <span className="inline-flex h-[28px] items-center rounded-full bg-[#0a990a] px-4 text-[11px] font-medium text-white">
                          Approved
                        </span>

                        <button
                          type="button"
                          className="inline-flex h-[28px] items-center rounded-full bg-[#ff4f70] px-4 text-[11px] font-medium text-white transition hover:opacity-90"
                        >
                          Remove
                        </button>

                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#f4bc18] text-white transition hover:opacity-90"
                          onClick={() => {
                            setSelectedDealership(item);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 bg-[#fafafa] px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-9">
            <p className="text-[16px] text-[#666666] text-nowrap">
              Showing 1 to 5 of 12 results
            </p>

            <AppPagination
              currentPage={currentPage}
              totalPages={8}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <InspectorDetailsModal
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedDealership(null);
        }}
        dealership={selectedDealership}
      />
    </section>
  );
}
