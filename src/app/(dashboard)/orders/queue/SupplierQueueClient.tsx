"use client";

import { useState } from "react";
import { formatINR } from "@/lib/utils";
import { Truck, CheckCircle2, Clock, AlertTriangle, ExternalLink, Save } from "lucide-react";

interface SupplierOrderRow {
  id: string;
  status: string;
  purchaseCost: number;
  trackingNumber: string | null;
  courierName: string | null;
  notes: string | null;
  supplier: {
    id: string;
    companyName: string;
    phone: string | null;
  };
  order: {
    orderNumber: string;
    customerName: string;
    shippingAddress: string | null;
    totalPrice: number;
  };
}

interface Props {
  initialOrders: SupplierOrderRow[];
}

export function SupplierQueueClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState<SupplierOrderRow[]>(initialOrders);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("Delhivery");
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Status update error", err);
    }
  };

  const handleShipWithTracking = async (id: string) => {
    if (!trackingNumber) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${id}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "SHIPPED",
          trackingNumber,
          courierName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status: "SHIPPED",
                  trackingNumber,
                  courierName,
                }
              : o
          )
        );
        setActiveModalId(null);
        setTrackingNumber("");
      }
    } catch (err) {
      console.error("Tracking dispatch error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Shopify Order</th>
                <th className="py-3 px-4">Assigned Supplier</th>
                <th className="py-3 px-4">Purchase Cost</th>
                <th className="py-3 px-4">Queue State</th>
                <th className="py-3 px-4">Courier / Tracking</th>
                <th className="py-3 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {orders.map((o) => {
                const isShipped = o.status === "SHIPPED";
                const isConfirmed = o.status === "CONFIRMED";
                const isAwaiting = o.status === "AWAITING_SUPPLIER";

                return (
                  <tr key={o.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-mono">{o.order.orderNumber}</div>
                      <div className="text-[11px] text-slate-400">{o.order.customerName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{o.supplier.companyName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{o.supplier.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {formatINR(o.purchaseCost)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isShipped
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : isConfirmed
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {o.trackingNumber ? (
                        <div className="space-y-0.5">
                          <span className="font-mono text-white text-xs">{o.trackingNumber}</span>
                          <div className="text-[10px] text-slate-400">{o.courierName}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Pending dispatch</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isAwaiting && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, "CONFIRMED")}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all"
                          >
                            Confirm Supplier
                          </button>
                        )}

                        {!isShipped && (
                          <button
                            onClick={() => {
                              setActiveModalId(o.id);
                              setTrackingNumber(`DELHIVERY${Math.floor(100000000 + Math.random() * 900000000)}`);
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all"
                          >
                            Mark Shipped
                          </button>
                        )}

                        {isShipped && (
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Entering Tracking Number */}
      {activeModalId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              Dispatch Order & Sync to Shopify
            </h3>
            <p className="text-xs text-slate-400">
              Entering the supplier's tracking number will fulfill the order on Shopify and trigger the customer's shipping notification email.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Courier / Express Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                >
                  <option value="Delhivery">Delhivery Surface / Express</option>
                  <option value="BlueDart">BlueDart Express</option>
                  <option value="DTDC">DTDC Courier</option>
                  <option value="Ecom Express">Ecom Express</option>
                  <option value="Shadowfax">Shadowfax</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Air Waybill (AWB) / Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DELHIVERY98124018"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveModalId(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleShipWithTracking(activeModalId)}
                disabled={submitting || !trackingNumber}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {submitting ? "Syncing..." : "Confirm & Fulfill Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
