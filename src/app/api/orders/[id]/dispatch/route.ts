import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shopifyService } from "@/services/shopify/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, trackingNumber, courierName, trackingUrl, notes } = body;

    // 1. Update SupplierOrder
    const updatedSupplierOrder = await db.supplierOrder.update({
      where: { id },
      data: {
        status: status || undefined,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        trackingUrl: trackingUrl || undefined,
        notes: notes || undefined,
        dispatchedAt: status === "SHIPPED" ? new Date() : undefined,
      },
      include: {
        order: true,
      },
    });

    // 2. If status is SHIPPED, update parent Order and sync fulfillment to Shopify
    if (status === "SHIPPED") {
      await db.order.update({
        where: { id: updatedSupplierOrder.orderId },
        data: {
          fulfillmentStatus: "fulfilled",
        },
      });

      if (updatedSupplierOrder.order.shopifyOrderId) {
        await shopifyService.fulfillOrder({
          shopifyOrderId: updatedSupplierOrder.order.shopifyOrderId,
          trackingNumber: trackingNumber || "TRACK123456",
          trackingCompany: courierName || "Delhivery",
          trackingUrl: trackingUrl,
          notifyCustomer: true,
        });
      }
    }

    return NextResponse.json({ success: true, supplierOrder: updatedSupplierOrder });
  } catch (error: any) {
    console.error("Error updating dispatch order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
