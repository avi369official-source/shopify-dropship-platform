import { db } from "@/lib/db";
import { Settings, Shield, Store, Megaphone, Sparkles, CheckCircle2, Key } from "lucide-react";

export const revalidate = 0;

export default async function SettingsPage() {
  const store = await db.store.findFirst();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          Integrations & API Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage credentials for Shopify Admin API, Meta Marketing Cloud, and AI intelligence engines.
        </p>
      </div>

      <div className="space-y-6">
        {/* Shopify Integration Card */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Shopify Admin API & Webhooks</h2>
                <p className="text-[11px] text-slate-400">
                  Connect your store for automated product publishing and real-time order sync.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Mock Active / Ready for Live Keys
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Shopify Store Myshopify Domain
              </label>
              <input
                type="text"
                readOnly
                value={store?.domain || "demo-dropship.myshopify.com"}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Admin API Access Token (shpat_...)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="shpat_••••••••••••••••••••••••••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Generated under Shopify Admin &gt; Settings &gt; Apps and sales channels &gt; Develop apps
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Webhook Ingestion Endpoint (HMAC Protected)
              </label>
              <input
                type="text"
                readOnly
                value="https://your-domain.com/api/shopify/webhooks"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Meta / Facebook Marketing Card */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Meta Business & Commerce Manager</h2>
                <p className="text-[11px] text-slate-400">
                  Sync Shopify product catalog with Meta and launch approved ad campaigns.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Meta Ad Account ID</label>
              <input
                type="text"
                placeholder="act_1234567890"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Meta Catalog ID</label>
              <input
                type="text"
                placeholder="cat_9876543210"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* AI Engine & Gemini Credentials */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">AI Engine (Gemini & LLM Models)</h2>
                <p className="text-[11px] text-slate-400">
                  Powers 6-factor candidate scoring, dynamic pricing, and Meta ad copy generation.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Gemini API Key</label>
              <input
                type="password"
                placeholder="AIzaSy••••••••••••••••••••••••••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
              />
              <span className="text-[10px] text-slate-500">
                Optional: The system includes high-accuracy algorithmic evaluation and structured copy templates by default.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
