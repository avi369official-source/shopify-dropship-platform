"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Package, Truck, DollarSign } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Gadgets & Tech",
    supplierCost: 350,
    sellingPrice: 999,
    supplierShipping: 70,
    packagingCost: 25,
    adAllocation: 180,
    rtoRate: 12,
    images: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push(`/products/${data.product.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/products"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          Import IndiaMART Candidate Product
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          The system will automatically run 6-factor algorithmic scoring, landed cost analysis, and generate compliant Shopify & Meta copy.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Title / IndiaMART Name *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Ultrasonic Portable Jewelry Cleaner Machine"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Gadgets & Tech">Gadgets & Tech</option>
                <option value="Kitchen & Home">Kitchen & Home</option>
                <option value="Automotive">Automotive</option>
                <option value="Fitness & Health">Fitness & Health</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Representative Image URL
              </label>
              <input
                type="url"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                IndiaMART Supplier Cost (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.supplierCost}
                onChange={(e) =>
                  setFormData({ ...formData, supplierCost: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500">Unit cost quoted by supplier</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Proposed Shopify Retail Price (₹)
              </label>
              <input
                type="number"
                value={formData.sellingPrice}
                onChange={(e) =>
                  setFormData({ ...formData, sellingPrice: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-semibold text-emerald-400 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500">Leave at 999 or adjust</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Shipping (₹)</label>
              <input
                type="number"
                value={formData.supplierShipping}
                onChange={(e) =>
                  setFormData({ ...formData, supplierShipping: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Target CPA (₹)</label>
              <input
                type="number"
                value={formData.adAllocation}
                onChange={(e) =>
                  setFormData({ ...formData, adAllocation: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">RTO Risk (%)</label>
              <input
                type="number"
                value={formData.rtoRate}
                onChange={(e) =>
                  setFormData({ ...formData, rtoRate: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Link
            href="/products"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {loading ? "Analyzing & Generating..." : "Evaluate & Import Product →"}
          </button>
        </div>
      </form>
    </div>
  );
}
