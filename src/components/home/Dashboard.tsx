"use client";

import { useQuery } from '@tanstack/react-query';
import { EarningsChart } from "@/components/home/EarningsChart";
import { InspectorRequestTable } from "@/components/home/InspectorRequestTable";
import { PendingApprovals } from "@/components/home/PendingApprovals";
import { StatCard } from "@/components/home/StatCard";
import { useSession } from 'next-auth/react';

// Skeleton for StatCard (same visual design)
function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mb-3" />
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

type DashboardStats = {
  pendingInspectors: number;
  approvedInspectors: number;
  dealers: number;
  totalRevenue: number;
};

async function fetchDashboardStats(token?: string | null): Promise<DashboardStats> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-dashboard/stats`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard stats");

  const json = await res.json();
  if (!json.status || !json.data) throw new Error(json.message || "Invalid response");

  return json.data;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const { data, isPending, error } = useQuery<DashboardStats, Error>({
    queryKey: ['admin-dashboard-stats', token],
    queryFn: () => fetchDashboardStats(token),
    refetchOnWindowFocus: true,
    enabled: status !== "loading",
  });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="text-red-600">Error loading dashboard stats: {error.message}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-6 py-8">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isPending ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Pending Inspectors"
                value={data?.pendingInspectors.toLocaleString() ?? "0"}
                change={0}           
                isPositive={true}
              />
              <StatCard
                label="Approved Inspectors"
                value={data?.approvedInspectors.toLocaleString() ?? "0"}
                change={0}
                isPositive={true}
              />
              <StatCard
                label="Total Dealership"
                value={data?.dealers.toLocaleString() ?? "0"}
                change={0}
                isPositive={true}
              />
              <StatCard
                label="Total Earnings"
                value={`$${data?.totalRevenue.toLocaleString() ?? "0"}`}
                change={0}
                isPositive={true}
              />
            </>
          )}
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <EarningsChart />
          </div>
          <div>
            <PendingApprovals />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InspectorRequestTable />
          <div>
            <PendingApprovals />
          </div>
        </div>
      </div>
    </main>
  );
}
