"use client";

import { useMemo, useState } from "react";
import { Eye, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useSession } from "next-auth/react";

// Skeleton Row Component (matches your row height and style)
function TransactionSkeleton() {
  return (
    <TableRow className="h-[85px] border-b border-[#D7D7D7] hover:bg-transparent">
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
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="px-4">
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="px-4">
        <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="px-4">
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-[#00800066] rounded-full animate-pulse" />
          <div className="h-7 w-7 bg-[#FBBF24] rounded-[4px] animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );
}

function getInitials(value: string) {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

  if (!cleaned) return "NA";

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString() : "N/A";
}

function formatTime(value?: string) {
  return value
    ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "N/A";
}

function formatDateTime(value?: string) {
  return value ? new Date(value).toLocaleString() : "N/A";
}

type Plan = {
  name: string;
  billingCycle: string;
  price: number;
  title: string;
  features: string[];
  status: string;
};

type Subscription = {
  planId: string;
  startDate: string;
  endDate: string;
};

type Transaction = {
  _id: string;
  email: string;
  hasActiveSubscription: boolean;
  phone: string;
  name?: string;
  avatar?: string;
  subscription: Subscription;
  plan: Plan;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type RecentTransactionsResponse = {
  status: boolean;
  message: string;
  data: {
    totalRevenue: number;
    transactions: Transaction[];
    pagination: Pagination;
  };
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[12px] font-semibold text-[#3b3b3b]">{label}</p>
      <p className="text-[14px] font-medium text-[#1f1f1f]">{value}</p>
    </div>
  );
}

export default function MyCommissionsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const session = useSession();
  const token = session.data?.accessToken;

  const { data, isLoading, error, isFetching } = useQuery<RecentTransactionsResponse>({
    queryKey: ["recent-transactions", currentPage, searchTerm],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/plan/recent-transactions?page=${currentPage}&limit=10${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      return (await res.json()) as RecentTransactionsResponse;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const transactions: Transaction[] = data?.data?.transactions ?? [];
  const totalRevenue = data?.data?.totalRevenue ?? 0;
  const pagination: Pagination = data?.data?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  };

  // Handle search (you can debounce this if needed)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page on search
  };

  const selectedPlan = selectedTransaction?.plan;
  const selectedSubscription = selectedTransaction?.subscription;

  const selectedUserName =
    selectedTransaction?.name ||
    selectedTransaction?.email?.split("@")[0] ||
    "Unknown User";
  const selectedEmail = selectedTransaction?.email || "N/A";
  const selectedPhone = selectedTransaction?.phone || "N/A";
  const selectedStatus = (
    selectedPlan?.status ||
    (selectedTransaction?.hasActiveSubscription ? "active" : "inactive")
  ).toString();

  const statusStyles = useMemo(() => {
    const value = selectedStatus.toLowerCase();
    if (value === "active")
      return "bg-[#00800066] text-[#131313]";
    if (value === "inactive")
      return "bg-[#ff1a1a1a] text-[#b00000]";
    if (value === "pending")
      return "bg-[#FBBF24]/30 text-[#131313]";
    return "bg-[#e5e5e5] text-[#1f1f1f]";
  }, [selectedStatus]);

  return (
    <section className="min-h-screen p-3 sm:p-4 lg:p-5">
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
              ${totalRevenue.toLocaleString()}
            </h3>
          </div>

          <div className="flex w-full max-w-[320px] items-stretch overflow-hidden rounded-[6px] border border-[#A9A9A9] bg-white">
            <Input
              placeholder="Search by Service Name"
              value={searchTerm}
              onChange={handleSearch}
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
                {isLoading || isFetching ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TransactionSkeleton key={i} />
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-red-600">
                      Failed to load transactions. Please try again later.
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-[#666666]">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((item) => {
                    const planName = item.plan?.name || "N/A";
                    const amount = item.plan?.price ? `$${item.plan.price}` : "$0";

                    const displayName =
                      item.name || item.email?.split("@")[0] || "Unknown User";
                    const initials = getInitials(displayName);
                    const phone = item.phone || "N/A";
                    const date = formatDate(item.subscription?.startDate);
                    const time = formatTime(item.subscription?.startDate);
                    const status = (
                      item.plan?.status ||
                      (item.hasActiveSubscription ? "active" : "inactive")
                    ).toString();

                    const statusClass =
                      status.toLowerCase() === "active"
                        ? "bg-[#00800066] text-[#131313]"
                        : status.toLowerCase() === "inactive"
                        ? "bg-[#ff1a1a1a] text-[#b00000]"
                        : "bg-[#e5e5e5] text-[#1f1f1f]";

                    return (
                      <TableRow
                        key={item._id}
                        className="h-[85px] border-b border-[#D7D7D7] hover:bg-transparent"
                      >
                        <TableCell className="px-7">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-[#E7E7E7]">
                              <AvatarImage src={item.avatar || ""} alt={displayName} />
                              <AvatarFallback className="text-[12px] font-semibold text-[#1f1f1f]">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[16px] font-medium text-[#131313]">
                              {displayName}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 text-[16px] text-[#131313]">
                          {planName}
                        </TableCell>

                        <TableCell className="px-4 text-[16px] text-[#131313]">
                          {amount}
                        </TableCell>

                        <TableCell className="px-4 text-[16px] text-[#131313]">
                          {time}
                        </TableCell>

                        <TableCell className="px-4 text-[16px] text-[#131313]">
                          {phone}
                        </TableCell>

                        <TableCell className="px-4 text-[16px] text-[#131313]">
                          {date}
                        </TableCell>

                        <TableCell className="px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-4 py-1 text-[12px] font-medium ${statusClass}`}
                            >
                              {status}
                            </span>

                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#FBBF24] text-white"
                              onClick={() => {
                                setSelectedTransaction(item);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[16px] text-[#666666] text-nowrap">
              Showing {transactions.length} of {pagination.total} results
            </p>

            <AppPagination
              currentPage={currentPage}
              totalPages={pagination.pages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedTransaction(null);
        }}
      >
        <DialogContent className="w-[95vw] max-w-[920px] rounded-[14px] border-0 bg-white p-6 shadow-xl sm:p-8 [&>button]:hidden">
          <DialogClose className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50">
            <X className="h-5 w-5" />
          </DialogClose>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-[26px] font-semibold text-[#2b2b2b]">
              Plan Details
            </DialogTitle>
            <p className="text-[14px] text-[#6a6a6a]">
              Complete subscription and plan information
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[#e7e7e7] bg-[#f9f9f9] p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-[#E7E7E7]">
                  <AvatarImage src={selectedTransaction?.avatar || ""} alt={selectedUserName} />
                  <AvatarFallback className="text-[14px] font-semibold text-[#1f1f1f]">
                    {getInitials(selectedUserName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[16px] font-semibold text-[#1f1f1f]">
                    {selectedUserName}
                  </p>
                  <p className="text-[13px] text-[#6b6b6b]">{selectedEmail}</p>
                </div>
              </div>
              <span
                className={`inline-flex rounded-full px-4 py-1 text-[12px] font-medium ${statusStyles}`}
              >
                {selectedStatus}
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[10px] border border-[#e5e5e5] p-4">
                <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
                  Customer Information
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Name" value={selectedUserName} />
                  <DetailRow label="Phone" value={selectedPhone} />
                  <DetailRow label="Email" value={selectedEmail} />
                  <DetailRow
                    label="Active Subscription"
                    value={selectedTransaction?.hasActiveSubscription ? "Yes" : "No"}
                  />
                </div>
              </div>

              <div className="rounded-[10px] border border-[#e5e5e5] p-4">
                <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
                  Subscription Details
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailRow
                    label="Start Date"
                    value={formatDateTime(selectedSubscription?.startDate)}
                  />
                  <DetailRow
                    label="End Date"
                    value={formatDateTime(selectedSubscription?.endDate)}
                  />
                  <DetailRow
                    label="Plan ID"
                    value={selectedSubscription?.planId || "N/A"}
                  />
                  <DetailRow
                    label="Billing Cycle"
                    value={selectedPlan?.billingCycle || "N/A"}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[10px] border border-[#e5e5e5] p-4">
              <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
                Plan Information
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DetailRow label="Plan Name" value={selectedPlan?.name || "N/A"} />
                <DetailRow label="Plan Title" value={selectedPlan?.title || "N/A"} />
                <DetailRow
                  label="Price"
                  value={
                    selectedPlan?.price != null ? `$${selectedPlan.price}` : "N/A"
                  }
                />
                <DetailRow label="Status" value={selectedPlan?.status || "N/A"} />
              </div>

              <div className="mt-4">
                <p className="text-[12px] font-semibold text-[#3b3b3b]">
                  Features
                </p>
                {selectedPlan?.features?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-[#5b5b5b]">
                    {selectedPlan.features.map((feature: string, index: number) => (
                      <li key={`${feature}-${index}`}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[14px] text-[#6b6b6b]">
                    No features listed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
