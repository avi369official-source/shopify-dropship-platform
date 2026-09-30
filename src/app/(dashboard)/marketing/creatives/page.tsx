import Link from "next/link";
import { db } from "@/lib/db";
import { Megaphone, Sparkles, Copy, CheckCircle2, ShieldCheck, Film, Layers } from "lucide-react";

export const revalidate = 0;

export default async function CreativesPage() {
  const products = await db.product.findMany({
    where: {
      content: { isNot: null },
    },
    include: {
      content: true,
      score: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-500" />
            Meta Creative Engine & Ad Copy Suite
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and manage multi-angle video hooks, primary text, headlines, and storyboard scripts compliant with Meta Ads Standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Meta Policy Shield: Active
          </span>
        </div>
      </div>

      {/* Creatives List */}
      <div className="space-y-6">
        {products.map((product) => {
          const content = product.content;
          if (!content) return null;

          return (
            <div
              key={product.id}
              className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-5 shadow-lg shadow-black/20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">{product.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    Retail Price: ₹{product.sellingPrice}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all"
                  >
                    View Product Dossier →
                  </Link>
                </div>
              </div>

              {/* 3 Hooks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Angle 1: Problem Agitation
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{content.hook1}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    Angle 2: Aesthetic / Transformation
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{content.hook2}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Angle 3: Social Proof / UGC
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{content.hook3}"
                  </p>
                </div>
              </div>

              {/* Copy & Video Script */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Ad Headline:
                    </span>
                    <div className="text-sm font-bold text-white mt-1 p-2.5 rounded-lg bg-slate-950/50 border border-slate-850">
                      {content.headline}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Primary Ad Copy:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1 p-3 rounded-lg bg-slate-950/50 border border-slate-850">
                      {content.primaryText}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-indigo-400" />
                    Video Ad Storyboard & Hook Script:
                  </span>
                  <pre className="text-xs text-slate-300 font-mono p-3 rounded-lg bg-slate-950/80 border border-slate-850 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {content.videoScript}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
