import { LandedCostBreakdown } from "@/lib/types";

export interface CostCalculationInputs {
  supplierCost: number;          // Supplier unit price (₹)
  supplierShipping?: number;      // Domestic shipping from supplier to customer (₹)
  packagingCost?: number;         // Custom box, bubble wrap, branded sticker (₹)
  adAllocation?: number;          // Target blended CPA / Meta Ad spend per order (₹)
  sellingPrice?: number;          // Retail price on Shopify store (₹)
  rtoRatePercent?: number;        // Expected Return to Origin / failure rate (default 12%)
  paymentGatewayPercent?: number; // Razorpay / Cashfree / Shopify Payments fee (default 2%)
  targetMarginPercent?: number;   // Target contribution margin % (default 35%)
  gstRatePercent?: number;        // GST rate (default 18% with input credit)
}

export class PricingEngine {
  /**
   * Calculates true landed cost, contribution profit, and pricing bounds.
   */
  public static calculate(inputs: CostCalculationInputs): LandedCostBreakdown {
    const supplierCost = Math.max(0, inputs.supplierCost || 0);
    const supplierShipping = Math.max(0, inputs.supplierShipping ?? 70);
    const packagingCost = Math.max(0, inputs.packagingCost ?? 25);
    const adAllocation = Math.max(0, inputs.adAllocation ?? 180);
    const rtoRate = (inputs.rtoRatePercent ?? 12) / 100;
    const gatewayRate = (inputs.paymentGatewayPercent ?? 2) / 100;
    const targetMargin = (inputs.targetMarginPercent ?? 35) / 100;

    // Direct logistics & product floor
    const directProductBase = supplierCost + supplierShipping + packagingCost;

    // RTO penalty per shipped order = RTO% * (Forward Shipping + Reverse Shipping + Packaging Loss)
    const returnPenalty = rtoRate * (supplierShipping * 1.8 + packagingCost);
    const expectedReturnCost = Math.round(returnPenalty);

    // Initial estimation of minimum viable price (Floor):
    // Floor = (directBase + returnCost + adAllocation) / (1 - gatewayRate - platformCostRate)
    const baseVariableCosts = directProductBase + expectedReturnCost + adAllocation;
    const minViablePrice = Math.round(baseVariableCosts / (1 - 0.05));

    // Dynamic Recommended Price targeting target margin (e.g. 35% contribution margin):
    // Price = (directBase + returnCost + adAllocation) / (1 - gatewayRate - targetMargin)
    const divisor = Math.max(0.2, 1 - gatewayRate - targetMargin);
    const rawRecommendedPrice = baseVariableCosts / divisor;
    // Format to psychological retail ending (.e.g 999, 1299, 1499)
    const recommendedPrice = this.toPsychologicalPrice(rawRecommendedPrice);

    // Actual or selected selling price
    const sellingPrice = inputs.sellingPrice && inputs.sellingPrice > 0 
      ? inputs.sellingPrice 
      : recommendedPrice;

    // Variable transaction fees based on selling price
    const gatewayFee = Math.round(sellingPrice * gatewayRate);
    const shopifyPlatformCost = Math.round(sellingPrice * 0.02); // 2% platform & app fee allocation
    const taxGst = Math.round((sellingPrice - supplierCost) * 0.05); // Estimated net GST burden with ITC

    // True Landed Cost
    const trueCost =
      supplierCost +
      supplierShipping +
      packagingCost +
      gatewayFee +
      shopifyPlatformCost +
      expectedReturnCost +
      adAllocation +
      taxGst;

    const contributionProfit = Math.round(sellingPrice - trueCost);
    const contributionMarginPercent = sellingPrice > 0 
      ? Number(((contributionProfit / sellingPrice) * 100).toFixed(1)) 
      : 0;

    const premiumPrice = this.toPsychologicalPrice(recommendedPrice * 1.35);

    return {
      supplierCost,
      supplierShipping,
      packagingCost,
      gatewayFee,
      shopifyPlatformCost,
      expectedReturnCost,
      advertisingAllocation: adAllocation,
      taxGst,
      trueCost,
      sellingPrice,
      contributionProfit,
      contributionMarginPercent,
      minViablePrice,
      recommendedPrice,
      premiumPrice,
    };
  }

  /**
   * Rounds a price to standard Indian e-commerce charm pricing endings (e.g., ₹999, ₹1299, ₹1499)
   */
  private static toPsychologicalPrice(price: number): number {
    if (price <= 499) return 499;
    if (price <= 799) return 799;
    if (price <= 999) return 999;
    if (price <= 1299) return 1299;
    if (price <= 1499) return 1499;
    if (price <= 1999) return 1999;
    if (price <= 2499) return 2499;
    if (price <= 2999) return 2999;
    return Math.round(price / 100) * 100 - 1;
  }
}
