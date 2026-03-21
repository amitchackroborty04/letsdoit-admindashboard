"use client";

import { useState } from "react";
import { Eye, Trash2, X } from "lucide-react";
import AppPagination from "@/components/share/AppPagination";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";

const plans = [
  {
    id: 1,
    name: "Basic Inspection!",
    price: "$175",
    subscribers: 120,
    date: "Oct 06, 2025",
    status: "Active",
    title: "The complete solution for serious business grant seekers.",
    includes:
      "Unlimited grant searches, unlimited saved grants, advanced filters & sorting, personalized recommendations, deadline reminders & calendar, export grant details, expert grant support.",
  },
  {
    id: 2,
    name: "Plus Inspection!",
    price: "$1808",
    subscribers: 85,
    date: "Sep 01, 2025",
    status: "Active",
    title: "Expanded coverage with priority support and insights.",
    includes:
      "Everything in Basic, plus priority support, expanded analytics, custom reporting, and early access to new features.",
  },
  {
    id: 3,
    name: "Complete Inspection!",
    price: "$189",
    subscribers: 45,
    date: "Aug 16, 2025",
    status: "Active",
    title: "Full-stack inspection experience for large teams.",
    includes:
      "Everything in Plus, plus multi-team access, dedicated success manager, and advanced compliance reporting.",
  },
];

export default function SubscriptionManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[number] | null>(
    null
  );

  const handleOpenDetails = (plan: (typeof plans)[number]) => {
    setSelectedPlan(plan);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-5 py-5 md:px-4 md:py-6">
      <div className=" w-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
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
          <button className="inline-flex h-[48px] items-center rounded-[4px] text-[#131313] bg-[#FBBF24] px-4 text-[16px] font-medium  shadow-sm transition hover:opacity-90">
            + Create New Subscription
          </button>
          </Link>
        </div>

        {/* Top button */}
        <div className="mt-6">
          <button className="h-[48px] rounded-[4px] bg-[#FBBF24] px-7 text-[16px] font-medium text-black shadow-sm">
            Pricing Plans
          </button>
        </div>

        {/* Table */}
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
              key={plan.id}
              className={`grid grid-cols-6 items-center px-6 py-5 text-center ${
                index !== plans.length - 1 ? "border-b border-[#efefef]" : ""
              }`}
            >
              <div className="text-[16px] text-[##68706A]">{plan.name}</div>
              <div className="text-[16px] text-[#68706A]">{plan.price}</div>
              <div className="text-[16px] text-[#68706A]">{plan.subscribers}</div>
              <div className="text-[16px] text-[#68706A]">{plan.date}</div>

              <div className="flex justify-center">
                <span className="inline-flex min-w-[88px] items-center justify-center rounded-[4px] bg-[#e4f4e7] px-4 py-2 text-[14px] font-medium text-[#33a457]">
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
                <button className="text-[#ff2d55] transition hover:opacity-70">
                  <Trash2 size={17} strokeWidth={1.9} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="pl-4 text-[16px] text-[#7c7c7c] text-nowrap">Showing 1 to 5 of 12 results</p>

          <AppPagination
            currentPage={currentPage}
            totalPages={50}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedPlan(null);
          }
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
              <p className="text-[14px] text-[#4b4b4b]">
                {selectedPlan?.name ?? "Basic Inspection!"}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                Price
              </h3>
              <p className="text-[14px] text-[#4b4b4b]">
                {selectedPlan?.price ?? "$175"}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                Title
              </h3>
              <p className="text-[14px] text-[#4b4b4b]">
                {selectedPlan?.title ??
                  "The complete solution for serious business grant seekers."}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[18px] font-semibold text-[#2c2c2c] sm:text-[20px]">
                This Package Include
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4b4b4b]">
                {selectedPlan?.includes ??
                  "Unlimited grant searches, unlimited saved grants, advanced filters & sorting, personalized recommendations, deadline reminders & calendar, export grant details, expert grant support."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
