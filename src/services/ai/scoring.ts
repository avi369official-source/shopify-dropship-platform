import { ProductRatingCategory } from "@/lib/types";

export interface ScoringInputs {
  title: string;
  category: string;
  supplierCost: number;
  retailPrice: number;
  weightGrams?: number;
  fragile?: boolean;
  hasVideoProof?: boolean;
  searchVolumeEstimate?: "LOW" | "MEDIUM" | "HIGH" | "VIRAL";
  competitionDensity?: "LOW" | "MEDIUM" | "HIGH" | "SATURATED";
  supplierVerified?: boolean;
}

export interface ScoreResult {
  demandScore: number;         // /25
  competitionScore: number;    // /20
  supplierScore: number;       // /20
  marginScore: number;         // /20
  shippingScore: number;       // /10
  creativeScore: number;       // /5
  totalScore: number;          // /100
  ratingCategory: ProductRatingCategory;
  reasoning: string;
}

export class ProductScoringEngine {
  /**
   * Computes a structured 6-factor score for an IndiaMART candidate product.
   */
  public static evaluate(inputs: ScoringInputs): ScoreResult {
    // 1. Demand Score (/25)
    let demandScore = 15;
    if (inputs.searchVolumeEstimate === "VIRAL") demandScore = 24;
    else if (inputs.searchVolumeEstimate === "HIGH") demandScore = 20;
    else if (inputs.searchVolumeEstimate === "MEDIUM") demandScore = 16;
    else if (inputs.searchVolumeEstimate === "LOW") demandScore = 10;

    // 2. Competition Score (/20) (Higher score = less saturated / healthier competition)
    let competitionScore = 14;
    if (inputs.competitionDensity === "LOW") competitionScore = 19;
    else if (inputs.competitionDensity === "MEDIUM") competitionScore = 16;
    else if (inputs.competitionDensity === "HIGH") competitionScore = 11;
    else if (inputs.competitionDensity === "SATURATED") competitionScore = 6;

    // 3. Supplier Availability & Reliability (/20)
    let supplierScore = 12;
    if (inputs.supplierVerified) supplierScore += 6;
    if (inputs.supplierCost > 0) supplierScore += 2;
    supplierScore = Math.min(20, supplierScore);

    // 4. Profit Margin (/20)
    // Multiplier ratio: retailPrice / supplierCost
    const marginMultiplier = inputs.supplierCost > 0 ? inputs.retailPrice / inputs.supplierCost : 1;
    let marginScore = 10;
    if (marginMultiplier >= 3.5) marginScore = 20;
    else if (marginMultiplier >= 2.8) marginScore = 17;
    else if (marginMultiplier >= 2.2) marginScore = 14;
    else if (marginMultiplier >= 1.8) marginScore = 10;
    else marginScore = 5;

    // 5. Shipping Feasibility (/10) (Weight & Fragility)
    let shippingScore = 9;
    if (inputs.fragile) shippingScore -= 3;
    if (inputs.weightGrams && inputs.weightGrams > 1000) shippingScore -= 2;
    if (inputs.weightGrams && inputs.weightGrams > 2500) shippingScore -= 3;
    shippingScore = Math.max(2, Math.min(10, shippingScore));

    // 6. Creative Potential (/5) (Video hooks, problem solving, visual demonstration)
    let creativeScore = 3;
    if (inputs.hasVideoProof) creativeScore = 5;
    else creativeScore = 4;

    const totalScore = Math.round(
      demandScore + competitionScore + supplierScore + marginScore + shippingScore + creativeScore
    );

    let ratingCategory: ProductRatingCategory = "Candidate";
    if (totalScore >= 82) {
      ratingCategory = "Promising";
    } else if (totalScore >= 68) {
      ratingCategory = "Testing";
    } else if (totalScore >= 50) {
      ratingCategory = "Candidate";
    } else {
      ratingCategory = "Rejected";
    }

    const reasoning = `Scored ${totalScore}/100. Demand: ${demandScore}/25, Competition: ${competitionScore}/20, Supplier reliability: ${supplierScore}/20, Margin ratio: ${marginMultiplier.toFixed(1)}x (${marginScore}/20), Shipping feasibility: ${shippingScore}/10, Creative virality: ${creativeScore}/5. Classified as ${ratingCategory}.`;

    return {
      demandScore,
      competitionScore,
      supplierScore,
      marginScore,
      shippingScore,
      creativeScore,
      totalScore,
      ratingCategory,
      reasoning,
    };
  }
}
