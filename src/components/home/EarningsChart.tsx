'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type GrowthPoint = {
  year: number;
  month: number;
  revenue: number;
};

type GrowthResponse = {
  status: boolean;
  message: string;
  data: GrowthPoint[];
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthFullLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DEFAULT_YEAR = 2026;

async function fetchGrowth(year: number, token?: string | null): Promise<GrowthPoint[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-dashboard/growth?period=monthly&year=${year}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch revenue growth');
  }

  const json: GrowthResponse = await res.json();
  if (!json.status || !Array.isArray(json.data)) {
    throw new Error(json.message || 'Invalid growth response');
  }

  return json.data;
}

function EarningsTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { tooltipLabel?: string } }>;
}) {
  if (!active || !payload?.length) return null;

  const value = payload[0].value;
  const label = payload[0].payload.tooltipLabel ?? 'June 2021';

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-blue-700">
        {currencyFormatter.format(value)}
      </p>
    </div>
  );
}

export function EarningsChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(DEFAULT_YEAR);
  const years = useMemo(() => {
    const baseYears = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
    if (!baseYears.includes(DEFAULT_YEAR)) {
      baseYears.push(DEFAULT_YEAR);
    }
    return baseYears.sort((a, b) => a - b);
  }, [currentYear]);

  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const { data: growthData = [], isLoading, error } = useQuery<GrowthPoint[], Error>({
    queryKey: ['admin-dashboard-growth', selectedYear, token],
    queryFn: () => fetchGrowth(selectedYear, token),
    enabled: status !== 'loading' && !!token,
    refetchOnWindowFocus: true,
  });

  const chartData = useMemo(() => {
    const revenueByMonth = new Map<number, number>();
    growthData.forEach((point) => {
      revenueByMonth.set(point.month, point.revenue);
    });

    return monthLabels.map((label, index) => {
      const monthIndex = index + 1;
      return {
        name: label,
        value: revenueByMonth.get(monthIndex) ?? 0,
        tooltipLabel: `${monthFullLabels[index]} ${selectedYear}`,
      };
    });
  }, [growthData, selectedYear]);

  return (
    <div className="flex h-[514px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
          <p className="text-sm text-gray-500">
            Track total revenue, platform commission, and payouts over time.
          </p>
        </div>
        <Select
          value={String(selectedYear)}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="h-8 w-[110px] rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-none">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error ? (
        <div className="flex flex-1 items-center justify-center text-sm text-red-600">
          {error.message}
        </div>
      ) : (
      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={8}
            />
            <YAxis hide />
            <Tooltip content={<EarningsTooltip />} cursor={{ stroke: '#003366', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#003366"
              strokeWidth={1}
              fillOpacity={1}
              fill="#F8F8FF"
              dot={false}
              activeDot={{ r: 4, stroke: '#1e40af', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
            Loading revenue growth...
          </div>
        )}
      </div>
      )}
    </div>
  );
}
