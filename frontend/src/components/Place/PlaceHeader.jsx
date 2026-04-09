import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  selectDistanceRadius,
  selectNearbyPlaces,
  selectPlaces,
  selectSelectedCity,
  selectUsingNearby,
} from "../../features/user/placeSlice";

const CITY_IMAGES = {
  Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
  Mumbai: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200&q=80",
  "New York": "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=1200&q=80",
  London: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  Paris: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1200&q=80",
  Tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
  Sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
  Bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
  Jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=1200&q=80",
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
};

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80";

export default function PlaceHeader({ city }) {
  const cityName = city?.name || "Discovery";
  const places = useSelector(selectPlaces);
  const nearby = useSelector(selectNearbyPlaces);
  const usingNearby = useSelector(selectUsingNearby);
  const radius = useSelector(selectDistanceRadius);
  const selectedCity = useSelector(selectSelectedCity);

  const count = usingNearby ? nearby.length : places.length;
  const heroImg = city?.images?.[0] || CITY_IMAGES[cityName] || DEFAULT_IMG;
  const state = city?.state || selectedCity?.state || "";

  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-slate-900 border-b border-white/20">
      {/* Background Hero */}
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        src={heroImg}
        alt={cityName}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-[#eef3fb]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-end pb-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Breadcrumb / Navigation Context */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Explore</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white underline underline-offset-4 decoration-blue-500/50">{cityName}</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-white text-5xl sm:text-7xl font-black tracking-tight drop-shadow-2xl">
                {cityName}
              </h1>
              {city?.isCapital && (
                <span className="mt-4 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-950/20">
                  Capital
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-white/60 text-xl font-medium tracking-tight">
                {state && `${state}, `} {city?.country || "Earth"}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-blue-300 font-bold text-sm tracking-tight">
                {count > 0 ? `${count} Curated Places` : "Selecting Places..."}
              </span>
            </div>
          </div>

          {/* Activity Badge */}
          {usingNearby && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl shadow-xl"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-white text-[11px] font-black uppercase tracking-widest">
                Proximity Mode Active — {radius} KM Radius
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}