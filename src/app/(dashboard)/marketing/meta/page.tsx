import { db } from "@/lib/db";
import { formatINR, formatDate } from "@/lib/utils";
import { Megaphone, TrendingUp, Flame, ShieldCheck, BarChart3, Settings } from "lucide-react";

export const revalidate = 0;

export default async function MetaPage() {
  const campaigns = await db.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  const products = await db.product.findMany({
    where: { status: { in: ["AD_TESTING", "VALIDATED", "SCALE"] } },
    include: { content: true, score: true },
    take: 5,
  });

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRoas = campaigns.length > 0
    ? campaigns.reduce((s, c) => s + c.roas, 0) / campaigns.length
    : 0;
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-500" />
            Meta Business & Campaign Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect your Meta Ad Account, sync product catalog, and monitor campaign performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Meta Commerce Policy Active
          </span>
        </div>
      </div>

      {/* Connection Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
            Meta Ad Account: Not Connected (Mock Mode Active)
          </div>
          <p className="text-xs text-slate-400">
            Go to <span className="text-blue-400 font-medium">Settings → Integrations</span> to connect your Meta Ad Account ID and Business Manager.
          </p>
        </div>
        <a
          href="/settings"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Settings className="w-4 h-4" /> Connect Meta Account
        </a>
      </div>

      {/* KPIs (show mock/demo data when no campaigns) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Ad Spend</span>
          <div className="text-xl font-bold text-blue-400">
            {campaigns.length > 0 ? formatINR(totalSpend) : "₹—"}
          </div>
          <span className="text-[11px] text-slate-500">
            {campaigns.length > 0 ? `Across ${campaigns.length} campaigns` : "Connect account to track"}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Blended ROAS</span>
          <div className="text-xl font-bold text-amber-400">
            {campaigns.length > 0 ? `${totalRoas.toFixed(2)}x` : "—"}
          </div>
          <span className="text-[11px] text-slate-500">Target: ≥ 3.0x</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Conversions</span>
          <div className="text-xl font-bold text-emerald-400">
            {campaigns.length > 0 ? totalConversions : "—"}
          </div>
          <span className="text-[11px] text-slate-500">Shopify checkout completions</span>
        </div>
      </div>

      {/* Products Ready for Meta Ads */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Products Ready for Meta Ad Testing</h2>
        <div className="space-y-3">
          {products.map((p) => {
            const content = p.content;
            return (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-sm font-bold text-white truncate">{p.title}</div>
                  <div className="text-xs text-slate-400">
                    Retail: <span className="text-white font-semibold">{formatINR(p.sellingPrice)}</span>
                    {" · "}
                    Contribution: <span className="text-emerald-400 font-semibold">{formatINR(p.estimatedProfit)}</span>
                    {p.score && (
                      <>
                        {" · "}
                        Creative Score: <span className="text-purple-400 font-semibold">{p.score.creativeScore}/5</span>
                      </>
                    )}
                  </div>
                  {content?.hook1 && (
                    <div className="text-[11px] text-slate-400 italic line-clamp-1">
                      Hook: "{content.hook1}"
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/marketing/creatives`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all"
                  >
                    View Ad Copy
                  </a>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 transition-all">
                    Launch Campaign →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta Catalog Sync Status */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Meta Product Catalog Sync Status
        </h2>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-1 text-center">
            <div className="text-2xl font-bold text-white">{products.length}</div>
            <div className="text-slate-400">Products Eligible for Catalog</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-1 text-center">
            <div className="text-2xl font-bold text-amber-400">0</div>
            <div className="text-slate-400">Synced to Meta Catalog</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-1 text-center">
            <div className="text-2xl font-bold text-slate-500">—</div>
            <div className="text-slate-400">Catalog ID Configured</div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Once your Meta Ad Account is connected in Settings, the Shopify product catalog will automatically sync eligible products to Meta's Commerce Manager, enabling Dynamic Product Ads (DPA) and catalog-based retargeting campaigns.
        </p>
      </div>
    </div>
  );
}
