import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PricingEngine } from "@/services/pricing/calculator";
import { ProductScoringEngine } from "@/services/ai/scoring";
import { AICopywriterEngine } from "@/services/ai/copywriter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      supplierCost,
      sellingPrice,
      supplierShipping = 70,
      packagingCost = 25,
      adAllocation = 180,
      rtoRate = 12,
      supplierId,
      images,
    } = body;

    if (!title || !supplierCost) {
      return NextResponse.json(
        { error: "Title and Supplier Cost are required." },
        { status: 400 }
      );
    }

    // 1. Calculate Unit Economics
    const economics = PricingEngine.calculate({
      supplierCost: Number(supplierCost),
      supplierShipping: Number(supplierShipping),
      packagingCost: Number(packagingCost),
      adAllocation: Number(adAllocation),
      rtoRatePercent: Number(rtoRate),
      sellingPrice: sellingPrice ? Number(sellingPrice) : undefined,
    });

    // 2. Algorithmic Score
    const scoreResult = ProductScoringEngine.evaluate({
      title,
      category: category || "General",
      supplierCost: Number(supplierCost),
      retailPrice: economics.sellingPrice,
      supplierVerified: Boolean(supplierId),
    });

    // 3. AI Copy Package
    const copyPackage = AICopywriterEngine.generatePackage({
      title,
      category: category || "General",
      price: economics.sellingPrice,
    });

    // 4. Generate unique slug
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}-${Date.now().toString().slice(-4)}`;

    // 5. Save to Prisma
    const product = await db.product.create({
      data: {
        title,
        slug,
        category: category || "General",
        status: scoreResult.totalScore >= 75 ? "READY_TO_TEST" : "RESEARCHING",
        sellingPrice: economics.sellingPrice,
        trueCost: economics.trueCost,
        estimatedProfit: economics.contributionProfit,
        targetMargin: economics.contributionMarginPercent,
        minPrice: economics.minViablePrice,
        maxPrice: economics.premiumPrice,
        images: images || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
        score: {
          create: {
            demandScore: scoreResult.demandScore,
            competitionScore: scoreResult.competitionScore,
            supplierScore: scoreResult.supplierScore,
            marginScore: scoreResult.marginScore,
            shippingScore: scoreResult.shippingScore,
            creativeScore: scoreResult.creativeScore,
            totalScore: scoreResult.totalScore,
            ratingCategory: scoreResult.ratingCategory,
            reasoning: scoreResult.reasoning,
          },
        },
        content: {
          create: {
            hook1: copyPackage.hook1,
            hook2: copyPackage.hook2,
            hook3: copyPackage.hook3,
            headline: copyPackage.headline,
            primaryText: copyPackage.primaryText,
            videoScript: copyPackage.videoScript,
            bulletFeatures: JSON.stringify(copyPackage.bulletFeatures),
            faqJson: JSON.stringify(copyPackage.faqList),
            seoTitle: copyPackage.seoTitle,
            seoDescription: copyPackage.seoDescription,
            compliancePassed: copyPackage.compliancePassed,
            complianceNotes: copyPackage.complianceNotes,
          },
        },
        variants: {
          create: {
            title: "Standard Edition",
            sku: `SKU-${Date.now().toString().slice(-6)}`,
            price: economics.sellingPrice,
            inventoryQuantity: 100,
          },
        },
      },
    });

    // Map supplier if provided
    if (supplierId) {
      await db.supplierProduct.create({
        data: {
          supplierId,
          productId: product.id,
          title,
          unitCost: Number(supplierCost),
          shippingCost: Number(supplierShipping),
          packagingCost: Number(packagingCost),
        },
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
