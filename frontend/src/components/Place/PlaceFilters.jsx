import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setActiveCategory,
  setSearchQuery,
  setSortBy,
  setDistanceRadius,
  setUserLocation,
  setUsingNearby,
  clearNearby,
  fetchNearbyPlaces,
  fetchPlacesByCity,
  selectActiveCategory,
  selectSearchQuery,
  selectSortBy,
  selectUserLocation,
  selectUsingNearby,
  selectDistanceRadius,
  selectSelectedCity,
} from "../../features/user/placeSlice";

const CATEGORIES = [
  { label: "All", value: "", icon: "🗺️" },
  { label: "Hotel", value: "hotel", route: "hotels", icon: "🏨" },
  { label: "Restaurant", value: "restaurant", icon: "🍽️" },
  { label: "Cafe", value: "cafe", icon: "☕" },
  { label: "Museum", value: "museum", icon: "🏛️" },
  { label: "Park", value: "park", icon: "🌿" },
  { label: "Shopping", value: "shopping", icon: "🛍️" },
  { label: "Adventure", value: "adventure", icon: "🧗" },
  { label: "Beach", value: "beach", icon: "🏖️" },
  { label: "Historical", value: "historical", icon: "🏯" },
  { label: "Entertainment", value: "entertainment", icon: "🎭" },
  { label: "Temple", value: "temple" , icon : "🛕"},
];

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popularity" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

const DISTANCE_OPTIONS = [
  { label: "5 km", value: 5 },
  { label: "20 km", value: 20 },
  { label: "50 km", value: 50 },
  { label: "100 km", value: 100 },
];

export default function PlaceFilters() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector(selectActiveCategory);
  const search = useSelector(selectSearchQuery);
  const sort = useSelector(selectSortBy);
  const userLoc = useSelector(selectUserLocation);
  const usingNearby = useSelector(selectUsingNearby);
  const radius = useSelector(selectDistanceRadius);
  const selectedCity = useSelector(selectSelectedCity);

  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const triggerFetch = (overrides = {}) => {
    if (usingNearby && userLoc) {
      dispatch(
        fetchNearbyPlaces({
          lat: userLoc.lat,
          lng: userLoc.lng,
          cityId: overrides.cityId ?? selectedCity?._id,
          distance: overrides.radius ?? radius,
        }),
      );
    } else {
      dispatch(
        fetchPlacesByCity({
          cityId: selectedCity?._id,
        }),
      );
    }
  };

  const handleCategory = (categoryObj) => {
    dispatch(setActiveCategory(categoryObj.value));
    if (!selectedCity?._id) return;
    if (categoryObj.route) {
      navigate(`/city/${selectedCity._id}/${categoryObj.route}`);
    } else {
      navigate(`/city/${selectedCity._id}/places`);
    }
  };

  const handleSearch = (val) => {
    dispatch(setSearchQuery(val));
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      triggerFetch({ search: val });
    }, 400);
  };

  const handleSort = (val) => {
    dispatch(setSortBy(val));
    triggerFetch({ sort: val });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    setLocLoading(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        dispatch(setUserLocation(loc));
        dispatch(setUsingNearby(true));
        dispatch(
          fetchNearbyPlaces({
            ...loc,
            cityId: selectedCity?._id,
            distance: radius,
            category,
          }),
        );
        setLocLoading(false);
      },
      () => {
        setLocError("Location access denied. Please enable it.");
        setLocLoading(false);
      },
      { timeout: 10000 },
    );
  };

  const handleDistance = (val) => {
    const num = Number(val);
    dispatch(setDistanceRadius(num));
    if (userLoc) {
      dispatch(
        fetchNearbyPlaces({
          ...userLoc,
          cityId: selectedCity?._id,
          distance: num,
          category,
        }),
      );
    }
  };

  const handleClearNearby = () => {
    dispatch(clearNearby());
    if (selectedCity?._id) {
      dispatch(fetchPlacesByCity({ cityId: selectedCity._id }));
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl border-b border-white/50 sticky top-0 z-60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-wrap items-center gap-4 py-4">
          {/* Search */}
          <div className="relative flex-1 min-w-55">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Discover places..."
              className="w-full pl-11 pr-4 py-2.5 text-xs font-bold border border-slate-100/50 rounded-2xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 placeholder:text-slate-400 shadow-sm"
            />
            {search && (
              <button onClick={() => handleSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!usingNearby && (
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="text-xs font-bold border border-slate-100/50 rounded-2xl bg-white/60 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer shadow-sm text-slate-600"
              >
                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            )}

            <div className="hidden sm:block w-px h-8 bg-slate-200/50" />

            {!userLoc ? (
              <button
                onClick={handleGetLocation}
                disabled={locLoading}
                className="flex items-center gap-2 bg-linear-to-r from-[#c67c4e] to-[#b86c3d] hover:from-[#b06d42] hover:to-[#9e5b33]  disabled:opacity-60 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
              >
                {locLoading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><circle cx="12" cy="10" r="3" /><path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z" /></svg>}
                USE MY LOCATION
              </button>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
                <select
                  value={radius}
                  onChange={(e) => handleDistance(e.target.value)}
                  className="text-xs font-bold border border-emerald-100 rounded-2xl bg-emerald-50/50 px-4 py-2 text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {DISTANCE_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label} Radius</option>)}
                </select>
                <button onClick={handleClearNearby} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 border border-slate-100 rounded-full px-4 py-1.5 hover:bg-white transition-all shadow-sm">✕ Clear</button>
              </div>
            )}
          </div>
        </div>

        {locError && (
          <p className="text-[10px] font-bold text-rose-500 pb-3 flex items-center gap-1.5 px-1">
             <span className="bg-rose-100 text-rose-600 w-4 h-4 flex items-center justify-center rounded-full text-[8px]">!</span>
             {locError}
          </p>
        )}

        <div className="flex items-center gap-3 pb-4 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => handleCategory(c)}
              className={`flex items-center gap-2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-xl border transition-all duration-300 shrink-0 ${category === c.value ? "bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-300" : "bg-white/50 text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50"}`}
            >
              <span className="text-sm opacity-80">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
