import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shopifyService } from "@/services/shopify/client";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic") || "orders/create";

    // 1. Verify HMAC
    const isValid = shopifyService.verifyWebhookHmac(rawBody, hmacHeader);
    if (!isValid) {
      console.warn("Unauthorized webhook HMAC mismatch");
      return NextResponse.json({ error: "Unauthorized HMAC" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody || "{}");

    // 2. Handle specific webhook topics
    if (topic === "orders/create" || topic === "orders/paid") {
      const shopifyOrderId = `gid://shopify/Order/${payload.id || Date.now()}`;
      const orderNumber = payload.name || `#AV-${Math.floor(1000 + Math.random() * 9000)}`;

      // Check if order already ingested
      const existing = await db.order.findUnique({
        where: { orderNumber },
      });

      if (!existing) {
        const customerName = payload.customer
          ? `${payload.customer.first_name || ""} ${payload.customer.last_name || ""}`.trim()
          : payload.shipping_address?.name || "Customer";

        const order = await db.order.create({
          data: {
            shopifyOrderId,
            orderNumber,
            customerName: customerName || "Online Buyer",
            customerEmail: payload.customer?.email || payload.email,
            customerPhone: payload.customer?.phone || payload.shipping_address?.phone,
            shippingAddress: JSON.stringify(payload.shipping_address || {}),
            totalPrice: Number(payload.total_price || 999),
            subtotalPrice: Number(payload.subtotal_price || 999),
            currency: payload.currency || "INR",
            financialStatus: payload.financial_status || "paid",
            fulfillmentStatus: "unfulfilled",
            paymentMethod: payload.gateway || "COD",
          },
        });

        // Create line items
        if (payload.line_items && Array.isArray(payload.line_items)) {
          for (const item of payload.line_items) {
            await db.orderItem.create({
              data: {
                orderId: order.id,
                title: item.title || "Product Item",
                sku: item.sku,
                quantity: Number(item.quantity || 1),
                unitPrice: Number(item.price || 999),
                totalPrice: Number(item.price || 999) * Number(item.quantity || 1),
              },
            });
          }
        }

        // Auto-route to first verified supplier for queueing
        const defaultSupplier = await db.supplier.findFirst({
          where: { verificationStatus: "VERIFIED" },
        });

        if (defaultSupplier) {
          await db.supplierOrder.create({
            data: {
              orderId: order.id,
              supplierId: defaultSupplier.id,
              status: "AWAITING_SUPPLIER",
              purchaseCost: Math.round(order.totalPrice * 0.35),
              notes: "Auto-ingested from Shopify webhook.",
            },
          });
        }
      }
    }

    // 3. Log webhook audit
    await db.auditLog.create({
      data: {
        entityType: "SHOPIFY_WEBHOOK",
        entityId: topic,
        action: "WEBHOOK_PROCESSED",
        performedBy: "SHOPIFY_SYSTEM",
        detailsJson: JSON.stringify({ topic, timestamp: new Date() }),
      },
    });

    return NextResponse.json({ success: true, processedTopic: topic });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
