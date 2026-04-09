import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import apiClient from "../services/apiClient";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80";

export default function CountryPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const countryName = useMemo(
    () => decodeURIComponent(name || "").trim(),
    [name],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get(
          `/api/city/activecity?country=${encodeURIComponent(countryName)}`,
        );
        const payload = res?.data ?? res;
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        if (alive) setCities(list);
      } catch (e) {
        if (alive) {
          setError(
            e.response?.data?.message || "Failed to load cities for this country",
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [countryName]);

  return (
    <div className="min-h-screen bg-[#eef3fb] font-sans">

      {/* ── Top Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500 mb-1">
            Destination Directory
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {countryName}
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/explore")}
          className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm text-slate-700 font-bold text-sm hover:shadow-md transition-all"
        >
          <span className="text-blue-500">←</span> Back to Map
        </motion.button>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">

        {/* ── Loading Skeleton ── */}
        {loading ? (
          <div className="bg-white rounded-3xl px-6 sm:px-8 py-8 shadow-sm">
            <div className="h-8 w-56 bg-slate-200 rounded-xl animate-pulse mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-100 animate-pulse overflow-hidden shadow">
                  <div className="m-2 h-44 rounded-xl bg-slate-200" />
                  <div className="py-3 px-4 flex justify-center">
                    <div className="h-4 w-24 bg-slate-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (

          /* ── Error ── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl px-8 py-6 shadow-sm flex items-center gap-3 text-rose-500 font-bold"
          >
            <span className="text-xl">⚠️</span> {error}
          </motion.div>

        ) : cities.length === 0 ? (

          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl px-10 py-24 text-center max-w-xl mx-auto mt-10 shadow-sm"
          >
            <div className="text-5xl mb-5">🏜️</div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
              No Active Cities
            </h3>
            <p className="text-slate-400 font-medium leading-relaxed text-sm">
              Our scouts are still mapping out this territory. Check back soon
              for new destinations in {countryName}.
            </p>
          </motion.div>

        ) : (

          /* ── Cities Grid ── */
          <div className="bg-white rounded-3xl px-6 sm:px-8 py-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
              Trending Cities
            </h2>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {cities.map((city) => (
                <motion.button
                  key={city._id}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                  }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.22, ease: "easeOut" } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/city/${city._id}/places`)}
                  className="group flex flex-col w-full text-left bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.13)] transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="m-2 overflow-hidden rounded-xl h-44 sm:h-48 shrink-0">
                    <img
                      src={city.images?.[0] || FALLBACK_IMG}
                      alt={city.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Name */}
                  <div className="py-3 px-2 text-center">
                    <h3 className="text-sm sm:text-[15px] font-semibold text-slate-800 capitalize tracking-wide truncate px-2">
                      {city.name}
                    </h3>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}