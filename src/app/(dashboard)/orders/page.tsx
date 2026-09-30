import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR, formatDateTime } from "@/lib/utils";
import { ShoppingCart, Truck, CheckCircle2, Clock, Layers, ArrowUpRight } from "lucide-react";

export const revalidate = 0;

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      items: true,
      supplierOrders: {
        include: { supplier: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalOrders = orders.length;
  const fulfilledOrders = orders.filter((o) => o.fulfillmentStatus === "fulfilled").length;
  const pendingOrders = orders.filter((o) => o.fulfillmentStatus !== "fulfilled").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-indigo-500" />
            Shopify Orders & Fulfillment Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time orders synced from Shopify, mapped directly to IndiaMART supplier dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/orders/queue"
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Open Supplier Dispatch Queue ({pendingOrders})</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Orders Synced</span>
          <div className="text-xl font-bold text-white">{totalOrders}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Fulfilled & Dispatched</span>
          <div className="text-xl font-bold text-emerald-400">{fulfilledOrders}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Awaiting Supplier Action</span>
          <div className="text-xl font-bold text-amber-400">{pendingOrders}</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Supplier Routing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {orders.map((order) => {
                const supplierOrder = order.supplierOrders[0];
                const isFulfilled = order.fulfillmentStatus === "fulfilled";

                return (
                  <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-mono">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {order.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {formatINR(order.totalPrice)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isFulfilled
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {supplierOrder ? (
                        <div className="space-y-0.5">
                          <div className="text-xs text-white font-medium">
                            {supplierOrder.supplier.companyName}
                          </div>
                          <div className="text-[10px] text-amber-400 font-mono">
                            Status: {supplierOrder.status}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
