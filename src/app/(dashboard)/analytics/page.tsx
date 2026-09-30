import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR, formatPercent, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Target,
} from "lucide-react";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const metrics = await db.dailyMetric.findMany({
    orderBy: { date: "asc" },
    take: 14,
  });

  const products = await db.product.findMany({
    include: { score: true },
    orderBy: { estimatedProfit: "desc" },
  });

  // Calculate aggregate KPIs
  const totalRevenue = metrics.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = metrics.reduce((s, m) => s + m.contributionProfit, 0);
  const totalAdSpend = metrics.reduce((s, m) => s + m.adSpend, 0);
  const totalOrders = metrics.reduce((s, m) => s + m.ordersCount, 0);
  const totalRefunds = metrics.reduce((s, m) => s + m.refundAmount, 0);
  const blendedRoas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
  const marginPct = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const refundRate = totalRevenue > 0 ? (totalRefunds / totalRevenue) * 100 : 0;

  // Week-over-week comparison
  const lastWeek = metrics.slice(0, 7);
  const thisWeek = metrics.slice(7, 14);
  const lwRevenue = lastWeek.reduce((s, m) => s + m.revenue, 0);
  const twRevenue = thisWeek.reduce((s, m) => s + m.revenue, 0);
  const revenueWoW = lwRevenue > 0 ? ((twRevenue - lwRevenue) / lwRevenue) * 100 : 0;

  const lwProfit = lastWeek.reduce((s, m) => s + m.contributionProfit, 0);
  const twProfit = thisWeek.reduce((s, m) => s + m.contributionProfit, 0);
  const profitWoW = lwProfit > 0 ? ((twProfit - lwProfit) / lwProfit) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          Profitability & Unit Economics Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          14-day rolling window. True contribution profit after RTO, ad spend, gateway fees, and taxes.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue (14D)",
            value: formatINR(totalRevenue),
            sub: `WoW: ${revenueWoW >= 0 ? "+" : ""}${revenueWoW.toFixed(1)}%`,
            up: revenueWoW >= 0,
            icon: DollarSign,
            color: "blue",
          },
          {
            label: "Net Contribution Profit",
            value: formatINR(totalProfit),
            sub: `${profitWoW >= 0 ? "+" : ""}${profitWoW.toFixed(1)}% WoW`,
            up: profitWoW >= 0,
            icon: TrendingUp,
            color: "emerald",
          },
          {
            label: "Blended ROAS",
            value: `${blendedRoas.toFixed(2)}x`,
            sub: `Ad Spend: ${formatINR(totalAdSpend)}`,
            up: blendedRoas >= 2.5,
            icon: Flame,
            color: "amber",
          },
          {
            label: "Contribution Margin",
            value: formatPercent(marginPct),
            sub: `Refund Rate: ${refundRate.toFixed(1)}%`,
            up: marginPct >= 25,
            icon: Target,
            color: "purple",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          const colorMap: Record<string, string> = {
            blue: "text-blue-400",
            emerald: "text-emerald-400",
            amber: "text-amber-400",
            purple: "text-purple-400",
          };
          return (
            <div
              key={kpi.label}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>{kpi.label}</span>
                <Icon className={`w-4 h-4 ${colorMap[kpi.color]}`} />
              </div>
              <div className={`text-2xl font-extrabold tracking-tight ${colorMap[kpi.color]}`}>
                {kpi.value}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Revenue Trend Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Daily Revenue & Profit Ledger</h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4">Ad Spend</th>
                  <th className="py-3 px-4">COGS</th>
                  <th className="py-3 px-4">Contribution Profit</th>
                  <th className="py-3 px-4">ROAS</th>
                  <th className="py-3 px-4">AOV</th>
                  <th className="py-3 px-4">Refunds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[...metrics].reverse().map((m) => {
                  const isProfitable = m.contributionProfit > 0;
                  return (
                    <tr key={m.id} className="hover:bg-slate-850/50 transition-colors text-slate-300">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{m.date}</td>
                      <td className="py-2.5 px-4 text-white font-bold">{m.ordersCount}</td>
                      <td className="py-2.5 px-4 font-semibold text-white">{formatINR(m.revenue)}</td>
                      <td className="py-2.5 px-4 text-blue-400">{formatINR(m.adSpend)}</td>
                      <td className="py-2.5 px-4 text-slate-400">{formatINR(m.trueCost)}</td>
                      <td className={`py-2.5 px-4 font-bold ${isProfitable ? "text-emerald-400" : "text-red-400"}`}>
                        {formatINR(m.contributionProfit)}
                      </td>
                      <td className="py-2.5 px-4 text-amber-400 font-mono">{m.roas.toFixed(2)}x</td>
                      <td className="py-2.5 px-4">{formatINR(m.aov)}</td>
                      <td className="py-2.5 px-4 text-red-400">{m.refundCount > 0 ? `${m.refundCount} (${formatINR(m.refundAmount)})` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-slate-700 bg-slate-950/70 text-xs font-bold">
                <tr>
                  <td className="py-3 px-4 text-slate-300">14D TOTAL</td>
                  <td className="py-3 px-4 text-white">{totalOrders}</td>
                  <td className="py-3 px-4 text-white">{formatINR(totalRevenue)}</td>
                  <td className="py-3 px-4 text-blue-400">{formatINR(totalAdSpend)}</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                  <td className="py-3 px-4 text-emerald-400">{formatINR(totalProfit)}</td>
                  <td className="py-3 px-4 text-amber-400">{blendedRoas.toFixed(2)}x</td>
                  <td className="py-3 px-4">{formatINR(aov)}</td>
                  <td className="py-3 px-4 text-red-400">{formatINR(totalRefunds)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Product Profitability Ranking */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Product Contribution Ranking</h2>
        <div className="space-y-2">
          {products.map((p, idx) => {
            const marginPct = p.sellingPrice > 0 ? (p.estimatedProfit / p.sellingPrice) * 100 : 0;
            const barWidth = Math.max(5, Math.min(100, (p.estimatedProfit / 500) * 100));
            const statusColors: Record<string, string> = {
              VALIDATED: "text-emerald-400",
              AD_TESTING: "text-blue-400",
              READY_TO_TEST: "text-purple-400",
              DISCOVERED: "text-slate-400",
            };
            return (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4"
              >
                <div className="text-slate-500 font-mono text-sm w-5 text-right flex-shrink-0">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <Link
                      href={`/products/${p.id}`}
                      className="text-xs font-semibold text-white hover:text-blue-400 truncate transition-colors"
                    >
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                      <span className="text-slate-400">
                        Retail: <span className="text-white font-semibold">{formatINR(p.sellingPrice)}</span>
                      </span>
                      <span className="text-slate-400">
                        Profit: <span className="text-emerald-400 font-bold">{formatINR(p.estimatedProfit)}</span>
                      </span>
                      <span className={`font-mono text-[11px] font-semibold ${statusColors[p.status] || "text-slate-400"}`}>
                        {p.status}
                      </span>
                      {p.score && (
                        <span className="text-indigo-400 font-mono text-[11px]">
                          Score: {p.score.totalScore}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 w-12 text-right">
                      {marginPct.toFixed(1)}% margin
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
