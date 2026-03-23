"use client";

import { useRef, useState } from "react";
import { Eye, Trash2, X } from "lucide-react";
import AppPagination from "@/components/share/AppPagination";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ── Types ───────────────────────────────────────────────
interface Plan {
  _id: string;
  name: string;
  price: number;
  billingCycle: string;
  title: string;
  features: string[];
  status: string;
  createdAt: string;
  totalSubscribers: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    items: Plan[];
    pagination: Pagination;
  };
}

// ── Skeleton Component ──────────────────────────────────
function PlansTableSkeleton() {
  return (
    <div className="mt-4 overflow-hidden rounded-[10px] border border-[#e9e9e9] bg-white">
      <div className="grid grid-cols-6 bg-[#dbe8f6] px-6 py-3 text-center text-[16px] font-medium text-[#0C2661]">
        <div>Plan Name</div>
        <div>Price</div>
        <div>Subscribers</div>
        <div>Date</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`grid grid-cols-6 items-center px-6 py-5 text-center ${
            i !== 4 ? "border-b border-[#efefef]" : ""
          }`}
        >
          <div className="h-5 w-3/5 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200 mx-auto" />
          <div className="h-5 w-12 animate-pulse rounded bg-gray-200 mx-auto" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200 mx-auto" />
          <div className="flex justify-center">
            <div className="h-7 w-20 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center justify-center gap-5">
            <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
            <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────
export default function SubscriptionManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

 const session= useSession();
  const token = session?.data?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["plans", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/plan?page=${currentPage}&limit=10`,
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
        throw new Error(`Failed to fetch plans: ${res.status}`);
      }

      return res.json();
    },
    staleTime: 3 * 60 * 1000, 
  });
  const hasShownSuccess = useRef(false);

  if (data?.status === true && !hasShownSuccess.current) {
    hasShownSuccess.current = true;
  }

  if (isError) {
    toast.error("Failed to load plans", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
  }

  const plans = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  const handleOpenDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (plan: Plan) => {
    setPlanToDelete(plan);
    setIsDeleteOpen(true);
  };

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/plan/${planId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete plan: ${res.status}`);
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Plan deleted successfully!");
      setIsDeleteOpen(false);
      setPlanToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },

    //eslint-disable-next-line
    onError: (error: any) => {
      const message =
        error?.message || "Failed to delete plan";
      toast.error(message);
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-5 py-5 md:px-4 md:py-6">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-[16px] font-bold text-[#131313] md:text-[24px]">
              Subscription Management
            </h1>
            <div className="mt-3 flex items-center gap-2 text-[16px] text-[#929292]">
              <span>Dashboard</span>
              <span>›</span>
              <span>Subscription Management</span>
            </div>
          </div>
          <Link href="/subscription-management/add-subcription">
            <button className="inline-flex h-[48px] items-center rounded-[4px] bg-[#FBBF24] px-4 text-[16px] font-medium text-[#131313] shadow-sm transition hover:opacity-90">
              + Create New Subscription
            </button>
          </Link>
        </div>

      

        {/* Table / Skeleton */}
        {isLoading ? (
          <PlansTableSkeleton />
        ) : (
          <div className="mt-4 overflow-hidden rounded-[10px] border border-[#e9e9e9] bg-white">
            <div className="grid grid-cols-6 bg-[#dbe8f6] px-6 py-3 text-center text-[16px] font-medium text-[#0C2661]">
              <div>Plan Name</div>
              <div>Price</div>
              <div>Subscribers</div>
              <div>Date</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {plans.map((plan, index) => (
              <div
                key={plan._id}
                className={`grid grid-cols-6 items-center px-6 py-5 text-center ${
                  index !== plans.length - 1 ? "border-b border-[#efefef]" : ""
                }`}
              >
                <div className="text-[16px] text-[#68706A]">{plan.name}</div>
                <div className="text-[16px] text-[#68706A]">
                  ${plan.price}
                  {plan.billingCycle === "yearly" ? "/yr" : "/mo"}
                </div>
                <div className="text-[16px] text-[#68706A]">
                  {plan.totalSubscribers}
                </div>
                <div className="text-[16px] text-[#68706A]">
                  {new Date(plan.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>

                <div className="flex justify-center">
                  <span
                    className={`inline-flex min-w-[88px] items-center justify-center rounded-[4px] px-4 py-2 text-[14px] font-medium ${
                      plan.status.toLowerCase() === "active"
                        ? "bg-[#e4f4e7] text-[#33a457]"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-5">
                  <button
                    onClick={() => handleOpenDetails(plan)}
                    className="text-[#2c2c2c] transition hover:opacity-70"
                    aria-label={`View ${plan.name}`}
                  >
                    <Eye size={17} strokeWidth={1.9} />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(plan)}
                    className="text-[#ff2d55] transition hover:opacity-70"
                    aria-label={`Delete ${plan.name}`}
                  >
                    <Trash2 size={17} strokeWidth={1.9} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="pl-4 text-[16px] text-[#7c7c7c] text-nowrap">
            Showing {(pagination?.page ?? 1) * (pagination?.limit ?? 10) - (pagination?.limit ?? 10) + 1} to{" "}
            {Math.min(
              (pagination?.page ?? 1) * (pagination?.limit ?? 10),
              pagination?.total ?? 0
            )}{" "}
            of {pagination?.total ?? 0} results
          </p>

          <AppPagination
            currentPage={currentPage}
            totalPages={pagination?.pages ?? 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Plan Details Dialog */}
      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedPlan(null);
        }}
      >
        <DialogContent className="w-[92vw] max-w-[760px] rounded-[10px] border border-[#e8e8e8] bg-white p-6 shadow-xl sm:p-8 [&>button]:hidden">
          <DialogClose className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#2c2c2c] transition hover:bg-[#f2f2f2]">
            <X className="h-4 w-4" />
          </DialogClose>

          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                Plan Name
              </h2>
              <p className="text-[14px] text-[#4b4b4b]">{selectedPlan?.name}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                Price
              </h3>
              <p className="text-[14px] text-[#4b4b4b]">
                ${selectedPlan?.price}
                {selectedPlan?.billingCycle === "yearly" ? "/year" : "/month"}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                Title
              </h3>
              <p className="text-[14px] text-[#4b4b4b]">{selectedPlan?.title}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                This Package Includes
              </h3>
              <ul className="list-disc pl-5 text-[14px] leading-relaxed text-[#4b4b4b]">
                {selectedPlan?.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setPlanToDelete(null);
        }}
      >
        <DialogContent className="w-[92vw] max-w-[520px] rounded-[10px] border border-[#e8e8e8] bg-white p-6 shadow-xl sm:p-7 [&>button]:hidden">
          <DialogClose className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#2c2c2c] transition hover:bg-[#f2f2f2]">
            <X className="h-4 w-4" />
          </DialogClose>

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                Delete Plan
              </h2>
              <p className="text-[14px] text-[#4b4b4b]">
                Are you sure you want to delete{" "}
                <span className="font-medium text-[#2c2c2c]">
                  {planToDelete?.name ?? "this plan"}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setPlanToDelete(null);
                }}
                className="h-[42px] min-w-[110px] rounded-[6px] border border-[#e3e3e3] bg-white text-[14px] font-medium text-[#2c2c2c] hover:bg-[#f6f6f6]"
                disabled={deletePlanMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (planToDelete?._id) {
                    deletePlanMutation.mutate(planToDelete._id);
                  }
                }}
                className="h-[42px] min-w-[110px] rounded-[6px] bg-[#ff2d55] text-[14px] font-medium text-white hover:bg-[#e0264b] disabled:opacity-60"
                disabled={deletePlanMutation.isPending || !planToDelete?._id}
              >
                {deletePlanMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
