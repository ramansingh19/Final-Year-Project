import { ArrowLeftIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRestaurantByIdPublic } from "../../features/user/restaurantSlice";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital,wght@0,400;1,400&display=swap');

.rdp-root {
  min-height: 100vh;
  background: linear-gradient(to bottom, #fffdfb, #faf5ef, #f5ebe0);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #2d1f16;
  overflow-x: hidden;
}

/* ── HERO ── */
.rdp-hero {
  position: relative;
  height: 60vh;
  min-height: 480px;
  overflow: hidden;
}

.rdp-hero-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 12s cubic-bezier(0.23, 1, 0.32, 1);
}

.rdp-hero:hover .rdp-hero-img { transform: scale(1.08); }

.rdp-hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(45, 31, 22, 0.8) 0%,
    rgba(45, 31, 22, 0.2) 50%,
    transparent 100%
  );
}

.rdp-back-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid white;
  border-radius: 100px;
  color: #2d1f16;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
.rdp-back-btn:hover { background: #fff; transform: translateX(-4px); box-shadow: 0 15px 40px rgba(186,140,102,0.15); }

/* Status dot top-right */
.rdp-status-badge {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid #eadccf;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
.rdp-status-badge.open { color: #10b981; }
.rdp-status-badge.closed { color: #ef4444; }
.rdp-status-live { width: 8px; height: 8px; border-radius: 50%; background: currentColor; animation: rdp-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes rdp-pulse { 0%,100%{opacity:1; transform: scale(1);} 50%{opacity:0.4; transform: scale(0.85);} }

/* Hero content */
.rdp-hero-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 0 40px 60px;
  z-index: 10;
}

.rdp-hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.rdp-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.rdp-hero-name {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(40px, 8vw, 84px);
  font-weight: 400;
  font-style: italic;
  color: #fff;
  text-shadow: 0 10px 40px rgba(0,0,0,0.2);
  letter-spacing: -0.02em;
  line-height: 0.95;
  margin: 0;
}

.rdp-rating-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.rdp-rating-val {
  font-size: 28px;
  font-weight: 800;
  color: #fbbf24;
}

.rdp-reviews {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

/* ── BODY ── */
.rdp-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px 100px;
}

/* ── STAT STRIP ── */
.rdp-stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: -50px 0 40px;
  position: relative;
  z-index: 30;
}

@media (max-width: 768px) {
  .rdp-stats-strip { grid-template-columns: repeat(2, 1fr); }
}

.rdp-stat-card {
  background: white;
  border: 1px solid #eadccf;
  border-radius: 24px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(186,140,102,0.08);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.rdp-stat-card:hover { transform: translateY(-8px); border-color: #c67c4e; box-shadow: 0 25px 50px rgba(186,140,102,0.15); }

.rdp-stat-icon { font-size: 26px; display: block; margin-bottom: 8px; }
.rdp-stat-val {
  font-size: 22px;
  font-weight: 800;
  color: #2d1f16;
  display: block;
}
.rdp-stat-lbl {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a07d63;
  margin-top: 6px;
}

/* ── INFO CARD ── */
.rdp-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid #eadccf;
  border-radius: 32px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.03);
}

.rdp-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #c67c4e, #d8b79d, transparent);
}

.rdp-card-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #c67c4e;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.rdp-card-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eadccf;
}

.rdp-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.rdp-info-item {
  background: #fff;
  border: 1px solid #f5ebe0;
  border-radius: 20px;
  padding: 20px;
  transition: all 0.3s ease;
}
.rdp-info-item:hover { border-color: #eadccf; box-shadow: 0 8px 20px rgba(186,140,102,0.05); }

.rdp-info-lbl {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #a07d63;
  margin-bottom: 8px;
}

.rdp-info-val {
  font-size: 16px;
  font-weight: 700;
  color: #2d1f16;
  line-height: 1.5;
}

/* ── CTA BUTTONS ── */
.rdp-cta-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 500px) { .rdp-cta-row { grid-template-columns: 1fr; } }

.rdp-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, #c67c4e, #9f5b31);
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 15px 40px rgba(198,124,78,0.3);
}
.rdp-btn-primary:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 50px rgba(198,124,78,0.45); }

.rdp-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: #fff;
  border: 1px solid #eadccf;
  border-radius: 24px;
  color: #6f5a4b;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.rdp-btn-secondary:hover { background: #fafafa; border-color: #c67c4e; color: #2d1f16; transform: translateY(-2px); }

.rdp-center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fffdfb;
  color: #2d1f16;
}

.rdp-spin {
  width: 40px; height: 40px;
  border: 2px solid rgba(61,110,245,0.15);
  border-top-color: #ff4d00;
  border-radius: 50%;
  animation: rdp-spin 0.7s linear infinite;
}

@keyframes rdp-spin { to { transform: rotate(360deg); } }

/* ── RESPONSIVE ── */
@media (max-width: 640px) {
  .rdp-hero { height: 55vh; min-height: 360px; }
  .rdp-hero-content { padding: 0 16px 24px; }
  .rdp-body { padding: 0 16px 80px; }
}
`;

function formatTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function isOpen(open, close) {
  if (!open || !close) return null;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  return cur >= oh * 60 + om && cur <= ch * 60 + cm;
}

function Stars({ rating }) {
  return (
    <div className="rdp-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: rating >= s ? "#fbbf24" : rating >= s - 0.5 ? "#fbbf24" : "#2e2e3d", opacity: rating >= s - 0.5 ? 1 : 0.5 }}>★</span>
      ))}
    </div>
  );
}

function RestaurantDetailPage() {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurant: r, restaurantDetailLoading, error } = useSelector((s) => s.restaurant);

  useEffect(() => {
    if (restaurantId) dispatch(getRestaurantByIdPublic(restaurantId));
  }, [dispatch, restaurantId]);

  // Inject style once
  useEffect(() => {
    if (document.getElementById("rdp-style")) return;
    const el = document.createElement("style");
    el.id = "rdp-style";
    el.textContent = STYLE;
    document.head.appendChild(el);
  }, []);

  if (restaurantDetailLoading && !r) {
    return <div className="rdp-center"><div className="rdp-spin" /></div>;
  }

  if (error && !r) {
    return (
      <div className="rdp-center" style={{ flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 16 }}>{String(error)}</p>
        <button onClick={() => navigate(-1)} style={{ color: "#ff7340", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>← Go back</button>
      </div>
    );
  }

  const foodTypeChip = {
    veg: { cls: "veg", label: "🥦 Pure Veg" },
    "non-veg": { cls: "nonveg", label: "🍖 Non-Veg" },
    both: { cls: "both", label: "🍽️ Veg & Non-Veg" },
  };
  const ftc = foodTypeChip[r?.foodType] ?? foodTypeChip.both;
  const openStatus = isOpen(r?.openingHours?.open, r?.openingHours?.close);
  const cityName = r?.city?.name ?? "—";
  const stateName = r?.state?.name ?? "";

  return (
    <div className="rdp-root">

      {/* ── HERO ── */}
      <div className="rdp-hero">
        <img
          src={r?.images?.[0] || "https://placehold.co/1400x700/131318/ff4d00?text=Restaurant"}
          alt={r?.name}
          className="rdp-hero-img"
        />
        <div className="rdp-hero-gradient" />

        <button className="rdp-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Back
        </button>

        {openStatus !== null && (
          <div className={`rdp-status-badge ${openStatus ? "open" : "closed"}`}>
            <span className="rdp-status-live" />
            {openStatus ? "Open Now" : "Closed"}
          </div>
        )}

        <div className="rdp-hero-content">
          <div className="rdp-hero-chips">
            <span className={`rdp-chip ${ftc.cls}`}>{ftc.label}</span>
            {r?.isRecommended && <span className="rdp-chip rec">⭐ Editor's Pick</span>}
            {cityName && (
              <span className="rdp-chip">
                <MapPinIcon style={{ width: 11, height: 11 }} />
                {cityName}{stateName ? `, ${stateName}` : ""}
              </span>
            )}
          </div>

          <h1 className="rdp-hero-name">{r?.name ?? "Restaurant"}</h1>

          <div className="rdp-rating-row">
            <span className="rdp-rating-val">{r?.averageRating?.toFixed(1) ?? "—"}</span>
            <Stars rating={r?.averageRating ?? 0} />
            <span className="rdp-reviews">({r?.totalReviews?.toLocaleString() ?? 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="rdp-body">

        {/* ── STAT STRIP ── */}
        <motion.div
          className="rdp-stats-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="rdp-stat-card">
            <span className="rdp-stat-icon">⭐</span>
            <span className="rdp-stat-val">{r?.averageRating?.toFixed(1) ?? "—"}</span>
            <span className="rdp-stat-lbl">{r?.totalReviews?.toLocaleString()} Reviews</span>
          </div>
          <div className="rdp-stat-card">
            <span className="rdp-stat-icon">💰</span>
            <span className="rdp-stat-val">₹{r?.avgCostForOne ?? "—"}</span>
            <span className="rdp-stat-lbl">Per Person</span>
          </div>
          <div className="rdp-stat-card">
            <span className="rdp-stat-icon">🕐</span>
            <span className="rdp-stat-val" style={{ fontSize: 13 }}>{formatTime(r?.openingHours?.open)}</span>
            <span className="rdp-stat-lbl">Opens At</span>
          </div>
          <div className="rdp-stat-card">
            <span className="rdp-stat-icon">✨</span>
            <span className="rdp-stat-val" style={{ fontSize: 13 }}>{r?.bestTime || "Anytime"}</span>
            <span className="rdp-stat-lbl">Best Time</span>
          </div>
        </motion.div>

        {/* ── CTA BUTTONS ── */}
        <motion.div
          className="rdp-cta-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <Link to={`/restaurant/${restaurantId}/menu`} className="rdp-btn-primary">
            <span>🍴</span> View Full Menu
          </Link>
          <Link to="/restaurants" className="rdp-btn-secondary">
            <span>🗺️</span> More Restaurants
          </Link>
        </motion.div>

        {/* ── ABOUT ── */}
        <motion.div
          className="rdp-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <p className="rdp-card-title">About This Restaurant</p>
          <div className="rdp-info-grid">
            {r?.famousFood && (
              <div className="rdp-info-item">
                <p className="rdp-info-lbl">Famous For</p>
                <p className="rdp-info-val">{r.famousFood}</p>
              </div>
            )}
            <div className="rdp-info-item">
              <p className="rdp-info-lbl">Cuisine</p>
              <p className="rdp-info-val">{ftc.label}</p>
            </div>
            <div className="rdp-info-item">
              <p className="rdp-info-lbl">Avg Cost</p>
              <p className="rdp-info-val accent">₹{r?.avgCostForOne ?? "—"} per person</p>
            </div>
            {r?.bestTime && (
              <div className="rdp-info-item">
                <p className="rdp-info-lbl">Best Time</p>
                <p className="rdp-info-val">{r.bestTime}</p>
              </div>
            )}
            <div className="rdp-info-item" style={{ gridColumn: "1 / -1" }}>
              <p className="rdp-info-lbl">Address</p>
              <p className="rdp-info-val">{r?.address}, {cityName}{stateName ? `, ${stateName}` : ""}</p>
            </div>
          </div>
        </motion.div>

        {/* ── HOURS ── */}
        <motion.div
          className="rdp-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
        >
          <p className="rdp-card-title">Opening Hours</p>
          <div className="rdp-hours-row">
            <div>
              <p style={{ fontSize: 12, color: "#a07d63", marginBottom: 4 }}>Today's Timings</p>
              <p style={{ fontWeight: 800, fontSize: 24, color: "#2d1f16", display: "flex", alignItems: "center", gap: 8 }}>
                <ClockIcon style={{ width: 22, height: 22, color: "#c67c4e" }} />
                {formatTime(r?.openingHours?.open)} — {formatTime(r?.openingHours?.close)}
              </p>
            </div>
            {openStatus !== null && (
              <span className={`rdp-open-chip ${openStatus ? "open" : "closed"}`} style={{ 
                background: openStatus ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                color: openStatus ? "#10b981" : "#ef4444",
                padding: "8px 20px",
                borderRadius: "100px",
                fontWeight: 800,
                fontSize: 12
              }}>
                {openStatus ? "● Open Now" : "● Closed"}
              </span>
            )}
          </div>
        </motion.div>

        {/* ── PHOTO STRIP ── */}
        {r?.images?.length > 1 && (
          <motion.div
            className="rdp-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            <p className="rdp-card-title">Photos</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
              {r.images.map((src, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
                  <img
                    src={src}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", display: "block" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default RestaurantDetailPage;
