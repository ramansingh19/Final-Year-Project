import {
  MagnifyingGlassIcon,
  MapPinIcon,
  SignalIcon
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getActiveCities } from "../../features/user/citySlice";
import {
  getAllRestaurantsForUser,
  getNearbyRestaurants,
} from "../../features/user/restaurantSlice";
import { updateUserLocation } from "../../features/user/userSlice";
import RestaurantCard from "./RestaurantCard";
import RestaurantGridSkeleton from "./RestaurantGridSkeleton";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function RestaurantLandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    restaurants = [],
    loading,
    error,
  } = useSelector((state) => state.restaurant);
  const { user } = useSelector((state) => state.user);
  const cityState = useSelector((state) => state.city);
  const citiesRaw = cityState?.cities;
  const cities = useMemo(
    () => (Array.isArray(citiesRaw) ? citiesRaw : citiesRaw?.data ?? []),
    [citiesRaw]
  );

  const [city, setCity] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 400);
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoDenied, setGeoDenied] = useState(false);

  // const [dark, setDark] = useState(() => {
  //   if (typeof window === "undefined") return false;
  //   return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  // });

  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", dark);
  // }, [dark]);

  useEffect(() => {
    dispatch(getActiveCities());
  }, [dispatch]);

  useEffect(() => {
    if (isNearbyMode) return;

    const params = {};
    if (city) params.city = city;
    if (debouncedSearch) params.search = debouncedSearch;

    dispatch(getAllRestaurantsForUser(params));
  }, [city, debouncedSearch, isNearbyMode, dispatch]);

  const displayRestaurants = useMemo(() => {
    const list = Array.isArray(restaurants) ? restaurants : [];
    if (!isNearbyMode || !searchInput.trim()) return list;
    const q = searchInput.trim().toLowerCase();
    return list.filter((r) => {
      const name = r?.name?.toLowerCase?.() ?? "";
      const cuisine = r?.foodType?.toLowerCase?.() ?? "";
      const cname = r?.city?.name?.toLowerCase?.() ?? "";
      return name.includes(q) || cuisine.includes(q) || cname.includes(q);
    });
  }, [restaurants, isNearbyMode, searchInput]);

  const handleCitySelect = useCallback((name) => {
    setIsNearbyMode(false);
    setGeoDenied(false);
    if (name === "") {
      setCity("");
      return;
    }
    setCity(name);
  }, []);

  const handleDetectLocation = useCallback(() => {
    // If user is not logged in
    if (!user) {
      alert("Please log in first to use your location.");
      navigate("/login"); // redirect to login page
      return;
    }
    setGeoDenied(false);
    if (!navigator.geolocation) {
      setGeoDenied(true);
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsNearbyMode(true);
        setCity("");
        setSearchInput("");
        if (user) {
          try {
            await dispatch(
              updateUserLocation({
                latitude: lat,
                longitude: lng,
              })
            ).unwrap();
          } catch {
            /* profile update optional */
          }
        }
        dispatch(getNearbyRestaurants({ lat, lng }));
        setGeoLoading(false);
      },
      () => {
        setGeoDenied(true);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [dispatch, user]);

  const handleOpenRestaurant = useCallback(
    (id) => {
      if (!id) return;
      navigate(`/restaurant/${id}`);
    },
    [navigate]
  );

  const handleViewMenu = useCallback(
    (id) => {
      if (!id) return;
      navigate(`/restaurant/${id}/menu`);
    },
    [navigate]
  );

  const showEmpty = !loading && !geoLoading && displayRestaurants.length === 0;

  return (
    <motion.div
      className="min-h-screen bg-linear-to-b from-[#fffdfb] via-[#faf5ef] to-[#f5ebe0] relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Decorative radial blur for depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] h-125 w-125 rounded-full bg-[#c67c4e]/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] h-150 w-150 rounded-full bg-[#eadccf]/10 blur-[150px]" />
      </div>

      <header className="sticky top-6 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/60 bg-white/70 shadow-[0_25px_80px_rgba(186,140,102,0.12)] backdrop-blur-2xl px-6 py-8 sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c67c4e]">
                Premium Selection
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-[#2d1f16] sm:text-5xl lg:text-4xl">
                <span className="bg-linear-to-r from-[#c67c4e] via-[#b86c3d] to-[#9f5b31] bg-clip-text text-transparent">
                  Restaurants
                </span>{" "}
                near you
              </h1>
              <p className="mt-4 max-w-lg text-base font-medium leading-relaxed text-[#6f5a4b]">
                Discover curated flavours and premium menus. Minimal, fast, and 
                designed for an elegant ordering experience.
              </p>
            </div>
            {/* <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100 dark:hover:border-orange-500/40"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <SunIcon className="h-5 w-5 text-amber-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-indigo-500" />
              )}
              {dark ? "Light" : "Dark"}
            </button> */}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 group">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a07d63] transition-colors group-focus-within:text-[#c67c4e]" />
              <input
                type="search"
                placeholder="Find your favorite cuisine..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                className="ui-input rounded-[22px]! py-5! pl-14! pr-6! text-base! shadow-sm! transition-all hover:border-[#c67c4e]/30"
                aria-label="Search restaurants"
              />
            </div>
            <motion.button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoLoading}
              className="ui-btn-primary rounded-2xl! px-6! py-4! disabled:cursor-not-allowed disabled:opacity-70 shadow-lg"
              whileHover={{ scale: geoLoading ? 1 : 1.02 }}
              whileTap={{ scale: geoLoading ? 1 : 0.98 }}
            >
              {geoLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <MapPinIcon className="h-5 w-5" />
              )}
              Use my location
            </motion.button>
          </div>

          {isNearbyMode && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-[#e6f4ea] px-4 py-2 text-xs font-semibold text-[#22c55e] border border-[#22c55e]/10 shadow-sm"
            >
              <SignalIcon className="h-4 w-4" />
              Showing restaurants within ~5 km of your location. City filters
              were cleared.
            </motion.div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-10" aria-labelledby="cities-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2
                id="cities-heading"
                className="text-xl font-black text-[#2d2d2d]"
              >
                Explore by city
              </h2>
              <p className="text-sm font-medium text-[#6b6b6b]">
                Tap a city to filter — or open all restaurants.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-[#f6f1eb]/95 to-transparent lg:w-12" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#f1ebe4]/95 to-transparent lg:w-12" />

            <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <motion.button
                type="button"
                onClick={() => handleCitySelect("")}
                className={`shrink-0 rounded-[22px] border px-7 py-5 text-left text-sm font-black transition-all ${!city && !isNearbyMode
                  ? "border-[#c67c4e] bg-linear-to-br from-[#c67c4e] to-[#b86c3d] text-white shadow-[0_12px_25px_rgba(198,124,78,0.25)]"
                  : "border-[#eadccf] bg-white/80 text-[#6f5a4b] hover:border-[#c67c4e]/40 hover:bg-white hover:text-[#2d1f16]"
                  }`}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                All Regions
              </motion.button>
              {cities.map((c) => {
                const name = c?.name ?? "";
                const active = !isNearbyMode && city === name;
                return (
                  <motion.button
                    key={c?._id ?? name}
                    type="button"
                    onClick={() => handleCitySelect(name)}
                    className={`min-w-40 shrink-0 rounded-[22px] border px-7 py-3 text-left transition-all ${active
                      ? "border-[#c67c4e] bg-linear-to-br from-[#c67c4e] to-[#b86c3d] text-white shadow-[0_12px_25px_rgba(198,124,78,0.25)]"
                      : "border-[#eadccf] bg-white/80 text-[#6f5a4b] hover:border-[#c67c4e]/40 hover:bg-white hover:text-[#2d1f16]"
                      }`}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span
                      className={`block text-[10px] font-black uppercase tracking-[0.15em] ${active
                        ? "text-white/70"
                        : "text-[#a07d63]"
                        }`}
                    >
                      {active ? "Currently" : "Location"}
                    </span>
                    <span className="mt-1 block text-base font-black">
                      {name || "—"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        <section aria-labelledby="listing-heading">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2
              id="listing-heading"
              className="text-xl font-black text-[#2d2d2d]"
            >
              Popular restaurants
            </h2>
            {(loading || geoLoading) && (
              <div className="flex items-center gap-2 text-sm font-medium text-[#c67c4e]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#c67c4e]/30 border-t-[#c67c4e]" />
                Updating…
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
              >
                {typeof error === "string" ? error : "Something went wrong."}
              </motion.p>
            )}
          </AnimatePresence>

          {geoDenied && (
            <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/35 dark:text-amber-100">
              Location permission is off. Enable it to see nearby restaurants,
              or pick a city above.
            </p>
          )}

          <div className="relative min-h-50">
            <AnimatePresence mode="wait">
              {(loading || geoLoading) && !restaurants?.length ? (
                <motion.div
                  key="sk"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <RestaurantGridSkeleton count={8} />
                </motion.div>
              ) : showEmpty ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-[#faf7f2]/40 px-6 py-20 text-center shadow-inner"
                >
                  <p className="text-xl font-black text-[#2d2d2d]">
                    No restaurants found
                  </p>
                  <p className="mt-2 max-w-md text-sm font-medium text-[#6b6b6b]">
                    Try another city, clear your search, or use your location to
                    discover spots nearby.
                  </p>
                  <motion.button
                    type="button"
                    className="ui-btn-primary mt-6 rounded-2xl! px-6! py-2.5!"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSearchInput("");
                      handleCitySelect("");
                    }}
                  >
                    Reset filters
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  variants={listContainer}
                  initial="hidden"
                  animate="show"
                  className={`grid grid-cols-1 gap-5 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? "opacity-70" : "opacity-100"
                    }`}
                >
                  {displayRestaurants.map((r, i) => (
                    <RestaurantCard
                      key={r?._id ?? i}
                      restaurant={r}
                      index={i}
                      onOpenRestaurant={handleOpenRestaurant}
                      onViewMenu={handleViewMenu}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {(loading || geoLoading) && restaurants?.length > 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-start justify-center rounded-3xl bg-[#faf7f2]/20 pt-24 backdrop-blur-[2px]">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#c67c4e]/30 border-t-[#c67c4e]" />
              </div>
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

export default RestaurantLandingPage;
