import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaTimes, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getFilterCounts } from "../../features/user/hotelSlice";

const SUGGESTED_FILTERS = [
  { label: "Rush Deal", count: 305, icon: "🔥" },
  { label: "Last Minute Deals", count: 21, icon: "⏰" },
  { label: "5 Star", count: 219, icon: "⭐⭐⭐⭐⭐" },
  { label: "4 Star", count: 442, icon: "⭐⭐⭐⭐" },
  { label: "Breakfast Included", count: 1096, icon: "🍳" },
  { label: "3 Star", count: 796, icon: "⭐⭐⭐" },
  { label: "Free Cancellation", count: 543, icon: "🛡️" },
  { label: "Couple Friendly", count: 320, icon: "💑" },
];

const PRICE_FILTERS = [
  { label: "Under ₹2,500", value: "0-2500", count: 851 },
  { label: "₹2,500 – ₹5,000", value: "2500-5000", count: 1047 },
  { label: "₹5,000 – ₹7,000", value: "5000-7000", count: 305 },
  { label: "₹7,000 – ₹10,000", value: "7000-10000", count: 198 },
  { label: "Above ₹10,000", value: "10000+", count: 120 },
];

const AMENITY_FILTERS = [
  { label: "Pool", value: "pool", icon: "🏊" },
  { label: "WiFi", value: "wifi", icon: "📶" },
  { label: "Parking", value: "parking", icon: "🚗" },
  { label: "Restaurant", value: "restaurant", icon: "🍽️" },
  { label: "Spa", value: "spa", icon: "💆" },
  { label: "Gym", value: "gym", icon: "🏋️" },
];

const SectionLabel = ({ dot, children }) => (
  <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2.5 flex items-center gap-2">
    <span className={`w-1 h-3 rounded-full ${dot}`} />
    {children}
  </h3>
);

const HotelFilter = ({ onFilterChange, onMapOpen }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get("city") || "";

  const { filterCounts, filterCountsLoading } = useSelector((s) => s.hotel);

  const [filters, setFilters] = useState({
    locality: "",
    suggested: [],
    price: [],
    amenities: [],
    stars: [],
  });

  const toggle = (type, value) => {
    const updated = filters[type].includes(value)
      ? filters[type].filter((v) => v !== value)
      : [...filters[type], value];
    const n = { ...filters, [type]: updated };
    setFilters(n);
    onFilterChange?.(n);
  };

  const handleLocality = (e) => {
    const n = { ...filters, locality: e.target.value };
    setFilters(n);
    onFilterChange?.(n);
  };

  const clearAll = () => {
    const fresh = {
      locality: "",
      suggested: [],
      price: [],
      amenities: [],
      stars: [],
    };
    setFilters(fresh);
    onFilterChange?.(fresh);
  };

  const isActive = (type, value) => filters[type].includes(value);
  const activeCount =
    filters.suggested.length +
    filters.price.length +
    filters.amenities.length +
    filters.stars.length +
    (filters.locality ? 1 : 0);

  useEffect(() => {
    dispatch(getFilterCounts(cityParam));
  }, [cityParam, dispatch]);

  const getCount = (type, key) => {
    if (filterCountsLoading) return null;
    return filterCounts?.[type]?.[key] ?? 0;
  };

  return (
    <div className="w-full lg:w-67 lg:sticky lg:top-4 lg:max-h-[calc(100vh-90px)] flex flex-col font-sans bg-transparent">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800">Filters</span>
          {activeCount > 0 && (
            <span className="bg-linear-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 font-semibold transition-colors"
          >
            <FaTimes className="text-[9px]" /> Clear all
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5
                overscroll-contain
                scroll-smooth
                touch-pan-y">
        {/* Map */}
        <div
          onClick={onMapOpen}
          className="relative h-24 rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-slate-200"
        >
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80"
            alt="Map"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-2.5 flex justify-center">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md transition-transform group-hover:scale-105 border border-slate-200">
              <FaMapMarkerAlt className="text-blue-500 text-[9px]" /> Explore on Map
            </div>
          </div>
        </div>

        {/* Locality search */}
        <div className="relative">
          <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />
          <input
            type="text"
            placeholder="Search locality or hotel…"
            value={filters.locality}
            onChange={handleLocality}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs pl-7 pr-7 text-slate-700 focus:outline-none focus:border-blue-300 transition-colors"
          />
          {filters.locality && (
            <button
              onClick={() => handleLocality({ target: { value: "" } })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FaTimes className="text-[9px]" />
            </button>
          )}
        </div>

        {/* Suggested */}
        <div>
          <SectionLabel dot="bg-[#3d6ef5]">Suggested for you</SectionLabel>
          <div className="space-y-0.5">
            {SUGGESTED_FILTERS.map((item) => {
              const active = isActive("suggested", item.label);
              return (
                <button
                  key={item.label}
                  onClick={() => toggle("suggested", item.label)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg border text-left transition-all duration-150
                    ${active ? "border-blue-200 bg-blue-50/50" : "border-transparent hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 transition-all border
                      ${active ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400"}`}
                    >
                      {active ? "✓" : item.icon.slice(0, 2)}
                    </div>
                    <span
                      className={`text-xs font-medium ${active ? "text-blue-600" : "text-slate-600"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold tabular-nums ${active ? "text-blue-600" : "text-slate-400"}`}
                  >
                    {filterCountsLoading ? (
                      <span className="inline-block w-5 h-2.5 bg-slate-100 rounded animate-pulse" />
                    ) : (
                      `(${getCount("price", item.value)})`
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Star Rating */}
        <div>
          <SectionLabel dot="bg-amber-400">Star Rating</SectionLabel>
          <div className="space-y-0.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const active = filters.stars.includes(star);
              return (
                <button
                  key={star}
                  onClick={() => toggle("stars", star)}
                  className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg border text-left transition-all duration-150
            ${active ? "border-amber-200 bg-amber-50" : "border-transparent hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all border
              ${active ? "bg-amber-500 border-amber-500 text-white shadow-sm" : "bg-slate-50 border-slate-200 text-slate-300"}`}
                    >
                      {active ? (
                        "✓"
                      ) : (
                        <FaStar className="text-[8px]" />
                      )}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(star)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-[10px] ${active ? "text-amber-500" : "text-slate-200"}`}
                        />
                      ))}
                      <span
                        className={`text-xs font-medium ml-1 ${active ? "text-amber-600" : "text-slate-600"}`}
                      >
                        {star} Star
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${active ? "text-amber-600" : "text-slate-400"}`}
                  >
                    {filterCountsLoading ? (
                      <span className="inline-block w-5 h-2.5 bg-slate-100 rounded animate-pulse" />
                    ) : (
                      `(${getCount("stars", star)})`
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Price */}
        <div>
          <SectionLabel dot="bg-emerald-400">Price per night</SectionLabel>
          <div className="space-y-0.5">
            {PRICE_FILTERS.map((item) => {
              const active = isActive("price", item.value);
              return (
                <button
                  key={item.value}
                  onClick={() => toggle("price", item.value)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg border text-left transition-all duration-150
                    ${active ? "border-emerald-200 bg-emerald-50" : "border-transparent hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all border
                      ${active ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" : "bg-slate-50 border-slate-200 text-slate-300"}`}
                    >
                      <FaRupeeSign className="text-[8px]" />
                    </div>
                    <span
                      className={`text-xs font-medium ${active ? "text-emerald-600" : "text-slate-600"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold tabular-nums ${active ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Amenities */}
        <div>
          <SectionLabel dot="bg-purple-500">Amenities</SectionLabel>
          <div className="grid grid-cols-2 gap-1.5">
            {AMENITY_FILTERS.map((item) => {
              const active = isActive("amenities", item.value);
              return (
                <button
                  key={item.value}
                  onClick={() => toggle("amenities", item.value)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[11px] font-medium text-left transition-all duration-150
                    ${active ? "border-purple-200 bg-purple-50 text-purple-600 font-semibold shadow-sm" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"}`}
                >
                  <span className="text-sm leading-none">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 flex gap-2 shrink-0 bg-white/10">
        <button
          onClick={clearAll}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs transition-colors shadow-sm"
        >
          Clear
        </button>
        <button
          onClick={() => onFilterChange?.(filters)}
          className="flex-1 bg-linear-to-r from-[#c67c4e] to-[#b86c3d] hover:from-[#b06d42] hover:to-[#9e5b33]  text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default HotelFilter;
