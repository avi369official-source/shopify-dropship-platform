"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DailyMetric {
  date: string;
  revenue: number;
  contributionProfit: number;
  adSpend: number;
}

interface Props {
  data: DailyMetric[];
}

function formatK(value: number) {
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return `₹${value}`;
}

export function RevenueChart({ data }: Props) {
  const chartData = data.map((m) => ({
    date: m.date.slice(5), // "MM-DD"
    Revenue: Math.round(m.revenue),
    Profit: Math.round(m.contributionProfit),
    "Ad Spend": Math.round(m.adSpend),
  }));

  return (
    <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">Revenue vs Profit vs Ad Spend (14 Days)</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Contribution profit after true landed cost deductions</p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatK}
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#e2e8f0",
              }}
              formatter={(value: number, name: string) => [
                `₹${value.toLocaleString("en-IN")}`,
                name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            />
            <Area
              type="monotone"
              dataKey="Revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="Profit"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorProfit)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="Ad Spend"
              stroke="#6366f1"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              fill="url(#colorAds)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
