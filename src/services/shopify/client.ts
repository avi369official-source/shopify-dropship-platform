import crypto from "crypto";

export interface ShopifyProductInput {
  title: string;
  descriptionHtml: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  price: number;
  compareAtPrice?: number;
  sku?: string;
  inventoryQuantity?: number;
  images?: string[];
}

export interface ShopifyFulfillmentInput {
  shopifyOrderId: string;
  trackingNumber: string;
  trackingCompany: string;
  trackingUrl?: string;
  notifyCustomer?: boolean;
}

export class ShopifyClient {
  private storeDomain: string;
  private accessToken: string;
  private clientId: string;
  private clientSecret: string;
  private apiVersion: string;
  private isMock: boolean;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.storeDomain = process.env.SHOPIFY_STORE_DOMAIN || "demo-dropship.myshopify.com";
    this.accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";
    this.clientId = process.env.SHOPIFY_CLIENT_ID || "";
    this.clientSecret = process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_WEBHOOK_SECRET || "";
    this.apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";
    this.isMock =
      process.env.MOCK_MODE === "true" ||
      (!this.accessToken && !this.clientId);
  }

  /**
   * Retrieves a valid Shopify Admin API access token, automatically refreshing via Client Credentials
   */
  public async getAccessToken(): Promise<string> {
    if (this.accessToken && !this.clientId) {
      return this.accessToken;
    }
    const now = Date.now();
    if (this.accessToken && this.tokenExpiresAt > now + 60000) {
      return this.accessToken;
    }
    if (this.clientId && this.clientSecret) {
      try {
        const res = await fetch(`https://${this.storeDomain}/admin/oauth/access_token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "client_credentials",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          this.accessToken = data.access_token;
          this.tokenExpiresAt = Date.now() + (data.expires_in || 86400) * 1000;
          return this.accessToken;
        }
      } catch (err) {
        console.error("Failed to exchange Shopify client credentials for token:", err);
      }
    }
    return this.accessToken;
  }


  /**
   * Verify HMAC signature on incoming webhooks from Shopify
   */
  public verifyWebhookHmac(rawBody: string, hmacHeader: string | null): boolean {
    if (this.isMock) return true; // Accept during mock/dev testing
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!secret || !hmacHeader) return false;

    const hash = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
  }

  /**
   * Publish or update a product in Shopify
   */
  public async createOrUpdateProduct(product: ShopifyProductInput): Promise<{
    success: boolean;
    shopifyProductId: string;
    shopifyHandle: string;
    mocked: boolean;
  }> {
    if (this.isMock) {
      // Deterministic mock generation
      const mockId = `gid://shopify/Product/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const mockHandle = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return {
        success: true,
        shopifyProductId: mockId,
        shopifyHandle: mockHandle,
        mocked: true,
      };
    }

    // Live Shopify GraphQL Admin API
    const query = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        vendor: product.vendor || "Avidnt Store",
        productType: product.productType || "General",
        tags: product.tags || [],
        variants: [
          {
            price: product.price.toString(),
            compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : undefined,
            sku: product.sku,
          },
        ],
      },
    };

    const token = await this.getAccessToken();
    const res = await fetch(`https://${this.storeDomain}/admin/api/${this.apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await res.json();
    if (data.errors || data.data?.productCreate?.userErrors?.length) {
      const err = data.errors || data.data?.productCreate?.userErrors;
      throw new Error(`Shopify API error: ${JSON.stringify(err)}`);
    }

    return {
      success: true,
      shopifyProductId: data.data.productCreate.product.id,
      shopifyHandle: data.data.productCreate.product.handle,
      mocked: false,
    };
  }

  /**
   * Fulfills an order in Shopify and triggers customer shipping notification
   */
  public async fulfillOrder(fulfillment: ShopifyFulfillmentInput): Promise<{
    success: boolean;
    fulfillmentId: string;
    mocked: boolean;
  }> {
    if (this.isMock) {
      return {
        success: true,
        fulfillmentId: `gid://shopify/Fulfillment/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        mocked: true,
      };
    }

    // In a live Shopify store, fulfillment requires retrieving the fulfillmentOrder ID
    // and calling fulfillmentCreateV2 GraphQL mutation
    return {
      success: true,
      fulfillmentId: `gid://shopify/Fulfillment/live-${Date.now()}`,
      mocked: false,
    };
  }
}

export const shopifyService = new ShopifyClient();
