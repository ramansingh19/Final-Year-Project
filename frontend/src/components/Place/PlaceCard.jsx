import { useState } from "react";
import { motion } from "framer-motion";

const CATEGORY_STYLE = {
  Hotel:         { bg: "bg-indigo-500",  icon: "🏨" },
  Restaurant:    { bg: "bg-orange-500",  icon: "🍽️" },
  Cafe:          { bg: "bg-amber-500",   icon: "☕" },
  Museum:        { bg: "bg-blue-500",    icon: "🏛️" },
  Park:          { bg: "bg-emerald-500", icon: "🌿" },
  Shopping:      { bg: "bg-pink-500",    icon: "🛍️" },
  Adventure:     { bg: "bg-cyan-500",    icon: "🧗" },
  Beach:         { bg: "bg-sky-500",     icon: "🏖️" },
  Historical:    { bg: "bg-amber-600",   icon: "🏯" },
  Entertainment: { bg: "bg-purple-500",  icon: "🎭" },
  Temple:        { bg: "bg-orange-600",  icon: "🛕" },
};

const PRICE_MAP = {
  1: "₹",
  2: "₹₹",
  3: "₹₹₹",
  4: "₹₹₹₹",
};

export default function PlaceCard({ place, distanceInKm, onClick }) {
  const [imgErr, setImgErr] = useState(false);

  const cat = CATEGORY_STYLE[place.category] || {
    bg: "bg-slate-500",
    icon: "📍",
  };

  const imageSrc = !imgErr && place.images?.[0] ? place.images[0] : null;

  const distLabel =
    distanceInKm != null
      ? distanceInKm < 1
        ? `${Math.round(distanceInKm * 1000)} m`
        : `${distanceInKm.toFixed(1)} km`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => onClick?.(place)}
      className="group relative w-full h-85 rounded-[20px] overflow-hidden cursor-pointer
                 shadow-[0_4px_20px_rgba(0,0,0,0.10)]
                 hover:shadow-[0_16px_48px_rgba(0,0,0,0.22)]
                 transition-shadow duration-300"
    >
      {/* ── Background Image ── */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={place.name}
          loading="lazy"
          onError={() => setImgErr(true)}
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-500 ease-in-out
                     group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <span className="text-6xl opacity-20">🗺️</span>
        </div>
      )}

      {/* ── Gradient Overlay ── */}
      <div className="absolute inset-0 bg-linear-to-t
                      from-black/85 via-black/30 to-transparent" />

      {/* ── Top-left: Category Badge ── */}
      <div className="absolute top-4 left-4">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black
                          uppercase tracking-widest text-white
                          px-3 py-1.5 rounded-full shadow-md
                          backdrop-blur-sm bg-white/20 border border-white/25`}>
          {cat.icon} {place.category}
        </span>
      </div>

      {/* ── Top-right: Entry Fee or Price Level ── */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        {place.entryfees != null && (
          <span className="text-[10px] font-black uppercase tracking-widest
                           bg-white/20 backdrop-blur-sm border border-white/25
                           text-white px-3 py-1.5 rounded-full shadow-md">
            {place.entryfees === 0 ? "🎟 Free Entry" : `₹${place.entryfees} Entry`}
          </span>
        )}
        {place.priceLevel && (
          <span className="text-[10px] font-black tracking-widest
                           bg-white/20 backdrop-blur-sm border border-white/25
                           text-white px-3 py-1.5 rounded-full shadow-md">
            {PRICE_MAP[place.priceLevel]}
          </span>
        )}
      </div>

      {/* ── Bottom Content ── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2">
          {/* Distance tag */}
          {distLabel && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold
                             uppercase tracking-wide text-white/90
                             bg-white/15 backdrop-blur-sm border border-white/20
                             px-2.5 py-1 rounded-full">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor"
                   strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {distLabel}
            </span>
          )}

          {/* Time required tag */}
          {place.timeRequired && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold
                             uppercase tracking-wide text-white/90
                             bg-white/15 backdrop-blur-sm border border-white/20
                             px-2.5 py-1 rounded-full">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor"
                   strokeWidth={2.5} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {place.timeRequired}
            </span>
          )}

          {/* Trending tag */}
          {place.isPopular && (
            <span className="text-[10px] font-black uppercase tracking-wide
                             bg-amber-400/90 text-amber-950 border border-amber-300/30
                             px-2.5 py-1 rounded-full shadow-sm">
              ⭐ Trending
            </span>
          )}
        </div>

        {/* Title + Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white text-xl font-extrabold leading-tight
                         tracking-tight drop-shadow-md line-clamp-1 flex-1">
            {place.name}
          </h3>
          {/* Star rating */}
          {place.rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-sm leading-none ${
                    i < Math.round(place.rating || 0)
                      ? "text-amber-400"
                      : "text-white/20"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-[10px] font-bold text-white/60 ml-1">
                ({place.rating})
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-white/70 text-xs font-medium leading-relaxed
                        line-clamp-2 drop-shadow-sm">
            {place.description}
          </p>
        )}

        {/* CTA Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClick?.(place); }}
          className="mt-1 w-full py-2.5 rounded-xl
                     bg-white text-slate-900
                     text-sm font-extrabold tracking-wide
                     shadow-[0_4px_14px_rgba(0,0,0,0.3)]
                     hover:bg-slate-50 active:scale-95
                     transition-all duration-200 ease-in-out"
        >
          Explore Now →
        </button>
      </div>
    </motion.div>
  );
}