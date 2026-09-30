import Link from "next/link";
import { db } from "@/lib/db";
import { Layers, ArrowLeft, Truck, CheckCircle2, Clock } from "lucide-react";
import { SupplierQueueClient } from "./SupplierQueueClient";

export const revalidate = 0;

export default async function SupplierQueuePage() {
  const supplierOrders = await db.supplierOrder.findMany({
    include: {
      supplier: true,
      order: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const awaitingCount = supplierOrders.filter((o) => o.status === "AWAITING_SUPPLIER").length;
  const confirmedCount = supplierOrders.filter((o) => o.status === "CONFIRMED").length;
  const shippedCount = supplierOrders.filter((o) => o.status === "SHIPPED").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/orders"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-500" />
              Supplier Dispatch & Fulfillment Queue
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              State machine: Awaiting Supplier → Confirmed → Processing → Shipped → Delivered.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              {awaitingCount} Awaiting
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              {confirmedCount} Confirmed
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {shippedCount} Dispatched
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Queue */}
      <SupplierQueueClient initialOrders={supplierOrders} />
    </div>
  );
}
