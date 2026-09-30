"use client";

import Link from "next/link";
import { Plus, RefreshCw, Sparkles, Search, Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products, suppliers, orders... (Ctrl + K)"
            className="w-72 pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/calculator"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 text-slate-300 text-xs font-medium hover:bg-slate-850 hover:text-white transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Margin Calculator</span>
        </Link>

        <Link
          href="/products/new"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Import Product</span>
        </Link>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        <button
          title="Notifications"
          className="w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/80 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center">
            A
          </div>
          <span className="text-xs font-medium text-slate-300">Admin</span>
        </div>
      </div>
    </header>
  );
}
