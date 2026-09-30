# Antigravity Implementation Plan
## AI-Powered Shopify Dropshipping Platform — IndiaMART + Shopify + Meta

> **Goal:** Build a production-ready, automation-first Shopify dropshipping operating system centered around product discovery, supplier sourcing, product validation, Shopify publishing, Meta marketing workflows, order routing, fulfillment, and profitability analytics.
>
> **Important:** Do not build an automated Facebook Marketplace spam/posting bot or mechanisms intended to bypass Meta restrictions, rate limits, account protections, or commerce policies. Build a Marketplace Assistant that prepares compliant listings and uses permitted Meta workflows with human approval where appropriate.

---

# 1. Product Vision

Build a production-ready ecommerce platform centered around a Shopify store that automates as much of the dropshipping lifecycle as possible:

```text
PRODUCT DISCOVERY
       ↓
TREND / DEMAND RESEARCH
       ↓
PRODUCT SCORING
       ↓
INDIAMART SUPPLIER DISCOVERY
       ↓
SUPPLIER VERIFICATION
       ↓
LANDED COST CALCULATION
       ↓
PROFITABILITY CHECK
       ↓
PRODUCT IMPORT
       ↓
AI PRODUCT CONTENT
       ↓
SHOPIFY PRODUCT
       ↓
META CATALOG / AD WORKFLOW
       ↓
CUSTOMER ORDER
       ↓
SUPPLIER ORDER
       ↓
TRACKING
       ↓
CUSTOMER NOTIFICATION
       ↓
ANALYTICS
       ↓
WINNER / LOSER DECISION
```

The objective is **not to automate everything blindly**. Every automation should have a human approval point wherever supplier reliability, product compliance, advertising claims, or marketplace policy could create business risk.

Shopify's own guidance makes the merchant responsible for product safety, shipping information, refunds, applicable laws, and supplier-related fulfillment issues.

---

# 2. Core Architecture

Use a modular architecture.

```text
                    ┌─────────────────────┐
                    │    ADMIN DASHBOARD  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   BACKEND / API     │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       ▼                       ▼                       ▼
 PRODUCT ENGINE          SUPPLIER ENGINE         ORDER ENGINE
       │                       │                       │
       ▼                       ▼                       ▼
 Product Research        IndiaMART Data         Shopify Orders
 Product Scoring         Supplier Database      Fulfillment
 AI Content              Cost Analysis          Tracking
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   AUTOMATION LAYER  │
                    │       n8n           │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
           Shopify           Meta             Email/SMS
```

## Recommended Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Recharts

### Backend
- Node.js
- TypeScript
- REST API
- Webhooks

### Database
- PostgreSQL
- Prisma ORM

### Automation
- n8n

### AI
- LLM API
- Product analysis
- Product description generation
- Ad-copy generation
- Product scoring
- Customer-support assistance

### Commerce
- Shopify Admin API
- Shopify webhooks
- Shopify product/catalog system

### Marketing
- Meta Business integrations
- Meta Pixel / Conversions API where applicable
- Meta product catalog

Shopify's current API terms also require applications to request only the merchant data necessary for their intended function and prohibit unauthorized systematic data collection through the Shopify API. Design the integration accordingly.

---

# 3. Admin Dashboard

Build the dashboard as the command center.

## Dashboard KPIs

Display:

```text
Revenue
Orders
Profit
Ad Spend
ROAS
Conversion Rate
Average Order Value
Refunds
Winning Products
Testing Products
Failed Products
Supplier Issues
```

Example:

```text
┌─────────────────────────────────────────────┐
│              STORE OVERVIEW                 │
├──────────┬──────────┬──────────┬────────────┤
│ Revenue  │ Orders   │ Profit   │ ROAS       │
│ ₹84,250  │ 127      │ ₹28,430  │ 3.42       │
└──────────┴──────────┴──────────┴────────────┘

TOP PRODUCTS

Product          Sales    Profit    ROAS
─────────────────────────────────────────────
Mini Blender     ₹42,500  ₹14,200   4.21
Car Gadget       ₹21,400  ₹7,600    3.82
Desk Light       ₹12,800  ₹3,900    2.91
```

---

# 4. Product Research Engine

Create a **Product Discovery** section.

Each product gets a score.

## Product Score

Example:

```text
Demand                    20/25
Competition               17/20
Supplier Availability     18/20
Profit Margin             18/20
Shipping Feasibility       9/10
Creative Potential         5/5
──────────────────────────────
TOTAL                     87/100
```

Do not call it a guaranteed "winning product."

Use:

- `Candidate`
- `Testing`
- `Promising`
- `Validated`
- `Rejected`

This avoids pretending that an algorithm can guarantee a winner.

---

# 5. IndiaMART Supplier Engine

Create a supplier management module.

## Supplier Record

```text
Supplier
──────────────
Company Name
Contact Person
Phone
Email
Location
IndiaMART URL
Product
MOQ
Unit Cost
Shipping Cost
GST
Dispatch Time
Return Policy
Payment Terms
Rating
Verification Status
Notes
```

## Supplier Verification

Add a checklist:

```text
☐ GST details checked
☐ Business identity checked
☐ Supplier contacted
☐ Product sample ordered
☐ Product quality verified
☐ Shipping tested
☐ Packaging checked
☐ Return process confirmed
☐ Dropshipping agreement confirmed
```

**Critical:** Do not assume an IndiaMART listing itself means the supplier is suitable for dropshipping.

The system should support **manual supplier verification**.

---

# 6. Landed Cost Calculator

This is extremely important.

Calculate:

```text
Product Cost
+ Supplier Shipping
+ Packaging
+ Payment Gateway Fee
+ Shopify Costs
+ Expected Returns
+ Advertising Cost
+ Taxes
────────────────────
TRUE COST
```

Then:

```text
Selling Price
− True Cost
= Contribution Profit
```

Example:

```text
Supplier price:        ₹320
Shipping:               ₹70
Packaging:              ₹20
Payment fee:             ₹15
Expected return cost:   ₹30
Advertising allocation: ₹180

TRUE COST = ₹635

Selling price = ₹999

Contribution = ₹364
```

The dashboard should calculate this automatically.

---

# 7. Product Import Pipeline

Create:

**Import Product**

```text
Supplier
      ↓
Product Information
      ↓
Images
      ↓
Cost
      ↓
Variants
      ↓
Shipping
      ↓
AI Processing
      ↓
Draft Product
```

AI generates:

- Product title
- Description
- Highlights
- Specifications
- FAQ
- SEO title
- SEO description
- Meta ad copy
- Short-form creative hooks

But AI-generated claims must not be published automatically where they could create misleading product/health/safety claims.

Meta requires products and advertising to comply with its Commerce Policy and Advertising Standards.

---

# 8. Shopify Integration

Connect the platform to Shopify using the official APIs.

## Products

```text
Create
Update
Archive
Publish
Unpublish
Inventory
Variants
Images
Collections
Tags
Metafields
```

## Orders

```text
New Order
Payment Confirmed
Fulfillment
Tracking
Cancelled
Refunded
```

## Webhooks

Implement:

```text
orders/create
orders/paid
orders/cancelled
orders/fulfilled
products/update
inventory_levels/update
```

---

# 9. Meta / Facebook Marketing Engine

Instead of creating a prohibited or fragile "Marketplace spam bot", build a **Meta marketing command center**.

Shopify's Facebook/Instagram channel can sync eligible products into Meta's catalog.

Dashboard:

```text
META MARKETING

Products
   ↓
Catalog
   ↓
Creative
   ↓
Campaign
   ↓
Ad Set
   ↓
Ad
   ↓
Performance
```

## Creative Package

Generate:

```text
Primary Text
Headline
Description
CTA
Creative Hook
Video Script
Image Brief
Audience Hypothesis
```

Then let the user approve/publish through supported Meta workflows.

---

# 10. Facebook Marketplace Workflow

Create a separate **Marketplace Assistant**, not an uncontrolled auto-poster.

Example:

```text
Product Selected
      ↓
AI Listing Generated
      ↓
Price Generated
      ↓
Images Prepared
      ↓
Marketplace Compliance Check
      ↓
USER APPROVAL
      ↓
Publish using permitted Meta workflow
      ↓
Track Listing
```

The system can maintain:

```text
Marketplace Listing ID
Product
Price
Views
Messages
Leads
Status
Created Date
```

---

# 11. Order Automation

This is where the business becomes powerful.

```text
CUSTOMER ORDERS
       ↓
Shopify
       ↓
Order Validation
       ↓
Supplier Mapping
       ↓
Supplier Order
       ↓
Supplier Confirmation
       ↓
Tracking Number
       ↓
Shopify Fulfillment
       ↓
Customer Notification
```

## Supplier Mapping

```text
Shopify Product
       ↓
Supplier Product ID
       ↓
Supplier Contact
       ↓
Supplier Price
       ↓
Fulfillment Method
```

If the supplier cannot support an API, initially support:

```text
Manual
WhatsApp
Email
CSV
Portal
```

Then add API integrations later.

---

# 12. Supplier Order Queue

Do not immediately send every order blindly.

Create:

```text
NEW ORDER
    ↓
AWAITING SUPPLIER
    ↓
CONFIRMED
    ↓
PROCESSING
    ↓
SHIPPED
    ↓
DELIVERED
```

With exception states:

```text
OUT OF STOCK
PRICE CHANGED
SUPPLIER UNAVAILABLE
ADDRESS ERROR
PAYMENT ISSUE
DELAYED
RETURN
```

---

# 13. Inventory Protection

One of the biggest dropshipping problems is:

> Customer buys → supplier is suddenly out of stock.

Build:

```text
Supplier Stock
       ↓
Inventory Sync
       ↓
Shopify Inventory
```

If stock falls below threshold:

```text
Supplier stock < minimum
       ↓
Mark product low stock
       ↓
Alert admin
```

If unavailable:

```text
Supplier unavailable
       ↓
Pause Shopify product
       ↓
Pause marketing
       ↓
Notify admin
```

---

# 14. Dynamic Pricing Engine

Build a pricing engine rather than manually calculating every product.

## Inputs

```text
Supplier Cost
Shipping
Tax
Gateway Fee
Target Margin
Advertising Cost
Return Risk
Competitor Price
```

## Output

```text
Recommended Price
Minimum Price
Maximum Price
Expected Profit
Expected Margin
```

Example:

```text
Supplier Cost     ₹300
Shipping           ₹70
Estimated Ads     ₹180
Other Costs        ₹50

Minimum viable price = ₹700

Recommended price = ₹999
```

---

# 15. Winning Product Analytics

Every product should have its own dashboard.

```text
PRODUCT PERFORMANCE

Product: Portable Blender

Views             18,420
Add to Cart        632
Checkout           210
Orders              87

Revenue         ₹86,913
Ad Spend        ₹22,400
Product Cost    ₹27,840
Shipping         ₹6,090

Contribution    ₹30,583
```

Track:

- CTR
- CPC
- CPM
- Add-to-cart rate
- Checkout rate
- Conversion rate
- CAC
- ROAS
- Contribution margin
- Refund rate
- Delivery time

---

# 16. Product Lifecycle

Every product moves through a state machine:

```text
DISCOVERED
    ↓
RESEARCHING
    ↓
SUPPLIER VERIFIED
    ↓
SAMPLE TESTED
    ↓
READY TO TEST
    ↓
AD TESTING
    ↓
PROMISING
    ↓
VALIDATED
    ↓
SCALE
```

Failure:

```text
REJECTED
```

Possible reasons:

```text
Low demand
Low margin
High competition
Poor supplier
Poor quality
High refund rate
High CAC
Shipping problems
Policy risk
```

---

# 17. AI Product Analyst

Give the AI structured information:

```text
Product
Supplier
Cost
Shipping
Market
Competitor prices
Ad metrics
Conversion
Refunds
Reviews
```

Ask it to produce:

```text
PRODUCT ANALYSIS

Demand:
Medium

Margin:
High

Supplier Risk:
Medium

Creative Potential:
High

Shipping Risk:
Low

Recommended Action:
Continue controlled testing

Reason:
...
```

Do **not** let AI automatically spend large advertising budgets based only on its own judgment.

---

# 18. Automation with n8n

Use n8n as the orchestration layer.

## Workflow 1 — New Product

```text
Trigger
 ↓
Product Added
 ↓
AI Analysis
 ↓
Calculate Margin
 ↓
Supplier Check
 ↓
Create Draft
 ↓
Admin Notification
```

## Workflow 2 — New Shopify Order

```text
Shopify Webhook
 ↓
Validate Order
 ↓
Find Supplier
 ↓
Create Supplier Order
 ↓
Record Supplier Order ID
```

## Workflow 3 — Tracking

```text
Supplier Tracking
 ↓
Webhook / API / Manual Update
 ↓
Shopify Fulfillment
 ↓
Customer Email
```

## Workflow 4 — Low Stock

```text
Inventory Check
 ↓
Stock < Threshold
 ↓
Pause Marketing
 ↓
Alert Admin
```

## Workflow 5 — Product Performance

```text
Daily Metrics
 ↓
Calculate KPIs
 ↓
AI Analysis
 ↓
Dashboard
 ↓
Recommendation
```

---

# 19. Database Structure

Start with:

```text
users
stores
products
product_variants
suppliers
supplier_products
supplier_prices
supplier_orders
customers
orders
order_items
fulfillments
tracking
marketplace_listings
campaigns
ad_sets
ads
ad_metrics
product_metrics
product_scores
automation_jobs
notifications
audit_logs
```

## Important Relationships

```text
Product
 ├── Supplier Product
 ├── Shopify Product
 ├── Marketplace Listing
 ├── Campaigns
 ├── Orders
 └── Metrics
```

---

# 20. Security

Implement:

- Shopify OAuth
- encrypted API credentials
- environment variables
- webhook signature verification
- role-based access
- audit logs
- rate limiting
- request validation
- database backups
- encrypted sensitive data
- secure admin authentication

Never put:

```text
SHOPIFY_ACCESS_TOKEN
META_ACCESS_TOKEN
API_KEYS
DATABASE_PASSWORD
```

inside frontend code.

---

# 21. Admin Pages

Build these pages:

```text
/dashboard

/products
/products/discover
/products/testing
/products/winners
/products/rejected

/suppliers
/suppliers/pending
/suppliers/verified

/orders
/orders/pending
/orders/processing
/orders/shipped
/orders/problems

/marketing
/marketing/meta
/marketing/marketplace
/marketing/creative

/analytics
/analytics/products
/analytics/ads
/analytics/profit

/automation
/automation/workflows

/settings
/settings/shopify
/settings/meta
/settings/notifications
/settings/suppliers
```

---

# 22. UI Design

Make it feel like a **professional SaaS operating system**, not a generic Shopify app.

## Style

```text
Dark / light mode
Minimal cards
Large KPI numbers
Charts
Tables
Filters
Status badges
Command palette
Quick actions
AI assistant panel
```

## Dashboard Navigation

```text
Overview

PRODUCTS
  Discover
  Testing
  Winners

SUPPLIERS
  Suppliers
  Verification

ORDERS
  Orders
  Fulfillment
  Exceptions

MARKETING
  Meta
  Marketplace
  Creatives

ANALYTICS
  Revenue
  Profit
  Products
  Ads

AUTOMATION
  Workflows
  Logs
```

---

# 23. AI Command Center

Add an AI assistant inside the admin.

Example commands:

> "Find products with margin above 40%."

> "Show products that spent more than ₹2,000 without an order."

> "Which products have the highest contribution margin?"

> "Create a product listing for this supplier product."

> "Why did today's profit drop?"

> "Show suppliers with delayed orders."

The AI should query **your database**, not invent answers.

---

# 24. MVP — Build This First

Do not build the entire system simultaneously.

## Phase 1 — Shopify + Dashboard

```text
✓ Admin authentication
✓ Shopify connection
✓ Product management
✓ Order management
✓ Basic analytics
✓ Database
```

## Phase 2 — Supplier System

```text
✓ IndiaMART supplier records
✓ Product/supplier mapping
✓ Cost calculator
✓ Supplier verification
✓ Supplier order queue
```

## Phase 3 — AI

```text
✓ Product scoring
✓ Product descriptions
✓ Ad copy
✓ Product analysis
✓ Pricing recommendations
```

## Phase 4 — Meta

```text
✓ Meta connection
✓ Product catalog
✓ Creative generation
✓ Campaign management/assistance
✓ Performance analytics
```

## Phase 5 — Automation

```text
✓ Order routing
✓ Supplier notifications
✓ Tracking
✓ Inventory alerts
✓ Marketing alerts
```

## Phase 6 — Advanced Intelligence

```text
✓ Product scoring model
✓ Supplier reliability score
✓ Profit forecasting
✓ Product lifecycle automation
✓ AI business analyst
```

---

# 25. Antigravity Execution Rules

Give Antigravity these rules:

```text
1. Use TypeScript throughout the application.

2. Build modularly.

3. Never hard-code API credentials.

4. Use environment variables.

5. Use PostgreSQL + Prisma.

6. Use Shopify's official APIs.

7. Use Shopify webhooks wherever possible.

8. Build Meta integration using supported Meta/Shopify interfaces.

9. Do not build mechanisms intended to bypass Meta restrictions,
   rate limits, account protections, or commerce policies.

10. Do not create mass-spam Marketplace posting functionality.

11. Marketplace functionality must use permitted workflows.

12. Every automated financial or supplier action must be auditable.

13. Every automation must have logs.

14. Every external API request must have error handling.

15. Every webhook must be authenticated.

16. Use queues for asynchronous jobs.

17. Make integrations replaceable through adapters.

18. Never tightly couple the IndiaMART supplier layer
    to the Shopify layer.

19. Never assume supplier information is accurate without verification.

20. Never automatically publish potentially misleading AI-generated
    product claims.

21. Build a human approval layer for high-risk actions.

22. Write tests for critical order and payment flows.

23. Build the MVP before advanced AI functionality.

24. Do not use fake API responses in production code.

25. Create documentation for every integration.
```

---

# 26. Recommended System Architecture

```text
                    ┌───────────────────┐
                    │    Next.js UI     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    Node.js API    │
                    └─────────┬─────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        PostgreSQL         Redis/Queue       AI Layer
             │                │                │
             │                ▼                │
             │              n8n ◄──────────────┘
             │                │
       ┌─────┼────────────────┼─────────────┐
       │     │                │             │
       ▼     ▼                ▼             ▼
    Shopify Meta          Suppliers      Notifications
       │     │
       ▼     ▼
    Orders  Marketing
```

---

# 27. The Most Important Business Loop

Ultimately, the entire platform should optimize this:

```text
DISCOVER
   ↓
SOURCE
   ↓
TEST
   ↓
MEASURE
   ↓
KILL OR IMPROVE
   ↓
SCALE
   ↓
PROFIT
```

Not:

```text
Find product → automatically advertise everything
```

The second approach can burn money very quickly.

Shopify itself describes dropshipping as requiring product research, supplier selection, store creation, marketing, and ongoing analysis rather than simply uploading products and letting them run automatically.

Also build the legal/compliance layer from day one: Shopify states that the merchant remains responsible for applicable laws, product safety, shipping/processing disclosures, refunds, and other obligations.

---

# 28. Final Antigravity Build Sequence

```text
WEEK 1
Architecture
Database
Authentication
Shopify connection

        ↓

WEEK 2
Product engine
Supplier database
Cost calculator

        ↓

WEEK 3
Order management
Supplier fulfillment
Tracking

        ↓

WEEK 4
AI product engine
Product scoring
AI content generation

        ↓

WEEK 5
Meta integration
Catalog
Creative management
Analytics

        ↓

WEEK 6
n8n automation
Inventory monitoring
Supplier/order automation

        ↓

WEEK 7
Profit analytics
Product lifecycle
AI analyst

        ↓

WEEK 8
Security
Testing
Error handling
Production deployment
```

---

# 29. Final Architecture Principle

The key design decision is:

```text
SHOPIFY
   │
   │  Commerce Source of Truth
   ▼
NODE.JS + POSTGRES
   │
   │  Business Intelligence +
   │  Orchestration Layer
   ▼
n8n
   │
   │  Workflow Automation
   ├──────────────┐
   ▼              ▼
IndiaMART       META
Supplier        Marketing
Layer           Layer
```

This gives you a system that can later expand to:

- Multiple suppliers
- Multiple Shopify stores
- Additional marketplaces
- More supplier integrations
- Advanced product scoring
- Automated supplier monitoring
- Advanced profitability forecasting
- A private dropshipping management platform

## Core Principle

**The platform should automate repetitive operations, not remove human judgment from high-risk decisions.**

The central loop remains:

```text
DISCOVER → SOURCE → TEST → MEASURE → IMPROVE/KILL → SCALE → PROFIT
```
