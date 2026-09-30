"use client";

import { useState } from "react";
import { PricingEngine } from "@/services/pricing/calculator";
import { formatINR, formatPercent } from "@/lib/utils";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function CalculatorPage() {
  const [supplierCost, setSupplierCost] = useState<number>(320);
  const [supplierShipping, setSupplierShipping] = useState<number>(70);
  const [packagingCost, setPackagingCost] = useState<number>(25);
  const [adAllocation, setAdAllocation] = useState<number>(180);
  const [rtoRate, setRtoRate] = useState<number>(12);
  const [sellingPrice, setSellingPrice] = useState<number>(999);
  const [targetMargin, setTargetMargin] = useState<number>(35);

  const breakdown = PricingEngine.calculate({
    supplierCost,
    supplierShipping,
    packagingCost,
    adAllocation,
    rtoRatePercent: rtoRate,
    sellingPrice,
    targetMarginPercent: targetMargin,
  });

  const isProfitable = breakdown.contributionProfit > 0;
  const isHealthyMargin = breakdown.contributionMarginPercent >= 25;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" />
          True Landed Cost & Dynamic Pricing Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Calculate actual dropshipping unit economics in India, accounting for RTO returns, supplier shipping, gateway fees, and advertising CPA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Cost Inputs (IndiaMART & Logistics)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  IndiaMART Supplier Unit Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                  <input
                    type="number"
                    value={supplierCost}
                    onChange={(e) => setSupplierCost(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 320"
                  />
                </div>
                <span className="text-[11px] text-slate-500">Wholesale cost per unit quoted by manufacturer</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Domestic Shipping (₹)
                  </label>
                  <input
                    type="number"
                    value={supplierShipping}
                    onChange={(e) => setSupplierShipping(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500">Delhivery / BlueDart (avg ₹70)</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Packaging & Box (₹)
                  </label>
                  <input
                    type="number"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500">Bubble wrap + outer carton</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1">
                  <span>Target Ad Spend / CPA (₹)</span>
                  <span className="text-blue-400 font-mono">₹{adAllocation}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="10"
                  value={adAllocation}
                  onChange={(e) => setAdAllocation(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="text-[11px] text-slate-500">Expected Meta ad acquisition cost per conversion</span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1">
                  <span>Expected RTO Failure Rate (%)</span>
                  <span className="text-amber-400 font-mono">{rtoRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={rtoRate}
                  onChange={(e) => setRtoRate(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[11px] text-slate-500">Indian COD dropshipping benchmark: 10% - 18%</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Shopify Retail Selling Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₹</span>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-blue-500/40 rounded-lg text-base font-bold text-white focus:outline-none focus:border-blue-500"
                    placeholder="999"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setSellingPrice(breakdown.minViablePrice)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Floor: ₹{breakdown.minViablePrice}
                  </button>
                  <button
                    onClick={() => setSellingPrice(breakdown.recommendedPrice)}
                    className="text-[11px] px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30"
                  >
                    Rec: ₹{breakdown.recommendedPrice}
                  </button>
                  <button
                    onClick={() => setSellingPrice(breakdown.premiumPrice)}
                    className="text-[11px] px-2 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/30"
                  >
                    Premium: ₹{breakdown.premiumPrice}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results & True Cost Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Profit Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-slate-400">Contribution Profit / Order</span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                  isHealthyMargin
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : isProfitable
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {breakdown.contributionMarginPercent}% Margin
              </span>
            </div>

            <div className="text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
              <span className={isProfitable ? "text-emerald-400" : "text-red-400"}>
                {formatINR(breakdown.contributionProfit)}
              </span>
              <span className="text-xs text-slate-400 font-normal">per delivered order</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
              <div>
                <span className="text-[11px] text-slate-400">True Landed Cost</span>
                <div className="text-lg font-bold text-slate-200">{formatINR(breakdown.trueCost)}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Retail Price</span>
                <div className="text-lg font-bold text-white">{formatINR(breakdown.sellingPrice)}</div>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Exact Cost Line Items
            </h3>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Supplier Unit Price</span>
                <span className="font-mono text-white">{formatINR(breakdown.supplierCost)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Domestic Express Shipping</span>
                <span className="font-mono text-white">{formatINR(breakdown.supplierShipping)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Packaging & Inserts</span>
                <span className="font-mono text-white">{formatINR(breakdown.packagingCost)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Expected RTO Loss Allocation ({rtoRate}%)</span>
                <span className="font-mono text-amber-400">{formatINR(breakdown.expectedReturnCost)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Meta Ad Spend Allocation (CPA)</span>
                <span className="font-mono text-blue-400">{formatINR(breakdown.advertisingAllocation)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Payment Gateway + Shopify Platform (4%)</span>
                <span className="font-mono text-white">
                  {formatINR(breakdown.gatewayFee + breakdown.shopifyPlatformCost)}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Estimated Net GST (with ITC)</span>
                <span className="font-mono text-white">{formatINR(breakdown.taxGst)}</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold text-sm bg-slate-950/60 px-2 rounded">
                <span className="text-slate-200">TOTAL TRUE COST</span>
                <span className="font-mono text-amber-400">{formatINR(breakdown.trueCost)}</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex gap-3">
            <Link
              href={`/products/new?title=New+Candidate&cost=${breakdown.supplierCost}&price=${breakdown.sellingPrice}`}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <span>Add Candidate Product with these Economics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
