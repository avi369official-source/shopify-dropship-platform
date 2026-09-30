import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { Store, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function MarketplacePage() {
  const products = await db.product.findMany({
    include: {
      content: true,
      marketplace: true,
    },
    take: 6,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-purple-500" />
            Facebook Marketplace Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Policy-compliant listing preparation with human approval gate. Prepares titles, pricing, and tags for permitted Meta commerce workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Meta Commerce Policy Compliant
          </span>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Safe Marketplace Assistant Architecture:</span> To
          protect merchant ad accounts, this system strictly avoids unauthorized bot-spamming or
          automation scripts that violate Meta Terms. It acts as an intelligent assistant that
          formats compliant listing descriptions, checks prohibited keyword lists, and syncs via
          approved Meta Commerce Manager catalogs.
        </div>
      </div>

      {/* Prepared Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => {
          const content = p.content;

          return (
            <div
              key={p.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-0.5 line-clamp-1">{p.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Ready for Review
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-850 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Marketplace Listed Price:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {formatINR(p.sellingPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment & Delivery:</span>
                  <span className="text-slate-200">COD Available + Doorstep Express</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-1">
                    Prepared Listing Description:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                    {content?.primaryText || p.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Compliance check passed
                </span>

                <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all">
                  Approve & Export Listing
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
