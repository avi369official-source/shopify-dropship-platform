import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PricingEngine } from "@/services/pricing/calculator";

/**
 * POST /api/pricing
 * Body: CostCalculationInputs
 * Returns a full landed cost breakdown
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const breakdown = PricingEngine.calculate(body);
    return NextResponse.json({ success: true, breakdown });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * GET /api/pricing?productId=xxx
 * Returns the saved landed cost breakdown for a given product and its supplier
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        supplierProducts: { take: 1 },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const sp = product.supplierProducts[0];
    const breakdown = PricingEngine.calculate({
      supplierCost: sp?.unitCost || 0,
      supplierShipping: sp?.shippingCost || 70,
      packagingCost: sp?.packagingCost || 25,
      sellingPrice: product.sellingPrice,
    });

    return NextResponse.json({ success: true, breakdown, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
