import { EarningsChart } from "@/components/home/EarningsChart";
import { InspectorRequestTable } from "@/components/home/InspectorRequestTable";
import { PendingApprovals } from "@/components/home/PendingApprovals";
import { StatCard } from "@/components/home/StatCard";

export const metadata = {
  title: 'Inspector Dashboard',
  description: 'Dashboard for managing inspector requests and approvals',
};

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
    

      {/* Main Content */}
      <div className="w-full mx-auto px-6 py-8">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Inspector Req and"
            value="12,426"
            change={36}
            isPositive={true}
          />
          <StatCard
            label="Total Inspector"
            value="12,426"
            change={16}
            isPositive={false}
          />
          <StatCard
            label="Total Dealership"
            value="12,426"
            change={30}
            isPositive={true}
          />
          <StatCard
            label="Total Earnings"
            value="$12,426"
            change={35}
            isPositive={false}
          />
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Earnings Chart - 2 columns */}
          <div className="lg:col-span-2">
            <EarningsChart />
          </div>

          {/* Pending Approvals - 1 column */}
          <div>
            <PendingApprovals />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Requests Table */}
          <InspectorRequestTable />

          {/* Additional Pending Approvals */}
          <div>
            <PendingApprovals />
          </div>
        </div>
      </div>
    </main>
  );
}
