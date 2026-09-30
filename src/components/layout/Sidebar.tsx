"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Calculator,
  Megaphone,
  Store,
  Settings,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "OPERATING SYSTEM",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Product Engine", href: "/products", icon: Package },
      { name: "IndiaMART Suppliers", href: "/suppliers", icon: Truck },
      { name: "Orders & Fulfillment", href: "/orders", icon: ShoppingCart },
      { name: "Supplier Queue", href: "/orders/queue", icon: Layers },
    ],
  },
  {
    title: "MARKETING & AI",
    items: [
      { name: "Landed Cost Calculator", href: "/calculator", icon: Calculator },
      { name: "Meta Campaigns", href: "/marketing/meta", icon: Megaphone },
      { name: "Creative Suite", href: "/marketing/creatives", icon: Sparkles },
      { name: "Marketplace Assistant", href: "/marketing/marketplace", icon: Store },
    ],
  },
  {
    title: "ANALYTICS & AUTOMATION",
    items: [
      { name: "Profitability Analytics", href: "/analytics", icon: Layers },
      { name: "Automation & Audit Log", href: "/automation", icon: Zap },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [
      { name: "Integrations & Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950/80 border-r border-slate-800/80 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-100 tracking-tight text-sm flex items-center gap-1.5">
              Avidnt OS <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">v1.0</span>
            </div>
            <div className="text-[11px] text-slate-400">Shopify Dropshipping</div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navigation.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <div className="px-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                {group.title}
              </div>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-slate-400")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Store Connection Status Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium text-[11px]">Active Store</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Connected
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-300 truncate">
          demo-dropship.myshopify.com
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
          <span>Supplier Mode: IndiaMART</span>
          <span className="text-blue-400 font-semibold">Mock Active</span>
        </div>
      </div>
    </aside>
  );
}
