import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { getAllFoodForUser } from "../../features/user/foodSlice";
import { getRestaurantByIdPublic } from "../../features/user/restaurantSlice";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital,wght@0,400;1,400&display=swap');

.rmp-root {
  min-height: 100vh;
  background: linear-gradient(to bottom, #fffdfb, #faf5ef, #f5ebe0);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #2d1f16;
}

/* ── TOP BAR ── */
.rmp-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid #eadccf;
  padding: 18px 24px;
}

.rmp-topbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
}

.rmp-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #eadccf;
  border-radius: 100px;
  color: #6f5a4b;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.rmp-back:hover { background: #fafafa; border-color: #c67c4e; color: #2d1f16; transform: translateX(-4px); }

.rmp-topbar-info { flex: 1; min-width: 0; }

.rmp-topbar-name {
  font-family: 'Instrument Serif', serif;
  font-size: 28px;
  font-style: italic;
  font-weight: 400;
  color: #2d1f16;
  text-transform: capitalize;
  line-height: 1;
}

.rmp-topbar-sub {
  font-size: 11px;
  color: #a07d63;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 6px;
}

/* ── FILTER BAR ── */
.rmp-filter-bar {
  position: sticky;
  top: 85px;
  z-index: 99;
  background: rgba(255, 253, 251, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #f5ebe0;
  padding: 16px 24px;
}

.rmp-filter-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.rmp-search-wrap {
  position: relative;
  flex: 1;
  min-width: 280px;
}

.rmp-search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #a07d63;
  pointer-events: none;
}

.rmp-search-input {
  width: 100%;
  padding: 14px 20px 14px 50px;
  background: white;
  border: 1px solid #eadccf;
  border-radius: 20px;
  color: #2d1f16;
  font-size: 14px;
  font-weight: 600;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0,0,0,0.02);
}
.rmp-search-input::placeholder { color: #a07d63; }
.rmp-search-input:focus { border-color: #c67c4e; box-shadow: 0 0 0 4px rgba(198,124,78,0.1); }

.rmp-filter-pills {
  display: flex;
  gap: 10px;
}

.rmp-pill {
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid #eadccf;
  background: white;
  color: #6f5a4b;
  transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
}

.rmp-pill.active {
  background: #2d1f16;
  border-color: #2d1f16;
  color: #fff;
  box-shadow: 0 10px 25px rgba(45, 31, 22, 0.2);
}

.rmp-pill.veg.active {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
}

.rmp-pill.nonveg.active {
  background: #ef4444;
  border-color: #ef4444;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.25);
}

/* ── GRID ── */
.rmp-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 100px;
}

.rmp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* ── FOOD CARD ── */
.rmp-food-card {
  background: white;
  border: 1px solid #eadccf;
  border-radius: 28px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  text-decoration: none;
  display: block;
  box-shadow: 0 12px 35px rgba(186,140,102,0.06);
  position: relative;
}

.rmp-food-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #c67c4e, #d8b79d, transparent);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10;
}

.rmp-food-card:hover {
  transform: translateY(-8px);
  border-color: rgba(198, 124, 78, 0.4);
  box-shadow: 0 25px 60px rgba(186,140,102,0.15);
}
.rmp-food-card:hover::before { opacity: 1; }

.rmp-food-img-wrap {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: #f5ebe0;
}

.rmp-food-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.rmp-food-card:hover .rmp-food-img { transform: scale(1.1); }

.rmp-food-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid #eadccf;
  color: #2d1f16;
  z-index: 5;
}

.rmp-food-body { padding: 24px; }

.rmp-food-name {
  font-size: 18px;
  font-weight: 800;
  color: #2d1f16;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.rmp-food-desc {
  font-size: 13px;
  color: #6f5a4b;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 42px;
}

.rmp-food-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rmp-food-price {
  font-size: 22px;
  font-weight: 800;
  color: #c67c4e;
}

.rmp-food-cat {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a07d63;
  background: #faf5ef;
  border: 1px solid #eadccf;
  padding: 6px 14px;
  border-radius: 100px;
}

@media (max-width: 768px) {
  .rmp-filter-bar { top: 75px; }
  .rmp-grid { grid-template-columns: 1fr; }
}

/* ── EMPTY ── */
.rmp-empty {
  text-align: center;
  padding: 80px 24px;
  color: #a07d63;
}
.rmp-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.6; }

/* ── LOADING ── */
.rmp-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
}

.rmp-spin {
  width: 36px; height: 36px;
  border: 3px solid #f5ebe0;
  border-top-color: #c67c4e;
  border-radius: 50%;
  animation: rmp-spin 0.7s linear infinite;
}
@keyframes rmp-spin { to { transform: rotate(360deg); } }

/* ── ERROR ── */
.rmp-error {
  padding: 16px 20px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 20px;
  color: #dc2626;
  font-size: 13px;
  margin-bottom: 24px;
  font-weight: 700;
}
`;

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};
const gridVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

function RestaurantMenuPage() {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { foods, loading, error } = useSelector((s) => s.food);
  const { restaurant, restaurantDetailLoading } = useSelector(
    (s) => s.restaurant,
  );

  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState(null); // null=all, true=veg, false=nonveg

  useEffect(() => {
    if (document.getElementById("rmp-style")) return;
    const el = document.createElement("style");
    el.id = "rmp-style";
    el.textContent = STYLE;
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getRestaurantByIdPublic(restaurantId));
      dispatch(
        getAllFoodForUser({
          page: 1,
          limit: 100,
          restaurantId,
          category: "",
          isVeg: "",
        }),
      );
    }
  }, [dispatch, restaurantId]);

  const filtered = (foods ?? []).filter((f) => {
    const matchSearch = f?.name?.toLowerCase().includes(search.toLowerCase());
    const matchVeg = vegFilter === null || f?.isVeg === vegFilter;
    return matchSearch && matchVeg;
  });

  const name =
    restaurant?.name ?? (restaurantDetailLoading ? "…" : "Restaurant");

  return (
    <div className="rmp-root">
      {/* ── TOP BAR ── */}
      <div className="rmp-topbar">
        <div className="rmp-topbar-inner">
          <button
            className="rmp-back"
            onClick={() => navigate(`/restaurant/${restaurantId}`)}
          >
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
            Back
          </button>
          <div className="rmp-topbar-info">
            <p className="rmp-topbar-name">{name}</p>
            <p className="rmp-topbar-sub">
              Menu · {filtered.length} culinary creation
              {filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="rmp-filter-bar">
        <div className="rmp-filter-inner">
          <div className="rmp-search-wrap">
            <MagnifyingGlassIcon className="rmp-search-icon" />
            <input
              type="search"
              className="rmp-search-input"
              placeholder="Discover your next favorite dish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="rmp-filter-pills">
            <button
              className={`rmp-pill ${vegFilter === null ? "active" : ""}`}
              onClick={() => setVegFilter(null)}
            >
              All Items
            </button>
            <button
              className={`rmp-pill veg ${vegFilter === true ? "active" : ""}`}
              onClick={() => setVegFilter(true)}
            >
              🥦 Pure Veg
            </button>
            <button
              className={`rmp-pill nonveg ${vegFilter === false ? "active" : ""}`}
              onClick={() => setVegFilter(false)}
            >
              🍖 Non-Veg
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="rmp-main ">
        {error && <div className="rmp-error">⚠️ {String(error)}</div>}

        {loading && !foods?.length ? (
          <div className="rmp-loading">
            <div className="rmp-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rmp-empty">
            <div className="rmp-empty-icon">🍽️</div>
            <p style={{ fontSize: 20, fontWeight: 800 }}>No matches found</p>
          </div>
        ) : (
          <motion.div
            className="rmp-grid"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {filtered.map((item) => (
              <motion.div key={item._id} variants={cardVariants}>
                <Link
                  to={`/food/${item._id}`}
                  state={{ restaurantId }}
                  className="rmp-food-card"
                >
                  <div className="rmp-card-container ">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://placehold.co/400x250/f5ebe0/c67c4e?text=Gourmet+Dish"
                      }
                      alt={item.name}
                      className="rmp-card-image"
                    />

                    <div className="rmp-card-overlay border " />

                    <div className="rmp-card-badge">
                      {item.isVeg ? "🥦 Veg" : "🍖 Non-Veg"}
                    </div>

                    <div className="rmp-card-content">
                      <div className="rmp-card-header">
                        <p className="rmp-card-title">{item.name}</p>
                        <span className="rmp-card-price">₹{item.price}</span>
                      </div>

                      <p className="rmp-card-desc">
                        {item.description ||
                          "A masterfully crafted dish using only the finest seasonal ingredients."}
                      </p>

                      <div className="rmp-card-tags">
                        {item.category && (
                          <span className="rmp-card-tag">{item.category}</span>
                        )}
                      </div>

                      <button className="rmp-card-btn">Reserve</button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default RestaurantMenuPage;
