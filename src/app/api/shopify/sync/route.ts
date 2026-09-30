import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shopifyService } from "@/services/shopify/client";

/**
 * POST /api/shopify/sync
 * Manually trigger a Shopify product sync
 * In mock mode, updates product Shopify statuses to "active"
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { productId } = body;

    if (productId) {
      // Sync a single product
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const result = await shopifyService.createOrUpdateProduct({
        title: product.title,
        descriptionHtml: product.description || "",
        price: product.sellingPrice,
        sku: product.slug,
      });

      const updated = await db.product.update({
        where: { id: productId },
        data: {
          shopifyProductId: result.shopifyProductId,
          shopifyHandle: result.shopifyHandle,
          shopifyStatus: "active",
        },
      });

      await db.auditLog.create({
        data: {
          entityType: "PRODUCT",
          entityId: productId,
          action: "SHOPIFY_PUBLISH",
          performedBy: "ADMIN",
          detailsJson: JSON.stringify({
            shopifyProductId: result.shopifyProductId,
            mocked: result.mocked,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        product: updated,
        shopify: result,
      });
    }

    // Sync all READY_TO_TEST and VALIDATED products
    const products = await db.product.findMany({
      where: {
        status: { in: ["READY_TO_TEST", "AD_TESTING", "VALIDATED", "SCALE"] },
        shopifyStatus: { not: "active" },
      },
    });

    const results = [];
    for (const p of products) {
      try {
        const result = await shopifyService.createOrUpdateProduct({
          title: p.title,
          descriptionHtml: p.description || "",
          price: p.sellingPrice,
          sku: p.slug,
        });

        await db.product.update({
          where: { id: p.id },
          data: {
            shopifyProductId: result.shopifyProductId,
            shopifyHandle: result.shopifyHandle,
            shopifyStatus: "active",
          },
        });

        results.push({ id: p.id, title: p.title, success: true, mocked: result.mocked });
      } catch (err: any) {
        results.push({ id: p.id, title: p.title, success: false, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      synced: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
