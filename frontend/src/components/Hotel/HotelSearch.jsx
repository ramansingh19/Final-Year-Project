import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaChevronDown,
  FaTimes,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import apiClient from "../../pages/services/apiClient";

const getToday = () => new Date().toISOString().split("T")[0];
const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const CounterRow = ({ label, sub, value, min = 0, max = 10, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FaMinus className="text-[10px]" />
      </button>
      <span className="w-8 text-center text-sm font-bold text-slate-700">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FaPlus className="text-[10px]" />
      </button>
    </div>
  </div>
);

const Field = ({ icon, label, error, children }) => (
  <div className="flex-1 min-w-0">
    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5 px-1">
      {label}
    </p>
    <div
      className={`relative flex items-center rounded-xl border transition-all duration-200 group
      ${error ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50/50 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_12px_rgba(59,130,246,0.1)] hover:border-slate-300"}`}
    >
      <span
        className={`absolute left-3 text-sm pointer-events-none z-10 transition-colors
        ${error ? "text-rose-500" : "text-slate-400 group-focus-within:text-blue-500"}`}
      >
        {icon}
      </span>
      {children}
    </div>
    {error && (
      <p className="mt-1 px-1 text-[11px] text-rose-500 font-medium">{error}</p>
    )}
  </div>
);

const inputCls =
  "w-full bg-transparent pl-9 pr-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none";

const HeroSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchData, setSearchData] = useState({
    city: searchParams.get("city") || "",
    checkIn: searchParams.get("checkIn") || getToday(),
    checkOut: searchParams.get("checkOut") || getTomorrow(),
  });

  const [rooms, setRooms] = useState(Number(searchParams.get("rooms")) || 1);
  const [adults, setAdults] = useState(Number(searchParams.get("adults")) || 2);
  const [children, setChildren] = useState(
    Number(searchParams.get("children")) || 0,
  );
  const [showGuests, setShowGuests] = useState(false);

  const guestLabel = [
    `${rooms} Room${rooms > 1 ? "s" : ""}`,
    `${adults} Adult${adults > 1 ? "s" : ""}`,
    children > 0 ? `${children} Child${children > 1 ? "ren" : ""}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const [cityError, setCityError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allCities, setAllCities] = useState([]);

  // Load cities once on mount
  useEffect(() => {
    // Left empty as it was in original codebase
  }, []);

  const debouncedCity = useDebounce(searchData.city, 200);

  // Filter cities locally
  useEffect(() => {
    if (debouncedCity.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = allCities.filter((c) =>
      c.toLowerCase().includes(debouncedCity.toLowerCase()),
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [debouncedCity, allCities]);

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest("#city-field")) setShowSuggestions(false);
      if (!e.target.closest("#guests-panel")) setShowGuests(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const onCityChange = (e) => {
    setSearchData((p) => ({ ...p, city: e.target.value }));
    setCityError("");
  };

  const selectCity = (name) => {
    setSearchData((p) => ({ ...p, city: name }));
    setShowSuggestions(false);
  };

  const onChange = (e) =>
    setSearchData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSearch = () => {
    if (!searchData.city.trim()) {
      setCityError("Enter a city or property");
      cityInputRef.current?.focus(); 
      return;
    }
    const params = new URLSearchParams({
      city: searchData.city.trim(),
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      rooms,
      adults,
      children,
    });
    navigate(`/hotels?${params.toString()}`);
    setShowSuggestions(false);
    setShowGuests(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      onSearch();
    }
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const cityInputRef = useRef(null);

  return (
    <div className="w-full max-w-6xl mx-auto font-sans">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_-8px_rgba(100,130,180,0.15)] border border-white/60 px-3 sm:px-4 py-3.5">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 lg:items-end">
          {/* City */}
          <div className="flex-1 min-w-0" id="city-field">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5 px-1">
              Destination
            </p>
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 group
              ${cityError ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50/50 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-[0_0_12px_rgba(59,130,246,0.1)] hover:border-slate-300"}`}
            >
              <FaMapMarkerAlt
                className={`absolute left-3 text-sm pointer-events-none z-10 ${cityError ? "text-rose-500" : "text-slate-400 group-focus-within:text-blue-500"}`}
              />
              <input
                type="text"
                ref={cityInputRef}
                placeholder="City, area or property"
                value={searchData.city}
                onChange={onCityChange}
                onKeyDown={onKeyDown}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                autoComplete="off"
                className={inputCls}
              />
              {searchData.city && (
                <button
                  onClick={() => {
                    setSearchData((p) => ({ ...p, city: "" }));
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 text-slate-300 hover:text-slate-500 transition-colors z-10"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-[0_12px_40px_rgba(100,130,180,0.12)] z-50 overflow-hidden max-h-48 overflow-y-auto">
                  {suggestions.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => selectCity(city)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <FaMapMarkerAlt className="text-blue-500/60 text-xs shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {city}
                        </p>
                        <p className="text-xs text-slate-400">
                          Hotel destination
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {cityError && (
              <p className="mt-1 px-1 text-[11px] text-rose-500 font-medium">
                {cityError}
              </p>
            )}
          </div>

          <div className="hidden lg:block w-px h-8 bg-slate-200 self-center mx-2" />

          {/* Check-in + Check-out */}
          <div className="flex gap-3 flex-1">
            <Field icon={<FaCalendarAlt />} label="Check-in">
              <input
                type="date"
                name="checkIn"
                value={searchData.checkIn}
                min={getToday()}
                onChange={onChange}
                className={`${inputCls} [color-scheme:light]`}
              />
            </Field>
            <Field icon={<FaCalendarAlt />} label="Check-out">
              <input
                type="date"
                name="checkOut"
                value={searchData.checkOut}
                min={searchData.checkIn}
                onChange={onChange}
                className={`${inputCls} [color-scheme:light]`}
              />
            </Field>
          </div>

          <div className="hidden lg:block w-px h-8 bg-slate-200 self-center mx-2" />

          {/* Guests + Search */}
          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0" id="guests-panel">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5 px-1">
                Guests & rooms
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGuests((v) => !v)}
                  className="w-full flex items-center justify-between pl-3 pr-3 py-3 border border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white rounded-xl transition-all text-sm focus:outline-none"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FaUsers className="text-slate-400 text-sm shrink-0" />
                    <span className="text-slate-700 font-medium truncate">
                      {guestLabel}
                    </span>
                  </div>
                  <FaChevronDown
                    className={`text-slate-400 text-xs ml-2 shrink-0 transition-transform duration-200 ${showGuests ? "rotate-180" : ""}`}
                  />
                </button>

                {showGuests && (
                  <div className="absolute top-full left-0 right-0 lg:left-auto lg:right-0 sm:min-w-75 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(100,130,180,0.15)] z-50 overflow-hidden">
                    <div className="px-5 py-4">
                      <CounterRow
                        label="Rooms"
                        value={rooms}
                        min={1}
                        max={10}
                        onChange={setRooms}
                      />
                      <CounterRow
                        label="Adults"
                        value={adults}
                        min={1}
                        max={30}
                        onChange={setAdults}
                      />
                      <CounterRow
                        label="Children"
                        sub="0 – 17 years old"
                        value={children}
                        min={0}
                        max={10}
                        onChange={setChildren}
                      />
                      {/* Apply button */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowGuests(false);
                          if (searchData.city.trim()) onSearch();
                        }}
                        className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-[0_4px_16px_rgba(99,102,241,0.2)] transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <p className="text-[10px] tracking-widest text-transparent mb-1.5 px-1 select-none">
                S
              </p>
              <button
                onClick={onSearch}
                className="h-[46px] px-6 sm:px-7 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.45)] transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <FaSearch className="text-xs" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
