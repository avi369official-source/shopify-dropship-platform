export type ProductLifecycleStatus =
  | "DISCOVERED"
  | "RESEARCHING"
  | "SUPPLIER_VERIFIED"
  | "SAMPLE_TESTED"
  | "READY_TO_TEST"
  | "AD_TESTING"
  | "PROMISING"
  | "VALIDATED"
  | "SCALE"
  | "REJECTED";

export type SupplierVerificationStatus =
  | "UNVERIFIED"
  | "CONTACTED"
  | "SAMPLE_ORDERED"
  | "VERIFIED"
  | "REJECTED";

export type SupplierOrderStatus =
  | "AWAITING_SUPPLIER"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "EXCEPTION"
  | "CANCELLED";

export type ProductRatingCategory =
  | "Candidate"
  | "Testing"
  | "Promising"
  | "Validated"
  | "Rejected";

export interface LandedCostBreakdown {
  supplierCost: number;
  supplierShipping: number;
  packagingCost: number;
  gatewayFee: number;
  shopifyPlatformCost: number;
  expectedReturnCost: number;
  advertisingAllocation: number;
  taxGst: number;
  trueCost: number;
  sellingPrice: number;
  contributionProfit: number;
  contributionMarginPercent: number;
  minViablePrice: number;
  recommendedPrice: number;
  premiumPrice: number;
}

export interface SupplierVerificationChecklist {
  gstDetailsChecked: boolean;
  businessIdentityChecked: boolean;
  supplierContacted: boolean;
  sampleOrdered: boolean;
  sampleQualityVerified: boolean;
  shippingTested: boolean;
  packagingChecked: boolean;
  returnProcessConfirmed: boolean;
  dropshippingAgreementConfirmed: boolean;
}
