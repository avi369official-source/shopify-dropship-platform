import { db } from "@/lib/db";
import { formatINR, formatDateTime } from "@/lib/utils";
import { Shield, CheckCircle2, AlertTriangle, Clock, Zap, Database } from "lucide-react";

export const revalidate = 0;

export default async function AutomationPage() {
  const auditLogs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const webhookLogs = auditLogs.filter((l) => l.entityType === "SHOPIFY_WEBHOOK");
  const productLogs = auditLogs.filter((l) => l.entityType === "PRODUCT");
  const systemLogs = auditLogs.filter((l) => l.entityType === "SYSTEM");

  const automationWorkflows = [
    {
      name: "New Shopify Order → Supplier Queue",
      trigger: "orders/create webhook",
      status: "ACTIVE",
      description:
        "When a new Shopify order is received (HMAC-verified), it is validated and automatically routed into the supplier dispatch queue as AWAITING_SUPPLIER.",
    },
    {
      name: "Supplier Dispatch → Shopify Fulfillment",
      trigger: "Manual: Mark Shipped in Queue",
      status: "ACTIVE",
      description:
        "When admin enters AWB tracking number in the Supplier Queue, Shopify fulfillment is triggered and the customer receives an automated shipping notification.",
    },
    {
      name: "Product Import → AI Analysis Pipeline",
      trigger: "POST /api/products",
      status: "ACTIVE",
      description:
        "When a new IndiaMART candidate product is imported, it automatically runs 6-factor scoring, landed cost analysis, and generates Meta-compliant Shopify descriptions and ad creatives.",
    },
    {
      name: "Shopify Product Sync",
      trigger: "Manual: POST /api/shopify/sync",
      status: "ACTIVE",
      description:
        "Publishes Validated and Ad-Testing products to the live Shopify store via Admin API. In Mock Mode, generates deterministic Shopify product IDs for testing.",
    },
    {
      name: "Supplier Verification → Status Update",
      trigger: "POST /api/suppliers/[id]/checklist",
      status: "ACTIVE",
      description:
        "When the 9-point verification checklist reaches 8+ completed steps, supplier status is automatically upgraded to VERIFIED.",
    },
    {
      name: "Low Stock Inventory Alert (Coming — Phase 5)",
      trigger: "Scheduled: Daily inventory check",
      status: "PLANNED",
      description:
        "Planned: When supplier stock count drops below minimum threshold, product is flagged, Meta campaigns are paused, and admin receives an alert.",
    },
    {
      name: "Product Performance Auto-Classification (Coming — Phase 6)",
      trigger: "Scheduled: Weekly KPI analysis",
      status: "PLANNED",
      description:
        "Planned: AI analyst evaluates 14-day product metrics and automatically proposes lifecycle status transitions (e.g. AD_TESTING → PROMISING or → REJECTED).",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Automation Workflows & Audit Log
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Every financial action, webhook event, and supplier dispatch is logged for full auditability.
        </p>
      </div>

      {/* Automation Workflows Status */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Active & Planned Automation Workflows
        </h2>
        <div className="space-y-2">
          {automationWorkflows.map((wf, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex items-start gap-4"
            >
              <div
                className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${
                  wf.status === "ACTIVE" ? "bg-emerald-400" : "bg-slate-500"
                }`}
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-white">{wf.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold border flex-shrink-0 ${
                      wf.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-700/50 text-slate-400 border-slate-700"
                    }`}
                  >
                    {wf.status}
                  </span>
                </div>
                <div className="text-[11px] text-blue-400 font-mono">Trigger: {wf.trigger}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{wf.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            System Audit Log
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-mono">
              {auditLogs.length} total events
            </span>
            <span>{webhookLogs.length} webhooks</span>
            <span>•</span>
            <span>{productLogs.length} product events</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors text-slate-300">
                    <td className="py-2.5 px-4 text-[10px] font-mono text-slate-500">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-white text-[11px]">{log.action}</td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">{log.performedBy}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-[10px] font-mono max-w-xs truncate">
                      {log.detailsJson
                        ? JSON.stringify(JSON.parse(log.detailsJson), null, 0).slice(0, 80) + "..."
                        : "—"}
                    </td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No audit events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
