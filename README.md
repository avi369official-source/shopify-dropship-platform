# Shopify Dropshipping Operating System

**AI-Powered Dropshipping Platform — IndiaMART Sourcing + Shopify + Meta Marketing**

Built for Indian e-commerce entrepreneurs running COD/Prepaid dropshipping businesses using IndiaMART wholesale suppliers and Meta (Facebook/Instagram) advertising.

---

## What This Platform Does

```
IndiaMART Supplier  →  Shopify Store  →  Meta Ads  →  Customer Orders  →  Auto Dispatch  →  Profit
```

Instead of manually calculating margins, messaging suppliers on WhatsApp, and tracking orders in spreadsheets — this platform manages the **entire dropshipping lifecycle in one operating system**.

---

## Key Features

| Module | What It Does |
|---|---|
| **Landed Cost Calculator** | Calculates your true profit after RTO failure rates (Indian COD), shipping, Meta ad CPA, gateway fees & taxes |
| **Product Lifecycle Engine** | 6-factor algorithmic product scoring (Demand, Competition, Margin, Supplier Reliability, Shipping, Creative) |
| **IndiaMART Supplier Directory** | 9-step verification audit with GSTIN, sample testing tracker, and blind dropshipping agreement status |
| **Supplier Order Queue** | State machine: Awaiting → Confirmed → Shipped → Delivered with Air Waybill entry and Shopify auto-fulfillment |
| **Meta Creative Suite** | 3 ad hook angles, video storyboard scripts, and Facebook Marketplace listing preparation |
| **Profitability Analytics** | 14-day revenue ledger with WoW trends, contribution margins, and product profit rankings |

---

## Tech Stack

- **Frontend & Backend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod via Docker)
- **Infrastructure**: Docker Compose (PostgreSQL 16 + Redis)
- **AI Engine**: Algorithmic 6-factor scoring + template-based compliant copy generation

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up the database
npx prisma db push

# 3. Seed with realistic IndiaMART supplier data
npx prisma db seed

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the platform runs in **Mock Mode** by default with realistic seed data.

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/       # Executive KPIs & store overview
│   │   ├── products/        # Product lifecycle, scoring, dossier, import wizard
│   │   ├── suppliers/       # IndiaMART supplier directory & 9-step verification
│   │   ├── orders/          # Shopify orders & supplier dispatch queue
│   │   ├── calculator/      # True landed cost & dynamic pricing engine
│   │   ├── marketing/       # Meta campaigns, creative suite, marketplace assistant
│   │   ├── analytics/       # 14-day profitability ledger & product rankings
│   │   └── settings/        # Shopify, Meta, and AI API integrations
│   └── api/
│       ├── products/        # Create product with auto-scoring and copy generation
│       ├── shopify/webhooks/# HMAC-authenticated Shopify order ingestion
│       ├── suppliers/       # Verification checklist persistence
│       └── orders/          # Dispatch queue updates and Shopify fulfillment sync
├── services/
│   ├── pricing/             # True landed cost formula & psychological pricing
│   ├── ai/                  # Product scoring engine + policy-compliant copywriter
│   └── shopify/             # Shopify Admin API client (dual Mock & Live mode)
└── lib/
    ├── db.ts                # Prisma client singleton
    ├── types.ts             # Lifecycle enums and shared types
    └── utils.ts             # INR currency formatting & date helpers
```

---

## Connecting Live APIs

The app runs in `MOCK_MODE=true` by default. To connect live accounts:

1. Get your **Shopify Admin API Access Token** from `Store Admin → Apps → Develop apps`.
2. Set up your **Meta Business Manager** and get your Ad Account ID.
3. Edit `.env`:

```env
MOCK_MODE=false
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
META_ACCESS_TOKEN=...
META_AD_ACCOUNT_ID=act_...
```

4. Register the Shopify webhook endpoint in your store admin:
   ```
   POST https://your-domain.com/api/shopify/webhooks
   Topics: orders/create, orders/paid, orders/fulfilled
   ```

---

## Important Guidelines

- **Never auto-spend on Meta ads** based purely on algorithmic scoring — validate with small test budgets first.
- **Always verify IndiaMART suppliers** with the 9-step checklist before accepting customer orders.
- **RTO rates in India** typically range from 10–20% on COD orders — always factor this into your landed cost.
- **Meta ad copy compliance** — the platform includes automatic compliance validation against prohibited claim categories.

---

## License

Private — Avidnt
