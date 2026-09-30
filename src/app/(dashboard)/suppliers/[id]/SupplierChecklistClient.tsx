"use client";

import { useState } from "react";
import { SupplierVerificationChecklist } from "@/lib/types";
import { CheckCircle2, ShieldCheck, Save, Clock, AlertTriangle } from "lucide-react";

interface Props {
  supplierId: string;
  initialChecklist: SupplierVerificationChecklist;
  initialNotes: string;
  status: string;
}

const CHECKLIST_ITEMS: { key: keyof SupplierVerificationChecklist; label: string; desc: string }[] = [
  {
    key: "gstDetailsChecked",
    label: "1. GST Details & Legal Entity Checked",
    desc: "Verify active GSTIN on government portal and confirm legal registered trade name.",
  },
  {
    key: "businessIdentityChecked",
    label: "2. Business Physical Identity Checked",
    desc: "Verify address, IndiaMART TrustSeal verification, and business premises.",
  },
  {
    key: "supplierContacted",
    label: "3. Direct Contact Established",
    desc: "Spoke with owner/sales lead over phone/WhatsApp to confirm business terms.",
  },
  {
    key: "sampleOrdered",
    label: "4. Product Sample Ordered",
    desc: "Paid for physical sample delivery to test courier speed and packaging standard.",
  },
  {
    key: "sampleQualityVerified",
    label: "5. Sample Quality & Durability Inspected",
    desc: "Hands-on inspection: material grade, functionality, zero defects, accurate specs.",
  },
  {
    key: "shippingTested",
    label: "6. Shipping SLA & Courier Tested",
    desc: "Confirmed dispatch SLA (within 24-48 hours) with Delhivery/BlueDart tracking.",
  },
  {
    key: "packagingChecked",
    label: "7. Packaging & Unbranding Confirmed",
    desc: "Confirmed supplier will not include their own invoices/flyers inside customer parcels.",
  },
  {
    key: "returnProcessConfirmed",
    label: "8. Return / Damaged Goods Process Agreed",
    desc: "Confirmed standard replacement process for transit damage or customer defects.",
  },
  {
    key: "dropshippingAgreementConfirmed",
    label: "9. Blind Dropshipping Agreement Finalized",
    desc: "Supplier agreed to affix our store shipping labels and ship directly to end buyers.",
  },
];

export function SupplierChecklistClient({
  supplierId,
  initialChecklist,
  initialNotes,
  status,
}: Props) {
  const [checklist, setChecklist] = useState<SupplierVerificationChecklist>(initialChecklist);
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const isVerified = completedCount >= 8;

  const toggleCheck = (key: keyof SupplierVerificationChecklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checklist, notes }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentStatus(data.supplier.verificationStatus);
        setSavedSuccess(true);
      }
    } catch (err) {
      console.error("Save checklist error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-slate-400">Current Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${
                isVerified
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {currentStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {completedCount} of 9 verification steps completed.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Checklist Changes"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Verification checklist updated successfully!</span>
        </div>
      )}

      {/* Checklist items */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          9-Step Dropshipping Readiness Audit
        </h2>

        <div className="divide-y divide-slate-800">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checklist[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className="py-3 flex items-start gap-3.5 cursor-pointer group hover:bg-slate-850/30 px-2 rounded-lg transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 border transition-all ${
                    isChecked
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "border-slate-700 bg-slate-950 group-hover:border-slate-500"
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-0.5">
                  <div
                    className={`text-xs font-semibold ${
                      isChecked ? "text-white line-through opacity-80" : "text-slate-200"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Internal Supplier Notes & Dispatch Terms
        </h3>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Spoke with owner Rajesh. They accept daily WhatsApp CSV batch orders. Direct Delhivery pickup at 5 PM daily..."
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
        />
      </div>
    </div>
  );
}
