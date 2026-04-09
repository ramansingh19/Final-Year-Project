export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/60 shadow-sm"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* Image skeleton */}
          <div className="aspect-4/3 bg-linear-to-r from-white/20 via-white/50 to-white/20 animate-pulse" />

          {/* Body skeleton */}
          <div className="p-6 flex flex-col gap-4 bg-white/30">
            {/* Category badge */}
            <div className="h-4 w-28 rounded-full bg-white/60 animate-pulse" />

            {/* Title */}
            <div className="h-5 w-3/4 rounded-xl bg-white/60 animate-pulse" />

            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-3 w-3 rounded-sm bg-white/40 animate-pulse" />
              ))}
            </div>

            {/* Description lines */}
            <div className="space-y-2 mt-1">
              <div className="h-3 w-full rounded-md bg-white/40 animate-pulse" />
              <div className="h-3 w-4/5 rounded-md bg-white/40 animate-pulse" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/40 mt-2">
              <div className="h-3 w-24 rounded-md bg-white/40 animate-pulse" />
              <div className="h-3 w-10 rounded-md bg-white/40 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}