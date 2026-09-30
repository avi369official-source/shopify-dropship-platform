export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-60 bg-slate-800 rounded-lg" />
          <div className="h-3 w-80 bg-slate-800/60 rounded" />
        </div>
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-1.5">
                <div className="h-5 w-40 bg-slate-800 rounded-lg" />
                <div className="h-3 w-24 bg-slate-800/60 rounded" />
              </div>
              <div className="h-6 w-20 bg-slate-800 rounded" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-32 bg-slate-800/60 rounded" />
                <div className="h-3 w-12 bg-slate-800/60 rounded" />
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full" />
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 space-y-1.5">
              <div className="h-3 w-36 bg-slate-800 rounded" />
              <div className="h-3 w-28 bg-slate-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
