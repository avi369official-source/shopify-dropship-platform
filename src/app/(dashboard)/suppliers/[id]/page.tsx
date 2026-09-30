import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SupplierVerificationChecklist } from "@/lib/types";
import { ArrowLeft, Truck, Phone, MessageSquare, ExternalLink, Package } from "lucide-react";
import { SupplierChecklistClient } from "./SupplierChecklistClient";

export const revalidate = 0;

interface SupplierPageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierDetailPage({ params }: SupplierPageProps) {
  const { id } = await params;

  const supplier = await db.supplier.findUnique({
    where: { id },
    include: {
      products: {
        include: { product: true },
      },
    },
  });

  if (!supplier) {
    notFound();
  }

  const defaultChecklist: SupplierVerificationChecklist = {
    gstDetailsChecked: false,
    businessIdentityChecked: false,
    supplierContacted: false,
    sampleOrdered: false,
    sampleQualityVerified: false,
    shippingTested: false,
    packagingChecked: false,
    returnProcessConfirmed: false,
    dropshippingAgreementConfirmed: false,
  };

  const initialChecklist: SupplierVerificationChecklist = supplier.checklistJson
    ? JSON.parse(supplier.checklistJson)
    : defaultChecklist;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/suppliers"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Suppliers
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-amber-500" />
              {supplier.companyName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Location: {supplier.location || "India"} • Rating: ★ {supplier.rating} • GSTIN: {supplier.gstNumber}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {supplier.whatsapp && (
              <a
                href={`https://wa.me/${supplier.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600/30 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Direct WhatsApp
              </a>
            )}

            {supplier.indiamartUrl && (
              <a
                href={supplier.indiamartUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-all"
              >
                <span>IndiaMART</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mapped Catalog Products */}
      {supplier.products.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Sourced Products from this Supplier:
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {supplier.products.map((sp) => (
              <Link
                key={sp.id}
                href={`/products/${sp.product.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 hover:border-blue-500/50 transition-all"
              >
                <Package className="w-3.5 h-3.5 text-blue-400" />
                <span>{sp.product.title}</span>
                <span className="text-slate-500 font-mono text-[11px]">(Unit Cost: ₹{sp.unitCost})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Checklist Interactive Client */}
      <SupplierChecklistClient
        supplierId={supplier.id}
        initialChecklist={initialChecklist}
        initialNotes={supplier.notes || ""}
        status={supplier.verificationStatus}
      />
    </div>
  );
}
