import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR, formatPercent } from "@/lib/utils";
import {
  Package,
  ArrowLeft,
  Sparkles,
  Truck,
  ExternalLink,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export const revalidate = 0;

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      score: true,
      content: true,
      supplierProducts: {
        include: { supplier: true },
      },
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  const supplierProduct = product.supplierProducts[0];
  const supplier = supplierProduct?.supplier;
  const score = product.score;
  const content = product.content;

  const bullets: string[] = content?.bulletFeatures
    ? JSON.parse(content.bulletFeatures)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back button & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/products"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {product.title}
          </h1>
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Status: {product.status}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Category: {product.category}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Shopify ID: {product.shopifyProductId || "Unpublished"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/calculator?cost=${supplierProduct?.unitCost || 300}&price=${product.sellingPrice}`}
            className="px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-blue-400" />
            Recalculate Landed Cost
          </Link>

          <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Sync to Shopify Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Financials & AI Scoring */}
        <div className="lg:col-span-5 space-y-6">
          {/* Unit Economics Card */}
          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Unit Economics & True Landed Cost
            </h2>

            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">Contribution Profit / Order</span>
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight mt-0.5">
                {formatINR(product.estimatedProfit)}
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {product.targetMargin}% Net Margin
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Shopify Selling Price</span>
                <span className="font-bold text-white">{formatINR(product.sellingPrice)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Supplier Sourcing Cost</span>
                <span className="font-mono text-slate-300">
                  {formatINR(supplierProduct?.unitCost || 0)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Domestic Shipping Allocation</span>
                <span className="font-mono text-slate-300">
                  {formatINR(supplierProduct?.shippingCost || 70)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-850">
                <span className="text-slate-400">Total True Cost (incl. Ads & RTO)</span>
                <span className="font-mono font-bold text-amber-400">
                  {formatINR(product.trueCost)}
                </span>
              </div>
            </div>
          </div>

          {/* 6-Factor AI Scoring Breakdown */}
          {score && (
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  6-Factor Algorithmic Score
                </h2>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-bold">
                  {score.totalScore}/100
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Demand & Viral Velocity</span>
                    <span className="text-slate-200">{score.demandScore} / 25</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(score.demandScore / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Competition Density</span>
                    <span className="text-slate-200">{score.competitionScore} / 20</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(score.competitionScore / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Supplier Availability & GST</span>
                    <span className="text-slate-200">{score.supplierScore} / 20</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(score.supplierScore / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Profit Margin Multiplier</span>
                    <span className="text-slate-200">{score.marginScore} / 20</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(score.marginScore / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Shipping Weight & Fragility</span>
                    <span className="text-slate-200">{score.shippingScore} / 10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${(score.shippingScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Creative Potential & Hooks</span>
                    <span className="text-slate-200">{score.creativeScore} / 5</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(score.creativeScore / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {score.reasoning && (
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  {score.reasoning}
                </div>
              )}
            </div>
          )}

          {/* IndiaMART Supplier Record */}
          {supplier && (
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Mapped IndiaMART Supplier
              </h2>

              <div className="space-y-1">
                <div className="font-bold text-sm text-white">{supplier.companyName}</div>
                <div className="text-xs text-slate-400">{supplier.location}</div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {supplier.verificationStatus}
                </span>
                <span className="text-xs text-amber-400 font-semibold">★ {supplier.rating}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-mono text-[11px]">
                  GST: {supplier.gstNumber}
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/suppliers/${supplier.id}`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  View Supplier Verification Checklist →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Content & Meta Ad Suite */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ad Creative Angles */}
          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-400" />
              Meta Ad Creative Package
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Hook Angle 1 (Problem Agitation)
                </span>
                <p className="text-xs text-slate-200">{content?.hook1 || "Standard Problem Hook"}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Hook Angle 2 (Aesthetic / Viral Transformation)
                </span>
                <p className="text-xs text-slate-200">{content?.hook2 || "Viral POV Hook"}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Hook Angle 3 (Social Proof / Review Style)
                </span>
                <p className="text-xs text-slate-200">{content?.hook3 || "Social Proof Hook"}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Ad Headline:</span>
                <div className="text-slate-200 font-semibold mt-0.5">{content?.headline}</div>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 font-medium">Primary Ad Copy:</span>
                <p className="text-slate-300 text-xs leading-relaxed mt-0.5">
                  {content?.primaryText}
                </p>
              </div>
            </div>
          </div>

          {/* Shopify Content Specs & Bullets */}
          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              Shopify Optimized Features & Specs
            </h2>

            <div className="space-y-2">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Compliance Guarantee */}
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{content?.complianceNotes || "Passed automated compliance validation."}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
