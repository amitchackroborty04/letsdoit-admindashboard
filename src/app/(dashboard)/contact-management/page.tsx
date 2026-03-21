"use client";

import { useState, useEffect } from "react";
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
import ContactInfoModal from "./_components/ContactInfoModal";
import { useSession } from "next-auth/react";

// ── Types ────────────────────────────────────────────────

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
};

type ApiResponse = {
  status: boolean;
  message: string;
  data: {
    items: Contact[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalData: number;
    };
  };
};

// ── Skeleton ─────────────────────────────────────────────

function ContactTableSkeleton() {
  return (
    <Table className="min-w-[920px]">
      <TableHeader>
        <TableRow className="h-[44px] border-b border-[#cfcfcf] hover:bg-transparent">
          <TableHead className="px-7 text-[16px] font-bold text-[#131313]">User Name</TableHead>
          <TableHead className="px-4 text-[16px] font-bold text-[#131313]">Phone Number</TableHead>
          <TableHead className="px-4 text-[16px] font-bold text-[#131313]">Date</TableHead>
          <TableHead className="px-7 text-right text-[16px] font-bold text-[#131313]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRow key={i} className="h-[92px] border-b border-[#d8d8d8]">
            <TableCell className="px-7">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </TableCell>
            <TableCell className="px-4">
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell className="px-4">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell className="px-7">
              <div className="flex justify-end">
                <div className="h-7 w-7 rounded-[4px] bg-gray-200 animate-pulse" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Main Component ───────────────────────────────────────

export default function ContactManagementTable() {
  const { data: session, status } = useSession();

  const PAGE_SIZE = 10;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setSelectedContact(null);
  };

  const fetchContacts = async (page: number) => {
    if (status === "loading") return; 

    setLoading(true);
    setError(null);

    try {
      const token = session?.accessToken;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact?page=${page}&limit=${PAGE_SIZE}`,
        {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      }
      );

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized – please sign in again");
        }
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      const json: ApiResponse = await res.json();

      if (!json.status || !json.data) {
        throw new Error(json.message || "Failed to fetch contacts");
      }

      setContacts(json.data.items.slice(0, PAGE_SIZE));
      setCurrentPage(json.data.paginationInfo.currentPage);
      setTotalPages(json.data.paginationInfo.totalPages);
      setTotalData(json.data.paginationInfo.totalData);
      //eslint-disable-next-line
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while loading contacts");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (status !== "loading") {
      fetchContacts(1);
    }
  }, [status]); // re-run when auth status changes

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchContacts(page);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

  const showPagination = totalPages >= 10;

  return (
    <section className="min-h-screen p-2 sm:p-4 lg:p-5">
      <div className="mx-auto w-full max-w-[1440px] rounded-[4px]">
        {/* Header */}
        <div className="px-4 pt-5 sm:px-6 lg:px-7 lg:pt-5">
          <h1 className="text-[28px] font-semibold leading-none text-[#202020] sm:text-[34px]">
            Contact Managements
          </h1>
          <div className="mt-4 flex items-center gap-3 text-[14px] text-[#8a8a8a]">
            <span>Dashboard</span>
            <span className="text-[#b0b0b0]">›</span>
            <span>Contact Managements</span>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="px-2 pb-6 pt-5 sm:px-4 lg:px-2">
          <div className="overflow-hidden rounded-[8px] border border-[#cfcfcf]">
            <div className="overflow-x-auto">
              {loading ? (
                <ContactTableSkeleton />
              ) : error ? (
                <div className="p-10 text-center text-red-600">
                  <p className="mb-4">Error: {error}</p>
                  <button
                    className="rounded bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
                    onClick={() => fetchContacts(currentPage)}
                  >
                    Try Again
                  </button>
                </div>
              ) : contacts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No contacts found
                </div>
              ) : (
                <Table className="min-w-[920px]">
                  <TableHeader>
                    <TableRow className="h-[44px] border-b border-[#cfcfcf] hover:bg-transparent">
                      <TableHead className="px-7 text-[16px] font-bold text-[#131313]">
                        User Name
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
                    {contacts.map((item) => (
                      <TableRow
                        key={item._id}
                        className="h-[92px] border-b border-[#d8d8d8] hover:bg-transparent"
                      >
                        <TableCell className="px-7">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                              {/* Avatar placeholder – add real image later */}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[16px] font-medium text-[#131313]">
                                {item.name || "—"}
                              </span>
                              <span className="text-sm text-gray-500">
                                {item.email || "—"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 text-[16px] text-[#131313]">
                          {item.phone || "—"}
                        </TableCell>

                        <TableCell className="px-4 text-[16px] text-[#131313]">
                          {formatDate(item.createdAt)}
                        </TableCell>

                        <TableCell className="px-7">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#007a0c] text-white transition hover:opacity-90"
                              onClick={() => {
                                setSelectedContact(item);
                                setIsModalOpen(true);
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
              )}
            </div>

            {/* Footer with conditional pagination */}
            <div className="flex flex-col gap-4 px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
           

              {showPagination && !loading && totalPages > 1 && (
                <>
                   <p className="text-[16px] text-[#666666] whitespace-nowrap">
                {loading
                  ? "Loading contacts..."
                  : contacts.length === 0
                  ? "No results"
                  : `Showing ${contacts.length} of ${totalData} contacts`}
              </p>
                <AppPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                </>
               )} 
            </div>
          </div>
        </div>
      </div>

      <ContactInfoModal
        open={isModalOpen}
        onOpenChange={handleOpenChange}
        contact={selectedContact}
      />
    </section>
  );
}
