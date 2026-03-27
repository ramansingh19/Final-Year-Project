import React from "react";

const PlaceHeader = ({ cityName, searchQuery, onSearchChange, onUseLocation }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Current City</p>
          <h1 className="text-xl font-semibold text-gray-900">{cityName}</h1>
        </div>
        <button
          type="button"
          onClick={onUseLocation}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          Use My Location
        </button>
      </div>

      <input
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search places or categories..."
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

export default PlaceHeader;
