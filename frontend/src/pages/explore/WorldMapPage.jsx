import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const COUNTRIES = [
  { name: "India", top: "55%", left: "62%" },
  { name: "United States", top: "40%", left: "22%" },
  { name: "United Kingdom", top: "32%", left: "46%" },
  { name: "France", top: "36%", left: "48%" },
  { name: "Japan", top: "45%", left: "78%" },
  { name: "Australia", top: "72%", left: "82%" },
];  

export default function WorldMapPage() {
  const navigate = useNavigate();

  const pinned = useMemo(() => COUNTRIES, []);

  // ── Styles ────────────────────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    .premium-page {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
  `;

  return (
    <div className="premium-page min-h-screen relative overflow-hidden selection:bg-blue-200/60"
      style={{
        background: "linear-gradient(145deg, #eef3fb 0%, #e8f0f9 40%, #dfe9f5 70%, #d8e4f2 100%)",
      }}
    >
      <style>{styles}</style>

      {/* Floating ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-[-8%] left-[-6%] w-[45vw] h-[45vw] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, rgba(199,228,255,0.1) 70%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-5%] right-[-4%] w-[38vw] h-[38vw] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(165,180,252,0.3) 0%, rgba(224,231,255,0.08) 70%, transparent 100%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2 mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Explore the <span className="text-blue-600">World</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl font-medium">
            Pick a country to discover cities and places. You can later switch
            to “Use My Location” and filter by distance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* “Map” panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(100,130,180,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_45%)]" />
              
              <div className="relative aspect-video">
                {/* simple grid background */}
                <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[40px_40px]" />

                {/* pins */}
                {pinned.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() =>
                      navigate(`/country/${encodeURIComponent(c.name)}`)
                    }
                    style={{ top: c.top, left: c.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 + (i * 0.05) }}
                      className="flex items-center gap-2.5 rounded-full bg-slate-900/90 text-white px-3.5 py-2 text-[11px] font-bold backdrop-blur-md shadow-xl border border-white/20 hover:scale-110 hover:bg-[#b06d42] transition-all cursor-pointer"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      {c.name}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                        →
                      </span>
                    </motion.span>
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100/50 flex items-center justify-between gap-4 flex-wrap bg-white/40">
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  <span className="text-blue-500 font-bold mr-1">Tip:</span> This is an interactive lightweight map.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/country/${encodeURIComponent("India")}`)
                  }
                  className="ui-btn-primary bg-linear-to-r from-blue-500 to-indigo-600  text-white font-bold px-6 py-2.5 rounded-2xl shadow-[0_4px_14px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.45)] transition-all active:scale-95 text-sm"
                >
                  Explore India
                </button>
              </div>
            </div>
          </motion.div>

          {/* Country list */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="rounded-[2.5rem] border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(100,130,180,0.12)] overflow-hidden h-full">
              <div className="p-6 border-b border-slate-100/50 bg-white/40">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Countries</h2>
                <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">
                  Active Destinations
                </p>
              </div>

              <div className="p-4 space-y-2.5">
                {pinned.map((c, i) => (
                  <motion.button
                    key={c.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      navigate(`/country/${encodeURIComponent(c.name)}`)
                    }
                    className="w-full flex items-center justify-between rounded-2xl px-5 py-4 border border-slate-100 bg-white/50 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                  >
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {c.name}
                    </span>
                    <span className="text-xs text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      Browse →
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
