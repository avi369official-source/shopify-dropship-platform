export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-800 rounded-lg" />
          <div className="h-3 w-96 bg-slate-800/60 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-36 bg-slate-800 rounded-lg" />
          <div className="h-8 w-28 bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-800 rounded" />
              <div className="h-4 w-4 bg-slate-800 rounded" />
            </div>
            <div className="h-7 w-24 bg-slate-800 rounded-lg" />
            <div className="h-2.5 w-28 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="h-5 w-44 bg-slate-800 rounded-lg" />
        <div className="h-48 w-full bg-slate-800/40 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 w-16 bg-slate-800 rounded" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-slate-800/50 flex gap-6 items-center">
            <div className="h-4 w-28 bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-800/70 rounded" />
            <div className="h-4 w-16 bg-slate-800/70 rounded" />
            <div className="h-4 w-20 bg-slate-800/70 rounded" />
            <div className="h-4 w-16 bg-slate-800/70 rounded" />
            <div className="h-5 w-24 bg-slate-800/50 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
