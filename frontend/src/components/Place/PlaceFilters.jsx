import React from "react";

const categories = ["All", "Nature", "temple" ,"Historical", "Adventure", "Food", "Cultural"];

const PlaceFilters = ({ distance, category, onDistanceChange, onCategoryChange }) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="space-y-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Distance</span>
        <select
          value={distance}
          onChange={(event) => onDistanceChange(Number(event.target.value))}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
          <option value={25000}>25 km</option>
          <option value={100000}>100 km</option>
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Category</span>
        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value === "All" ? "" : event.target.value)
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};


export default PlaceFilters;

