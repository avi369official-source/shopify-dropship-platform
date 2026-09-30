export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-800 rounded-lg" />
          <div className="h-3 w-72 bg-slate-800/60 rounded" />
        </div>
        <div className="h-8 w-40 bg-slate-800 rounded-lg" />
      </div>
      {/* Tab strip */}
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 w-28 bg-slate-800 rounded-lg" />
        ))}
      </div>
      {/* Product card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
            <div className="h-44 bg-slate-800/40" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-20 bg-slate-800/60 rounded" />
              <div className="h-5 w-48 bg-slate-800 rounded-lg" />
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-950/60">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-1.5 text-center">
                    <div className="h-2.5 w-10 mx-auto bg-slate-800 rounded" />
                    <div className="h-4 w-14 mx-auto bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-800/80 flex justify-between">
              <div className="h-4 w-20 bg-slate-800 rounded" />
              <div className="h-7 w-20 bg-slate-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
