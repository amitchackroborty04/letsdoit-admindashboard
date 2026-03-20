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

const contactData = [
  {
    id: 1,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
  {
    id: 2,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
  {
    id: 3,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
  {
    id: 4,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
  {
    id: 5,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
  {
    id: 6,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
  {
    id: 7,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
  {
    id: 8,
    userName: "Haris wiket­sion",
    avatar: "/avatar.png",
    vehicle: "2013 Lexus Gx",
    phone: "+02463245",
    date: "12/10/13",
  },
];

export default function ContactManagementTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="min-h-screen  p-2 sm:p-4 lg:p-5">
      <div className="mx-auto w-full max-w-[1440px] rounded-[4px] ">
        {/* Header */}
        <div className="px-4 pt-5 sm:px-6 lg:px-7 lg:pt-5">
          <h1 className="text-[28px] font-semibold leading-none text-[#202020] sm:text-[34px]">
            Contact Managements
          </h1>

          <div className="mt-4 flex items-center gap-3 text-[14px] text-[#8a8a8a]">
            <span>Dashboard</span>
            <span className="text-[#b0b0b0]">&gt;</span>
            <span>Contact Managements</span>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="px-2 pb-6 pt-5 sm:px-4 lg:px-2">
          <div className="overflow-hidden rounded-[8px] border border-[#cfcfcf] ">
            <div className="overflow-x-auto">
              <Table className="min-w-[920px]">
                <TableHeader>
                  <TableRow className="h-[44px] border-b border-[#cfcfcf] hover:bg-transparent">
                    <TableHead className="px-7 text-[16px] font-bold text-[#131313]">
                      User Name
                    </TableHead>
                    <TableHead className="px-4 text-[16px] font-bold text-[#131313]">
                      Vehicle
                    </TableHead>
                    <TableHead className="px-4 text-[16px] font-bold text-[#131313]">
                      Phone Number
                    </TableHead>
                    <TableHead className="px-4 text-[16px] font-bold text-[#131313]">
                      Date
                    </TableHead>
                    <TableHead className="px-7 text-right text-[16px] font-bold text-[#131313]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {contactData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="h-[92px] border-b border-[#d8d8d8] hover:bg-transparent"
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
                        {item.vehicle}
                      </TableCell>

                      <TableCell className="px-4 text-[16px] text-[#131313]">
                        {item.phone}
                      </TableCell>

                      <TableCell className="px-4 text-[16px] text-[#131313]">
                        {item.date}
                      </TableCell>

                      <TableCell className="px-7">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#007a0c] text-white transition hover:opacity-90"
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
      </div>
    </section>
  );
}