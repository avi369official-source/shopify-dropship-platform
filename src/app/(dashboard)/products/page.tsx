import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import {
  Package,
  Plus,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{ tab?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || "all";

  // Build query filter based on tab
  const whereClause: any = {};
  if (currentTab === "winners") {
    whereClause.status = { in: ["VALIDATED", "SCALE"] };
  } else if (currentTab === "testing") {
    whereClause.status = { in: ["AD_TESTING", "READY_TO_TEST", "PROMISING"] };
  } else if (currentTab === "rejected") {
    whereClause.status = "REJECTED";
  }

  const products = await db.product.findMany({
    where: whereClause,
    include: {
      score: true,
      supplierProducts: {
        include: { supplier: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCount = await db.product.count();
  const winnersCount = await db.product.count({
    where: { status: { in: ["VALIDATED", "SCALE"] } },
  });
  const testingCount = await db.product.count({
    where: { status: { in: ["AD_TESTING", "READY_TO_TEST", "PROMISING"] } },
  });
  const rejectedCount = await db.product.count({
    where: { status: "REJECTED" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" />
            Product Lifecycle Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage candidates through discovery, sample testing, ad testing, and scale.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/calculator"
            className="px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Margin Simulator
          </Link>
          <Link
            href="/products/new"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Import IndiaMART Product
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Link
          href="/products"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTab === "all"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          All Catalog ({totalCount})
        </Link>
        <Link
          href="/products?tab=winners"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTab === "winners"
              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Winners / Scale ({winnersCount})
        </Link>
        <Link
          href="/products?tab=testing"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTab === "testing"
              ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          In Testing ({testingCount})
        </Link>
        <Link
          href="/products?tab=rejected"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTab === "rejected"
              ? "bg-red-600/20 text-red-400 border border-red-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Rejected / Paused ({rejectedCount})
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const supplier = product.supplierProducts[0]?.supplier;
          const statusColors: Record<string, string> = {
            VALIDATED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
            AD_TESTING: "bg-blue-500/10 text-blue-400 border-blue-500/30",
            READY_TO_TEST: "bg-purple-500/10 text-purple-400 border-purple-500/30",
            DISCOVERED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
            REJECTED: "bg-red-500/10 text-red-400 border-red-500/30",
          };
          const colorClass = statusColors[product.status] || "bg-slate-500/10 text-slate-400";

          return (
            <div
              key={product.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden group shadow-lg shadow-black/20"
            >
              <div>
                {/* Image & Status header */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  {product.images ? (
                    <img
                      src={product.images.split(",")[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border backdrop-blur-md ${colorClass}`}
                    >
                      {product.status}
                    </span>
                  </div>
                  {product.score && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono font-bold text-indigo-300">
                      Score: {product.score.totalScore}/100
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-sm text-white line-clamp-1 mt-0.5">
                      {product.title}
                    </h3>
                  </div>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Retail</span>
                      <span className="text-xs font-bold text-white">
                        {formatINR(product.sellingPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">True Cost</span>
                      <span className="text-xs font-bold text-slate-400">
                        {formatINR(product.trueCost)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Profit</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {formatINR(product.estimatedProfit)}
                      </span>
                    </div>
                  </div>

                  {/* Supplier Link */}
                  {supplier && (
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Supplier:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[170px]">
                        {supplier.companyName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {product.shopifyStatus === "active" ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Shopify Synced
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Draft
                    </span>
                  )}
                </span>

                <Link
                  href={`/products/${product.id}`}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all flex items-center gap-1"
                >
                  Dossier →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
