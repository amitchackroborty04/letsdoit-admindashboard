"use client";

import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; 
import AppPagination from "@/components/share/AppPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import InspectionReportModal from "./_components/InspectionReportModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Customer {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  profileImage?: string | null;
}

interface InspectorAddress {
  StreetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  taxId?: string | null;
}

interface InspectorProfile {
  yearsOfExperience?: string | null;
  aseCertificationNumber?: string | null;
  certificationsAndTraining?: string | null;
  currentEmployer?: string | null;
  contractorStatus?: string | null;
  availableHoursPerWeek?: string | null;
  preferredServiceAreas?: string[];
  hasReliableTransportation?: boolean | null;
  availableOnWeekends?: boolean | null;
  criminalBackground?: string | null;
  drivingRecord?: string | null;
  professionalReferences?: string | null;
  motivation?: string | null;
  additionalSkills?: string | null;
  isApproved?: boolean | null;
}

interface InspectorSubscription {
  planId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

interface InspectorSearchUsage {
  used?: number | null;
  resetDate?: string | null;
}

interface Inspector {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  dob?: string | null;
  gender?: string | null;
  role?: string | null;
  stripeAccountId?: string | null;
  bio?: string | null;
  address?: InspectorAddress | null;
  inspectorProfile?: InspectorProfile | null;
  profileImage?: string | null;
  multiProfileImage?: string[] | null;
  pdfFile?: string | null;
  otp?: string | null;
  otpExpires?: string | null;
  otpVerified?: boolean | null;
  resetExpires?: string | null;
  isVerified?: boolean | null;
  refreshToken?: string | null;
  hasActiveSubscription?: boolean | null;
  subscriptionExpireDate?: string | null;
  blockedUsers?: string[] | null;
  language?: string | null;
  createdAt?: string | null;
  subscription?: InspectorSubscription | null;
  searchUsage?: InspectorSearchUsage | null;
}

interface Booking {
  _id: string;
  customer: Customer;
  inspector: Inspector | null;
  date: string;
  year: number;
  make: string;
  model: string;
  vin: string;
  vehicleLocation: string;
  message: string;
  status?: string;
  jobStatus?: string;
  assignmentStatus?: string;
  numberPlate?: string;
  checklist?: { _id?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: Booking[];
}

interface InspectorsApiResponse {
  status: boolean;
  message: string;
  data?: {
    inspectors?: Inspector[];
    paginationInfo?: {
      currentPage?: number;
      totalPages?: number;
      totalData?: number;
      hasNextPage?: boolean;
      hasPrevPage?: boolean;
    };
  };
}

interface AssignInspectorPayload {
  bookingId: string;
  inspectorId: string;
}


export default function InspectorJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportChecklistId, setReportChecklistId] = useState<string | null>(
    null
  );
  const itemsPerPage = 10; 
  const session = useSession();
  const token=session?.data?.accessToken
  const queryClient = useQueryClient();


  const fetchBookings = async (): Promise<Booking[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking-inspect`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch bookings");
    }

    const json: ApiResponse | { data?: { bookings?: Booking[] } } =
      await res.json();

    if (Array.isArray(json?.data)) {
      return json.data;
    }

    if (Array.isArray(json?.data?.bookings)) {
      return json.data.bookings;
    }

    return [];
  };

  const fetchInspectors = async (): Promise<Inspector[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-inspectors?isApproved=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch inspectors");
    }

    const json: InspectorsApiResponse = await res.json();

    if (json?.status === false) {
      throw new Error(json?.message || "Failed to fetch inspectors");
    }

    return Array.isArray(json?.data?.inspectors) ? json.data.inspectors : [];
  };

  const { data: bookings = [], isLoading, error } = useQuery<Booking[]>({
    queryKey: ["bookings", token],
    queryFn: fetchBookings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!token,
  });

  const {
    data: inspectors = [],
    isLoading: inspectorsLoading,
    error: inspectorsError,
  } = useQuery<Inspector[]>({
    queryKey: ["inspectors", token],
    queryFn: fetchInspectors,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });

  console.log(inspectors)


  const { mutate: assignInspector, isPending: isAssigning } = useMutation({
    mutationFn: async ({ bookingId, inspectorId }: AssignInspectorPayload) => {
      if (!token) {
        throw new Error("You must be logged in to perform this action");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking-inspect/${bookingId}/assign-inspector`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ inspectorId }),
        }
      );

      let json: { status?: boolean; message?: string } | null = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok || json?.status === false) {
        throw new Error(json?.message || "Failed to assign inspector");
      }

      return json;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Inspector assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to assign inspector";
      toast.error(message);
    },
  });

  // Client-side pagination (you can move to server-side later if needed)
  const paginatedData = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log(paginatedData)

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  // Helper to build full name
  const getFullName = (customer: Customer) => {
    const first = customer.firstName?.trim() || "";
    const last = customer.lastName?.trim() || "";
    return first || last ? `${first} ${last}`.trim() : "Unknown User";
  };

  const getCustomerDisplayName = (customer: Customer) => {
    const fullName = getFullName(customer);
    if (fullName !== "Unknown User") return fullName;
    if (customer.email) return customer.email.split("@")[0] || customer.email;
    if (customer.phone) return customer.phone;
    return "Unknown User";
  };

  const getInitials = (name: string) => {
    const letters = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .filter(Boolean)
      .join("");
    return letters || "U";
  };

  const getInspectorName = (inspector: Inspector) => {
    const first = inspector.firstName?.trim() || "";
    const last = inspector.lastName?.trim() || "";
    if (first || last) return `${first} ${last}`.trim();
    if (inspector.email) return inspector.email;
    if (inspector.phone) return inspector.phone;
    return "Unnamed Inspector";
  };

  const formatDateTime = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-US");
  };

  const truncateText = (value: string, max: number) => {
    if (value.length <= max) return value;
    return `${value.slice(0, max)}...`;
  };

  const handleAssignInspector = (bookingId: string, inspectorId: string) => {
    if (!inspectorId || inspectorId === "select-name") return;
    assignInspector({ bookingId, inspectorId });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleOpenReport = (checklistId: string) => {
    setReportChecklistId(checklistId);
    setIsReportOpen(true);
  };

  // Vehicle display
  const getVehicle = (booking: Booking) => {
    return `${booking.year} ${booking.make} ${booking.model}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] px-3 py-3 md:px-4 flex items-center justify-center">
        <div className="text-red-600">Error loading jobs: {(error as Error).message}</div>
      </div>
    );
  }

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
        <div className="mt-4 overflow-hidden rounded-[6px] border border-[#B6B6B6]">
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
                  Reports
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="[&_tr:last-child]:!border-b">
              {isLoading ? (
                // Skeleton rows - matching your dummy table structure
                Array.from({ length: 8 }).map((_, idx) => (
                  <TableRow
                    key={idx}
                    className="border-b border-[#d9d9d9] hover:bg-transparent"
                  >
                    <TableCell className="px-3 py-4">
                      <div className="flex min-w-[150px] items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <Skeleton className="h-5 w-36" />
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="px-3 py-4 text-center">
                      <Skeleton className="h-5 w-5 mx-auto" />
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <Skeleton className="h-[44px] w-[150px] rounded-[6px]" />
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <Skeleton className="h-[44px] w-28 rounded-[6px]" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                paginatedData.map((booking) => {
                  const displayName = getCustomerDisplayName(booking.customer);
                  const initials = getInitials(displayName);
                  const vehicle = getVehicle(booking);
                  const vehicleLabel = truncateText(vehicle, 10);
                  const checklistId = booking.checklist?._id ?? "";
                  const reportDisabled = !checklistId;

                  return (
                    <TableRow
                      key={booking._id}
                      className="border-b border-[#d9d9d9] hover:bg-transparent"
                    >
                      <TableCell className="px-3 py-4">
                        <div className="flex min-w-[150px] items-center gap-2">
                          <Avatar className="h-8 w-8 border border-[#e3e3e3]">
                            <AvatarImage
                              src={booking.customer.profileImage || ""}
                              alt={displayName}
                            />
                            <AvatarFallback className="text-[11px] font-semibold text-[#1f1f1f]">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[16px] font-normal text-[#333333]">
                            {displayName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-3 py-4 text-[16px] text-[#333333]">
                        <span className="whitespace-nowrap">Basic Inspection</span> {/* Adjust if API provides level */}
                      </TableCell>

                      <TableCell className="px-3 py-4 text-[16px] text-[#333333]">
                        <span className="whitespace-nowrap" title={vehicle}>
                          {vehicleLabel}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-4 text-[14px] leading-[15px] text-[#5f5f5f]">
                        <div className="max-w-[140px]">{booking.vehicleLocation}</div>
                      </TableCell>

                      <TableCell className="px-3 py-4 text-[16px] text-[#5f5f5f]">
                        N/A {/* API doesn't provide phone – add if backend adds it later */}
                      </TableCell>

                      <TableCell className="px-3 py-4 text-[16px] text-[#5f5f5f]">
                        {new Date(booking.date).toLocaleDateString("en-US")}
                      </TableCell>

                      <TableCell className="px-3 py-4 text-center">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center text-[#2b2b2b]"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </TableCell>

                      <TableCell className="px-3 py-4">
                        <Select
                          key={`${booking._id}-${booking.inspector?._id ?? "none"}`}
                          defaultValue={booking.inspector?._id ?? "select-name"}
                          onValueChange={(value) =>
                            handleAssignInspector(booking._id, value)
                          }
                          disabled={isAssigning}
                        >
                          <SelectTrigger className="h-[44px] w-[150px] rounded-[6px] border border-[#484848] px-3 text-[16px] text-[#9d9d9d] shadow-none focus:ring-0">
                            <SelectValue placeholder="Select name" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="select-name">Select name</SelectItem>
                            {inspectorsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading inspectors...
                              </SelectItem>
                            ) : inspectorsError ? (
                              <SelectItem value="error" disabled>
                                Failed to load inspectors
                              </SelectItem>
                            ) : inspectors.length === 0 ? (
                              <SelectItem value="empty" disabled>
                                No inspectors found
                              </SelectItem>
                            ) : (
                              inspectors.map((inspector) => (
                                <SelectItem key={inspector._id} value={inspector._id}>
                                  {getInspectorName(inspector)}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="px-3 py-4">
                        <button
                          type="button"
                          disabled={reportDisabled}
                          className={`h-[44px] rounded-[6px] px-4 text-[16px] font-medium ${
                            reportDisabled
                              ? "cursor-not-allowed bg-[#d9d9d9] text-[#8e8e8e]"
                              : "bg-[#FBBF24] text-[#131313]"
                          }`}
                          onClick={() => handleOpenReport(checklistId)}
                        >
                          See Report
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Footer */}
          <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[16px] text-[#7d7d7d] text-nowrap">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, bookings.length)} of{" "}
              {bookings.length} results
            </p>

            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedBooking(null);
        }}
      >
        <DialogContent className="max-w-2xl border border-[#d6d6d6] bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold text-[#1f1f1f]">
              Inspection Job Details
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#6f6f6f]">
              View booking, customer, vehicle, and assignment info.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking ? (
            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-md border border-[#e2e2e2] p-4">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Customer
                </p>
                <p className="mt-1 text-[16px] font-medium text-[#2b2b2b]">
                  {getFullName(selectedBooking.customer)}
                </p>
              </div>

              <div className="rounded-md border border-[#e2e2e2] p-4">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Inspector
                </p>
                <p className="mt-1 text-[16px] font-medium text-[#2b2b2b]">
                  {selectedBooking.inspector
                    ? getInspectorName(selectedBooking.inspector)
                    : "Not assigned"}
                </p>
              </div>

              <div className="rounded-md border border-[#e2e2e2] p-4">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Vehicle
                </p>
                <p className="mt-1 text-[16px] font-medium text-[#2b2b2b]">
                  {getVehicle(selectedBooking)}
                </p>
                <p className="mt-1 text-[14px] text-[#5f5f5f]">
                  VIN: {selectedBooking.vin || "N/A"}
                </p>
              </div>

              <div className="rounded-md border border-[#e2e2e2] p-4">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Status
                </p>
                <div className="mt-2 inline-flex items-center rounded-full bg-[#f1f1f1] px-3 py-1 text-[14px] font-medium text-[#3f3f3f]">
                  {selectedBooking.status || "N/A"}
                </div>
                <p className="mt-3 text-[14px] text-[#5f5f5f]">
                  Inspection Date:{" "}
                  {formatDateTime(selectedBooking.date)}
                </p>
              </div>

              <div className="rounded-md border border-[#e2e2e2] p-4 md:col-span-2">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Location
                </p>
                <p className="mt-1 text-[15px] text-[#3b3b3b]">
                  {selectedBooking.vehicleLocation || "N/A"}
                </p>
              </div>

              <div className="rounded-md border border-[#e2e2e2] p-4 md:col-span-2">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Message
                </p>
                <p className="mt-1 text-[15px] text-[#3b3b3b]">
                  {selectedBooking.message || "N/A"}
                </p>
              </div>

              <div className="rounded-md border border-[#e2e2e2] p-4">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Created At
                </p>
                <p className="mt-1 text-[14px] text-[#4f4f4f]">
                  {formatDateTime(selectedBooking.createdAt)}
                </p>
              </div>

              <div className="rounded-md border border-[#e2e2e2] p-4">
                <p className="text-[12px] uppercase tracking-wide text-[#8b8b8b]">
                  Updated At
                </p>
                <p className="mt-1 text-[14px] text-[#4f4f4f]">
                  {formatDateTime(selectedBooking.updatedAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-[14px] text-[#7a7a7a]">
              No booking selected.
            </div>
          )}
        </DialogContent>
      </Dialog>

      <InspectionReportModal
        open={isReportOpen}
        onOpenChange={(open) => {
          setIsReportOpen(open);
          if (!open) setReportChecklistId(null);
        }}
        checklistId={reportChecklistId}
        token={token}
      />
    </div>
  );
}
