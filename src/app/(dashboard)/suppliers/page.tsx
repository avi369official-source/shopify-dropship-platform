import Link from "next/link";
import { db } from "@/lib/db";
import {
  Truck,
  ShieldCheck,
  Clock,
  Phone,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";

export const revalidate = 0;

export default async function SuppliersPage() {
  const suppliers = await db.supplier.findMany({
    include: {
      products: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const verifiedCount = suppliers.filter((s) => s.verificationStatus === "VERIFIED").length;
  const pendingCount = suppliers.filter((s) => s.verificationStatus !== "VERIFIED").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-500" />
            IndiaMART Supplier Directory & Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track domestic supplier contacts, GST validation, sample tests, and dropshipping dispatch agreements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {verifiedCount} Verified Suppliers
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              {pendingCount} Verification Pending
            </span>
          </div>
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => {
          const checklist = supplier.checklistJson ? JSON.parse(supplier.checklistJson) : {};
          const completedChecks = Object.values(checklist).filter(Boolean).length;
          const totalChecks = 9;

          const isVerified = supplier.verificationStatus === "VERIFIED";

          return (
            <div
              key={supplier.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg shadow-black/20"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-white">{supplier.companyName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{supplier.location || "India"}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      isVerified
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {supplier.verificationStatus}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-medium text-amber-400">★ {supplier.rating}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px] truncate">GST: {supplier.gstNumber}</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>9-Point Verification</span>
                    <span className="font-mono font-medium text-slate-200">
                      {completedChecks}/{totalChecks} Completed
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isVerified ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${(completedChecks / totalChecks) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-1.5 text-xs">
                  <div className="text-slate-300 font-medium">Contact: {supplier.contactPerson}</div>
                  <div className="text-slate-400 font-mono text-[11px] flex items-center justify-between">
                    <span>{supplier.phone}</span>
                    {supplier.whatsapp && (
                      <a
                        href={`https://wa.me/${supplier.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-sans flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {/* Mapped Products */}
                <div className="text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Catalog items:</span>{" "}
                  {supplier.products.length > 0 ? (
                    <span>{supplier.products.map((p) => p.product.title).join(", ")}</span>
                  ) : (
                    <span className="text-slate-500">No products mapped yet</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {supplier.indiamartUrl ? (
                  <a
                    href={supplier.indiamartUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <span>IndiaMART Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span></span>
                )}

                <Link
                  href={`/suppliers/${supplier.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
                >
                  Verification Checklist →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
