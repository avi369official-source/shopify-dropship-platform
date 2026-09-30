import { NextResponse } from "next/server";
import { runInventoryProtection } from "@/services/suppliers/inventory";

/**
 * POST /api/inventory/check
 * Runs the inventory protection sweep:
 * - Pauses Shopify products with zero stock
 * - Flags low-stock products
 * - Resumes paused products when stock replenishes
 */
export async function POST() {
  try {
    const results = await runInventoryProtection();
    return NextResponse.json({
      success: true,
      checked: results.length,
      paused: results.filter((r) => r.action === "PAUSED").length,
      flagged: results.filter((r) => r.action === "LOW_STOCK_FLAGGED").length,
      resumed: results.filter((r) => r.action === "RESUMED").length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
