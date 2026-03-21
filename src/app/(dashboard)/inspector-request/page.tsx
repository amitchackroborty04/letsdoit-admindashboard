"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppPagination from "@/components/share/AppPagination";

const jobs = [
  {
    id: 1,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: true,
  },
  {
    id: 2,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: true,
  },
  {
    id: 3,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: false,
  },
  {
    id: 4,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: false,
  },
  {
    id: 5,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: false,
  },
  {
    id: 6,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: false,
  },
  {
    id: 7,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: false,
  },
  {
    id: 8,
    name: "Haris wiketstion",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    inspectionLevel: "Basic Inspection",
    vehicle: "2013 Lexus Gx",
    location: "Location: 1541 Maryland Avenue Saint Paul",
    phone: "+02463245",
    date: "12/10/13",
    reportDisabled: false,
  },
];

export default function InspectorJobsPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-3 py-3 md:px-4">
      <div className="w-full">
        {/* Header */}
        <div className="px-1">
          <h1 className="text-[18px] font-semibold text-[#222222] md:text-[24px]">
            Inspector Jobs
          </h1>

          <div className="mt-2 flex items-center gap-2 text-[16px] text-[#9b9b9b]">
            <span>Dashboard</span>
            <span>{">"}</span>
            <span>Inspector Jobs</span>
          </div>
        </div>

        {/* Table Card */}
        <div className="mt-4 overflow-hidden rounded-[6px] border border-[#B6B6B6] ">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#cfcfcf] hover:bg-transparent">
                <TableHead className="h-[48px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  User Name
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  Inspection Level
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  Vehicle
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  Location
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  Phone Number
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  Date
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-center text-[16px] font-medium text-[#1f1f1f]">
                  View Jobs
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  Assign a Inspector
                </TableHead>
                <TableHead className="h-[28px] whitespace-nowrap px-3 text-[16px] font-medium text-[#1f1f1f]">
                  Repots
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {jobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="border-b border-[#d9d9d9] hover:bg-transparent"
                >
                  <TableCell className="px-3 py-4">
                    <div className="flex min-w-[150px] items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={job.avatar}
                          alt={job.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-[16px] font-normal text-[#333333]">
                        {job.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-3 py-4 text-[16px] text-[#333333]">
                    <span className="whitespace-nowrap">{job.inspectionLevel}</span>
                  </TableCell>

                  <TableCell className="px-3 py-4 text-[16px] text-[#333333]">
                    <span className="whitespace-nowrap">{job.vehicle}</span>
                  </TableCell>

                  <TableCell className="px-3 py-4 text-[14px] leading-[15px] text-[#5f5f5f]">
                    <div className="max-w-[140px]">{job.location}</div>
                  </TableCell>

                  <TableCell className="px-3 py-4 text-[16px] text-[#5f5f5f]">
                    {job.phone}
                  </TableCell>

                  <TableCell className="px-3 py-4 text-[16px] text-[#5f5f5f]">
                    {job.date}
                  </TableCell>

                  <TableCell className="px-3 py-4 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center text-[#2b2b2b]"
                    >
                      <Eye  className="w-5 h-5" />
                    </button>
                  </TableCell>

                  <TableCell className="px-3 py-4">
                    <Select defaultValue="select-name">
                      <SelectTrigger className="h-[44px] w-[150px] rounded-[6px] border border-[#484848] px-3 text-[16px] text-[#9d9d9d] shadow-none focus:ring-0">
                        <SelectValue placeholder="Select name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-name">Select name</SelectItem>
                        <SelectItem value="john">John</SelectItem>
                        <SelectItem value="alex">Alex</SelectItem>
                        <SelectItem value="mike">Mike</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="px-3 py-4">
                    <button
                      type="button"
                      disabled={job.reportDisabled}
                      className={`h-[44px] rounded-[6px] px-4 text-[16px] font-medium ${
                        job.reportDisabled
                          ? "cursor-not-allowed bg-[#d9d9d9] text-[#8e8e8e]"
                          : "bg-[#FBBF24] text-[#131313]"
                      }`}
                    >
                      See Report
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer */}
          <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[16px] text-[#7d7d7d] text-nowrap">Showing 1 to 5 of 12 results</p>

            {/* your previous reusable pagination component */}
            <AppPagination
              currentPage={1}
              totalPages={50}
              onPageChange={(page) => console.log(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}