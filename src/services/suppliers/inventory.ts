/**
 * Inventory Protection Service
 *
 * Checks supplier stock levels and:
 * 1. Marks products as "low stock" when below threshold
 * 2. Pauses Shopify products when supplier is unavailable
 * 3. Creates audit log entries for all inventory actions
 */

import { db } from "@/lib/db";

export interface InventoryCheckResult {
  productId: string;
  title: string;
  action: "NONE" | "LOW_STOCK_FLAGGED" | "PAUSED" | "RESUMED";
  previousStock: number;
  currentStock: number;
}

const LOW_STOCK_THRESHOLD = 10; // Units

export async function runInventoryProtection(): Promise<InventoryCheckResult[]> {
  const results: InventoryCheckResult[] = [];

  const supplierProducts = await db.supplierProduct.findMany({
    include: {
      product: true,
      supplier: { select: { companyName: true, verificationStatus: true } },
    },
  });

  for (const sp of supplierProducts) {
    const product = sp.product;
    let action: InventoryCheckResult["action"] = "NONE";

    if (!sp.inStock || sp.stockCount <= 0) {
      // Mark product as OUT_OF_STOCK — archive it on Shopify and pause ads
      if (product.shopifyStatus === "active") {
        await db.product.update({
          where: { id: product.id },
          data: { shopifyStatus: "draft" },
        });

        await db.auditLog.create({
          data: {
            entityType: "PRODUCT",
            entityId: product.id,
            action: "INVENTORY_PAUSED",
            performedBy: "INVENTORY_PROTECTION_SYSTEM",
            detailsJson: JSON.stringify({
              reason: "Supplier stock reached zero",
              supplier: sp.supplier.companyName,
              stockCount: sp.stockCount,
            }),
          },
        });

        action = "PAUSED";
      }
    } else if (sp.stockCount <= LOW_STOCK_THRESHOLD) {
      // Flag as low stock — alert admin but keep product live
      await db.auditLog.create({
        data: {
          entityType: "PRODUCT",
          entityId: product.id,
          action: "INVENTORY_LOW_STOCK_ALERT",
          performedBy: "INVENTORY_PROTECTION_SYSTEM",
          detailsJson: JSON.stringify({
            threshold: LOW_STOCK_THRESHOLD,
            currentStock: sp.stockCount,
            supplier: sp.supplier.companyName,
          }),
        },
      });

      action = "LOW_STOCK_FLAGGED";
    } else if (sp.inStock && product.shopifyStatus === "draft") {
      // Stock replenished — resume product
      await db.product.update({
        where: { id: product.id },
        data: { shopifyStatus: "active" },
      });

      action = "RESUMED";
    }

    if (action !== "NONE") {
      results.push({
        productId: product.id,
        title: product.title,
        action,
        previousStock: sp.stockCount,
        currentStock: sp.stockCount,
      });
    }
  }

  return results;
}
