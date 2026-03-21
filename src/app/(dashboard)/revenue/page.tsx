"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppPagination from "@/components/share/AppPagination";

const commissionsData = [
  {
    id: 1,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
  {
    id: 2,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
  {
    id: 3,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
  {
    id: 4,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
  {
    id: 5,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
  {
    id: 6,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
  {
    id: 7,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
  {
    id: 8,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    plan: "Plan 1",
    amount: "$333",
    time: "+02463245",
    phone: "+02463245",
    date: "11/7/16",
    status: "Successfull",
  },
];

export default function MyCommissionsTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="min-h-screen  p-3 sm:p-4 lg:p-5">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[30px] font-semibold leading-none text-[#1F1F1F]">
              My Commissions
            </h2>
          </div>

          
        </div>

        {/* Top row */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-[430px] rounded-[6px] bg-[#007300] px-6 py-5">
            <p className="text-[18px] font-medium text-white">Total Revenue</p>
            <h3 className="mt-2 text-[50px] font-semibold leading-none text-white">
              $132,570.00
            </h3>
          </div>

          <div className="flex w-full max-w-[320px] items-stretch overflow-hidden rounded-[6px] border border-[#A9A9A9] bg-white">
            <Input
              placeholder="Search by  Service Name"
              className="h-[48px] border-0 bg-transparent text-[13px] text-[#222] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button className="h-[48px] rounded-none rounded-r-[6px] bg-[#F4BC18] px-4 text-[#1F1F1F] hover:bg-[#E8B010]">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-[8px] border border-[#CFCFCF] bg-white">
          <div className="overflow-x-auto">
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow className="border-b border-[#CFCFCF] hover:bg-transparent">
                  <TableHead className="h-[46px] px-7 text-[16px] font-bold text-[#131313]">
                    User Name
                  </TableHead>
                  <TableHead className="h-[46px] px-4 text-[16px] font-bold text-[#131313]">
                    Plan
                  </TableHead>
                  <TableHead className="h-[46px] px-4 text-[16px] font-bold text-[#131313]">
                    Amount
                  </TableHead>
                  <TableHead className="h-[46px] px-4 text-[16px] font-bold text-[#131313]">
                    Time
                  </TableHead>
                  <TableHead className="h-[46px] px-4 text-[16px] font-bold text-[#131313]">
                    Phone Number
                  </TableHead>
                  <TableHead className="h-[46px] px-4 text-[16px] font-bold text-[#131313]">
                    Date
                  </TableHead>
                  <TableHead className="h-[46px] px-4 text-[16px] font-bold text-[#131313]">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {commissionsData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="h-[85px] border-b border-[#D7D7D7] hover:bg-transparent"
                  >
                    <TableCell className="px-7">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={item.avatar}
                            alt={item.userName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[16px] font-medium text-[#131313]">
                          {item.userName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 text-[16px] text-[#131313]">
                      {item.plan}
                    </TableCell>

                    <TableCell className="px-4 text-[16px] text-[#131313]">
                      {item.amount}
                    </TableCell>

                    <TableCell className="px-4 text-[16px] text-[#131313]">
                      {item.time}
                    </TableCell>

                    <TableCell className="px-4 text-[16px] text-[#131313]">
                      {item.phone}
                    </TableCell>

                    <TableCell className="px-4 text-[16px] text-[#131313]">
                      {item.date}
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex rounded-full bg-[#00800066] px-4 py-1 text-[12px] font-medium text-[#131313]">
                          {item.status}
                        </span>

                        <button className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#FBBF24] text-white">
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
          <div className="flex flex-col gap-4 px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[16px] text-[#666666] text-nowrap">
              Showing 1 to 5 of 12 results
            </p>

            <AppPagination
              currentPage={currentPage}
              totalPages={50}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}