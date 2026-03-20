'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Feb', value: 32000, tooltipLabel: 'February 2021' },
  { name: 'Mar', value: 36000, tooltipLabel: 'March 2021' },
  { name: 'Apr', value: 33000, tooltipLabel: 'April 2021' },
  { name: 'May', value: 41000, tooltipLabel: 'May 2021' },
  { name: 'Jun', value: 45591, tooltipLabel: 'June 2021' },
  { name: 'Jul', value: 43000, tooltipLabel: 'July 2021' },
  { name: 'Aug', value: 47000, tooltipLabel: 'August 2021' },
  { name: 'Sep', value: 44000, tooltipLabel: 'September 2021' },
  { name: 'Oct', value: 56000, tooltipLabel: 'October 2021' },
  { name: 'Nov', value: 54000, tooltipLabel: 'November 2021' },
  { name: 'Dec', value: 59000, tooltipLabel: 'December 2021' },
  { name: 'Jan', value: 62000, tooltipLabel: 'January 2022' },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

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
  return (
    <div className="flex h-[514px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
          <p className="text-sm text-gray-500">
            Track total revenue, platform commission, and payouts over time.
          </p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
          Monthly
          <span className="text-[10px]">▼</span>
        </button>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
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
      </div>
    </div>
  );
}
