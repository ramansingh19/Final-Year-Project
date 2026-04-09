import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getPlaceById } from "../../features/user/placeSlice";

const CATEGORY_STYLE = {
  Hotel: { bg: "bg-indigo-100 text-indigo-700", icon: "🏨" },
  Restaurant: { bg: "bg-orange-100 text-orange-700", icon: "🍽️" },
  Cafe: { bg: "bg-amber-100 text-amber-700", icon: "☕" },
  Museum: { bg: "bg-blue-100 text-blue-700", icon: "🏛️" },
  Park: { bg: "bg-emerald-100 text-emerald-700", icon: "🌿" },
  Shopping: { bg: "bg-pink-100 text-pink-700", icon: "🛍️" },
  Adventure: { bg: "bg-cyan-100 text-cyan-700", icon: "🧗" },
  Beach: { bg: "bg-sky-100 text-sky-700", icon: "🏖️" },
  Historical: { bg: "bg-amber-100 text-amber-800", icon: "🏯" },
  Entertainment: { bg: "bg-purple-100 text-purple-700", icon: "🎭" },
  Temple: { bg: "bg-orange-100 text-orange-700", icon: "🛕" },
};

const PRICE_MAP = { 1: "Budget", 2: "Moderate", 3: "Expensive", 4: "Luxury" };

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80";

/* ── Info Row ── */
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-sm">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 leading-snug wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── Star Rating ── */
function Stars({ rating }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-base leading-none ${
            i < Math.round(rating) ? "text-amber-400" : "text-slate-200"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-xs font-bold text-slate-400 ml-1">{rating}/5</span>
    </div>
  );
}

/* ══════════════════════════════════════
   DRAWER
══════════════════════════════════════ */
export default function PlaceDetailDrawer({ place, onClose }) {
  const dispatch = useDispatch();
  const isOpen = Boolean(place);

  /* Fetch full details when a place is selected */
  useEffect(() => {
    if (place?._id) {
      dispatch(getPlaceById(place._id));
    }
  }, [place?._id, dispatch]);

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const cat = CATEGORY_STYLE[place?.category] || {
    bg: "bg-slate-100 text-slate-600",
    icon: "📍",
  };

  const images = place?.images?.length ? place.images : [FALLBACK_IMG];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm"
          />

          {/* ── Drawer Panel ── */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-101 h-full w-full max-w-xl
                       bg-white shadow-2xl flex flex-col overflow-hidden"
          >
            {/* ── Hero Image ── */}
            <div className="relative h-64 shrink-0 overflow-hidden">
              <img
                src={images[0]}
                alt={place?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full
                           bg-white/20 backdrop-blur-md border border-white/30
                           flex items-center justify-center text-white
                           hover:bg-white/30 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Category badge on image */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-black
                                  uppercase tracking-widest px-3 py-1.5 rounded-full
                                  shadow-md backdrop-blur-sm bg-white/20 border border-white/25 text-white`}
                >
                  {cat.icon} {place?.category || "Place"}
                </span>
              </div>

              {/* Title + rating on bottom of hero */}
              <div className="absolute bottom-5 left-5 right-14">
                <h2
                  className="text-white text-2xl font-extrabold leading-tight
                               tracking-tight drop-shadow-md"
                >
                  {place?.name}
                </h2>
                <div className="mt-1.5">
                  <Stars rating={place?.rating} />
                </div>
              </div>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Quick Stats Row ── */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                {/* Entry Fee */}
                <div className="flex flex-col items-center py-4 px-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Entry
                  </p>
                  <p className="text-base font-extrabold text-slate-800">
                    {place?.entryfees === 0
                      ? "Free"
                      : place?.entryfees
                        ? `₹${place.entryfees}`
                        : "—"}
                  </p>
                </div>

                {/* Time Required */}
                <div className="flex flex-col items-center py-4 px-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Duration
                  </p>
                  <p className="text-base font-extrabold text-slate-800">
                    {place?.timeRequired || "—"}
                  </p>
                </div>

                {/* Price Level */}
                <div className="flex flex-col items-center py-4 px-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Budget
                  </p>
                  <p className="text-base font-extrabold text-slate-800">
                    {PRICE_MAP[place?.priceLevel] || "—"}
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 space-y-6">
                {/* ── Description ── */}
                {place?.description && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      About
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {place.description}
                    </p>
                  </div>
                )}

                {/* ── Tags / Categories ── */}
                {(place?.tags?.length > 0 || place?.categories?.length > 0) && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(place?.tags || place?.categories || []).map(
                        (tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-bold uppercase tracking-wide
                                     bg-slate-100 text-slate-600
                                     px-3 py-1.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* ── Info Rows ── */}
                <div className="bg-slate-50 rounded-2xl px-4 py-1">
                  <InfoRow
                    icon="📍"
                    label="Address"
                    value={place?.address || place?.location?.address}
                  />
                  <InfoRow
                    icon="🕐"
                    label="Opening Hours"
                    value={place?.openingHours || place?.timings}
                  />
                  <InfoRow
                    icon="📞"
                    label="Contact"
                    value={place?.contact || place?.phone}
                  />
                  <InfoRow icon="🌐" label="Website" value={place?.website} />
                  <InfoRow
                    icon="🗺️"
                    label="Famous For"
                    value={place?.famousFor}
                  />
                  <InfoRow
                    icon="📅"
                    label="Best Time to Visit"
                    value={place?.bestTimeToVisit}
                  />
                </div>

                {/* ── Extra Images ── */}
                {images.length > 1 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                      Gallery
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {images.slice(1, 7).map((img, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl overflow-hidden bg-slate-100"
                        >
                          <img
                            src={img}
                            alt={`${place?.name} ${i + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Trending badge ── */}
                {place?.isPopular && (
                  <div
                    className="flex items-center gap-3 bg-amber-50 border border-amber-100
                                  rounded-2xl px-5 py-4"
                  >
                    <span className="text-xl">⭐</span>
                    <div>
                      <p className="text-xs font-black text-amber-800 uppercase tracking-wide">
                        Trending Destination
                      </p>
                      <p className="text-xs text-amber-600 font-medium mt-0.5">
                        This place is popular among travellers right now.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Sticky Footer CTA ── */}
            <div
              className="shrink-0 px-6 py-5 bg-white border-t border-slate-100
                            shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200
                             text-slate-700 text-sm font-bold
                             hover:bg-slate-50 transition-all duration-200"
                >
                  Back
                </button>
                <button className="flex-2 w-full py-3.5 px-8 rounded-2xlbg-[#c67c4e] text-white text-sm font-extrabold hover:from-[#b06d42] hover:to-[#9e5b33] active:scale-95 shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all duration-200">
                  Reserve Now →
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
