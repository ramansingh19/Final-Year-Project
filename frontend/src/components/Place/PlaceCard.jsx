import React from "react";

const formatDistance = (distance) => {
  if (!distance && distance !== 0) return "N/A";
  if (distance > 1000) return `${(distance / 1000).toFixed(1)} km`;
  return `${Math.round(distance)} m`;
};

const PlaceCard = ({ place, isSelected, isHovered, onClick, onMouseEnter, onMouseLeave }) => {
  const image = place?.image || place?.images?.[0] || "https://placehold.co/320x180?text=Place";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`w-full rounded-2xl border bg-white text-left shadow-md transition duration-200 ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-100"
          : isHovered
            ? "border-indigo-200"
            : "border-gray-100"
      }`}
    >
      <div className="relative">
        <img
          src={image}
          alt={place?.name || "Place"}
          className="h-40 w-full rounded-t-2xl object-cover"
        />
        {place?.isPopular && (
          <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white">
            Popular
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{place?.name || "-"}</h3>
        <p className="text-sm text-gray-500">{place?.category || "Uncategorized"}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Distance:</span> {formatDistance(place?.distance)}
          </p>
          <p>
            <span className="font-medium">Entry Fee:</span> {place?.entryFee ?? "Free"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default PlaceCard;