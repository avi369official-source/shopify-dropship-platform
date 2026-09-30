import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting dropshipping OS seed...");

  // Clean existing records if any
  await prisma.auditLog.deleteMany();
  await prisma.dailyMetric.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.supplierOrder.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supplierProduct.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.productContent.deleteMany();
  await prisma.productScore.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  // 1. Store
  const store = await prisma.store.create({
    data: {
      domain: "demo-dropship.myshopify.com",
      name: "Avidnt Lifestyle India",
      currency: "INR",
      isActive: true,
      settingsJson: JSON.stringify({
        defaultTargetMargin: 35,
        defaultRtoRate: 12,
        autoFulfillThreshold: true,
      }),
    },
  });

  // 2. IndiaMART Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      companyName: "Shivani Home & Kitchenware Mfg",
      contactPerson: "Rajesh Patel",
      phone: "+91 98250 14820",
      whatsapp: "+91 98250 14820",
      email: "sales@shivanikitchenware.in",
      location: "Rajkot, Gujarat",
      indiamartUrl: "https://www.indiamart.com/shivanikitchenware-rajkot",
      gstNumber: "24AAECS1284P1Z3",
      rating: 4.7,
      verificationStatus: "VERIFIED",
      checklistJson: JSON.stringify({
        gstDetailsChecked: true,
        businessIdentityChecked: true,
        supplierContacted: true,
        sampleOrdered: true,
        sampleQualityVerified: true,
        shippingTested: true,
        packagingChecked: true,
        returnProcessConfirmed: true,
        dropshippingAgreementConfirmed: true,
      }),
      notes: "Direct manufacturer of personal blenders & plastic gadgets. 24h dispatch time. Accepts dropshipping labels.",
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      companyName: "Zenith Auto Innovations Pvt Ltd",
      contactPerson: "Amit Sharma",
      phone: "+91 98112 55921",
      whatsapp: "+91 98112 55921",
      email: "orders@zenithautoindia.com",
      location: "Noida, Uttar Pradesh",
      indiamartUrl: "https://www.indiamart.com/zenithauto-noida",
      gstNumber: "09AABCZ9942R1ZQ",
      rating: 4.5,
      verificationStatus: "VERIFIED",
      checklistJson: JSON.stringify({
        gstDetailsChecked: true,
        businessIdentityChecked: true,
        supplierContacted: true,
        sampleOrdered: true,
        sampleQualityVerified: true,
        shippingTested: true,
        packagingChecked: true,
        returnProcessConfirmed: true,
        dropshippingAgreementConfirmed: true,
      }),
      notes: "Automotive high-pressure gadgets & interior cleaning. Reliable stock inventory in Delhi NCR warehouse.",
    },
  });

  const supplier3 = await prisma.supplier.create({
    data: {
      companyName: "Aura Lighting Innovations",
      contactPerson: "Vikas Kulkarni",
      phone: "+91 97654 32109",
      whatsapp: "+91 97654 32109",
      email: "contact@auralighting.biz",
      location: "Surat, Gujarat",
      indiamartUrl: "https://www.indiamart.com/auralighting-surat",
      gstNumber: "24AACCA4812L1ZV",
      rating: 4.2,
      verificationStatus: "SAMPLE_ORDERED",
      checklistJson: JSON.stringify({
        gstDetailsChecked: true,
        businessIdentityChecked: true,
        supplierContacted: true,
        sampleOrdered: true,
        sampleQualityVerified: false,
        shippingTested: false,
        packagingChecked: false,
        returnProcessConfirmed: false,
        dropshippingAgreementConfirmed: false,
      }),
      notes: "Sample ordered on 24 Sep. Tracking package via DTDC. Awaiting build quality check.",
    },
  });

  // 3. Products
  // Product A: Mini Blender (WINNER / SCALE)
  const productBlender = await prisma.product.create({
    data: {
      title: "Portable Electric USB-C Mini Blender",
      slug: "portable-electric-usbc-mini-blender",
      description: "Rechargeable personal smoothie blender with 6 stainless steel blades and USB-C fast charging.",
      category: "Kitchen & Fitness",
      tags: "trending, blender, fitness, viral",
      status: "VALIDATED",
      sellingPrice: 999,
      trueCost: 635,
      estimatedProfit: 364,
      targetMargin: 36.4,
      minPrice: 699,
      maxPrice: 1299,
      shopifyProductId: "gid://shopify/Product/8492019481",
      shopifyHandle: "portable-electric-usbc-mini-blender",
      shopifyStatus: "active",
      images: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80",
    },
  });

  await prisma.productVariant.create({
    data: {
      productId: productBlender.id,
      title: "Fresh Mint Green / 400ml",
      sku: "BLND-MINT-400",
      price: 999,
      compareAtPrice: 1999,
      inventoryQuantity: 340,
      shopifyVariantId: "gid://shopify/ProductVariant/44910214819",
    },
  });

  await prisma.productScore.create({
    data: {
      productId: productBlender.id,
      demandScore: 22,
      competitionScore: 16,
      supplierScore: 19,
      marginScore: 18,
      shippingScore: 9,
      creativeScore: 5,
      totalScore: 89,
      ratingCategory: "Validated",
      reasoning: "High viral demand on Reels, verified Gujarat supplier with ₹320 unit cost, stellar 36.4% net contribution margin.",
    },
  });

  await prisma.productContent.create({
    data: {
      productId: productBlender.id,
      hook1: "Stop drinking lumpy protein shakes — this ₹999 blender crushes ice in 15 seconds.",
      hook2: "POV: You make fresh smoothies right at your desk without any messy cleanup.",
      hook3: "Why 4,800+ Indian fitness enthusiasts are carrying this portable blender everywhere.",
      headline: "⚡ 50% Off Today + Cash on Delivery Across India",
      primaryText: "Blend fresh smoothies, protein shakes, and baby food anywhere on-the-go. Rechargeable via USB-C with 15 blends per single charge. Tap Shop Now!",
      bulletFeatures: JSON.stringify([
        "6 Ultra-Sharp 304 Stainless Blades (22,000 RPM)",
        "Food-Grade BPA Free Non-Toxic Tritan Material",
        "USB-C Quick Recharging with 2000mAh Dual Battery",
        "Self-Cleaning Mode: Add soap, water, and double tap",
      ]),
      compliancePassed: true,
      complianceNotes: "Full compliance with Meta Commerce standards. No unverified medical health claims.",
    },
  });

  await prisma.supplierProduct.create({
    data: {
      supplierId: supplier1.id,
      productId: productBlender.id,
      supplierSku: "SHIV-BLND-01",
      title: "6-Blade Portable Smoothie Maker",
      unitCost: 320,
      moq: 1,
      shippingCost: 70,
      packagingCost: 20,
      leadTimeDays: 1,
      inStock: true,
      stockCount: 850,
      productUrl: "https://www.indiamart.com/proddetail/portable-blender-120491.html",
    },
  });

  // Product B: Wireless Car Washer Gun (AD_TESTING)
  const productWasher = await prisma.product.create({
    data: {
      title: "High-Pressure Wireless Cordless Car Washer Gun",
      slug: "high-pressure-wireless-car-washer-gun",
      description: "Portable 48V battery-powered jet spray pressure washer for cars, bikes, and patio cleaning.",
      category: "Automotive & Home",
      tags: "car accessories, pressure washer, gadgets",
      status: "AD_TESTING",
      sellingPrice: 1999,
      trueCost: 1320,
      estimatedProfit: 679,
      targetMargin: 34.0,
      minPrice: 1499,
      maxPrice: 2499,
      shopifyProductId: "gid://shopify/Product/8492019482",
      shopifyHandle: "high-pressure-wireless-car-washer-gun",
      shopifyStatus: "active",
      images: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&auto=format&fit=crop&q=80",
    },
  });

  await prisma.productScore.create({
    data: {
      productId: productWasher.id,
      demandScore: 21,
      competitionScore: 14,
      supplierScore: 18,
      marginScore: 17,
      shippingScore: 7,
      creativeScore: 5,
      totalScore: 82,
      ratingCategory: "Promising",
      reasoning: "Exceptional visual demonstration potential. Average order value ₹1999 gives healthy rupee profit margin of ₹679.",
    },
  });

  await prisma.supplierProduct.create({
    data: {
      supplierId: supplier2.id,
      productId: productWasher.id,
      supplierSku: "ZEN-WASH-48V",
      title: "Cordless High Pressure Jet Washer 48VF",
      unitCost: 780,
      moq: 1,
      shippingCost: 110,
      packagingCost: 40,
      leadTimeDays: 2,
      inStock: true,
      stockCount: 220,
      productUrl: "https://www.indiamart.com/proddetail/cordless-car-washer-9912.html",
    },
  });

  // Product C: Desk Light (READY_TO_TEST)
  const productLight = await prisma.product.create({
    data: {
      title: "Smart Magnetic Balance LED Desk Lamp",
      slug: "smart-magnetic-balance-led-lamp",
      description: "Modern minimalist magnetic sphere balance switch LED lamp for bedrooms and work desks.",
      category: "Home Decor & Lighting",
      tags: "decor, lamp, minimalist",
      status: "READY_TO_TEST",
      sellingPrice: 1299,
      trueCost: 890,
      estimatedProfit: 409,
      targetMargin: 31.5,
      minPrice: 999,
      maxPrice: 1699,
      shopifyProductId: "gid://shopify/Product/8492019483",
      shopifyHandle: "smart-magnetic-balance-led-lamp",
      shopifyStatus: "draft",
      images: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    },
  });

  await prisma.productScore.create({
    data: {
      productId: productLight.id,
      demandScore: 17,
      competitionScore: 15,
      supplierScore: 13,
      marginScore: 14,
      shippingScore: 8,
      creativeScore: 4,
      totalScore: 71,
      ratingCategory: "Testing",
      reasoning: "Good aesthetic appeal. Supplier currently under sample testing to confirm LED durability.",
    },
  });

  await prisma.supplierProduct.create({
    data: {
      supplierId: supplier3.id,
      productId: productLight.id,
      supplierSku: "AURA-LAMP-MAG",
      title: "Heng Balance Style Magnetic Desk Lamp",
      unitCost: 440,
      moq: 2,
      shippingCost: 80,
      packagingCost: 35,
      leadTimeDays: 3,
      inStock: true,
      stockCount: 150,
    },
  });

  // 4. Sample Shopify Orders & Supplier Order Queue
  const order1 = await prisma.order.create({
    data: {
      shopifyOrderId: "gid://shopify/Order/58192019401",
      orderNumber: "#AV-1024",
      customerName: "Aarav Mehta",
      customerEmail: "aarav.mehta@gmail.com",
      customerPhone: "+91 98201 99182",
      shippingAddress: JSON.stringify({
        address1: "Flat 402, Sea Green Apts, Worli",
        city: "Mumbai",
        province: "Maharashtra",
        zip: "400018",
        country: "India",
      }),
      totalPrice: 999,
      subtotalPrice: 999,
      taxPrice: 0,
      shippingFee: 0,
      currency: "INR",
      financialStatus: "paid",
      fulfillmentStatus: "fulfilled",
      paymentMethod: "Prepaid UPI",
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: productBlender.id,
      title: "Portable Electric USB-C Mini Blender",
      sku: "BLND-MINT-400",
      quantity: 1,
      unitPrice: 999,
      totalPrice: 999,
    },
  });

  await prisma.supplierOrder.create({
    data: {
      orderId: order1.id,
      supplierId: supplier1.id,
      supplierOrderRef: "SHIV-PO-8812",
      status: "SHIPPED",
      purchaseCost: 320,
      trackingNumber: "DELHIVERY981240182",
      courierName: "Delhivery Surface",
      trackingUrl: "https://www.delhivery.com/track/package/DELHIVERY981240182",
      dispatchedAt: new Date(Date.now() - 86400000),
      notes: "Auto-routed to Shivani Mfg. Dispatched within 12h.",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      shopifyOrderId: "gid://shopify/Order/58192019402",
      orderNumber: "#AV-1025",
      customerName: "Pooja Reddy",
      customerEmail: "pooja.reddy@yahoo.com",
      customerPhone: "+91 94401 22910",
      shippingAddress: JSON.stringify({
        address1: "House 12, Road 4, Jubilee Hills",
        city: "Hyderabad",
        province: "Telangana",
        zip: "500033",
        country: "India",
      }),
      totalPrice: 1999,
      subtotalPrice: 1999,
      taxPrice: 0,
      shippingFee: 0,
      currency: "INR",
      financialStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      paymentMethod: "COD",
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: productWasher.id,
      title: "High-Pressure Wireless Cordless Car Washer Gun",
      sku: "ZEN-WASH-48V",
      quantity: 1,
      unitPrice: 1999,
      totalPrice: 1999,
    },
  });

  await prisma.supplierOrder.create({
    data: {
      orderId: order2.id,
      supplierId: supplier2.id,
      supplierOrderRef: "ZEN-ORD-4491",
      status: "CONFIRMED",
      purchaseCost: 780,
      notes: "Customer confirmed COD via IVR/WhatsApp. Supplier packing item for pickup.",
    },
  });

  const order3 = await prisma.order.create({
    data: {
      shopifyOrderId: "gid://shopify/Order/58192019403",
      orderNumber: "#AV-1026",
      customerName: "Rohan Verma",
      customerEmail: "rohan.v@outlook.com",
      customerPhone: "+91 98101 44109",
      shippingAddress: JSON.stringify({
        address1: "B-204, Indiranagar 100ft Road",
        city: "Bengaluru",
        province: "Karnataka",
        zip: "560038",
        country: "India",
      }),
      totalPrice: 999,
      subtotalPrice: 999,
      taxPrice: 0,
      shippingFee: 0,
      currency: "INR",
      financialStatus: "paid",
      fulfillmentStatus: "unfulfilled",
      paymentMethod: "Prepaid Card",
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order3.id,
      productId: productBlender.id,
      title: "Portable Electric USB-C Mini Blender",
      sku: "BLND-MINT-400",
      quantity: 1,
      unitPrice: 999,
      totalPrice: 999,
    },
  });

  await prisma.supplierOrder.create({
    data: {
      orderId: order3.id,
      supplierId: supplier1.id,
      status: "AWAITING_SUPPLIER",
      purchaseCost: 320,
      notes: "Awaiting supplier acknowledgement in morning batch dispatch.",
    },
  });

  // 5. 14 Days Daily Metrics (Executive KPIs)
  const baseRevenue = 60000;
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayOrders = 7 + Math.floor(Math.random() * 8);
    const dayRevenue = dayOrders * (800 + Math.floor(Math.random() * 400));
    const dayAdSpend = Math.round(dayRevenue * 0.28);
    const dayCost = Math.round(dayRevenue * 0.42);
    const dayProfit = dayRevenue - dayCost - dayAdSpend;
    const dayRoas = Number((dayRevenue / (dayAdSpend || 1)).toFixed(2));

    await prisma.dailyMetric.create({
      data: {
        date: dateStr,
        revenue: dayRevenue,
        ordersCount: dayOrders,
        adSpend: dayAdSpend,
        trueCost: dayCost,
        contributionProfit: dayProfit,
        roas: dayRoas,
        aov: Math.round(dayRevenue / dayOrders),
        refundCount: i % 4 === 0 ? 1 : 0,
        refundAmount: i % 4 === 0 ? 999 : 0,
      },
    });
  }

  // 6. Audit Log
  await prisma.auditLog.create({
    data: {
      entityType: "SYSTEM",
      entityId: "SYSTEM_INIT",
      action: "PLATFORM_INITIALIZATION",
      performedBy: "ADMIN",
      detailsJson: JSON.stringify({
        version: "1.0.0",
        message: "Avidnt Shopify Dropshipping Platform initialized with IndiaMART suppliers and Shopify catalog.",
      }),
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
