import React from "react";

const PlaceSummary = ({ count, distance }) => {
  return (
    <p className="text-sm text-gray-600">
      Showing <span className="font-semibold text-gray-900">{count}</span> places within{" "}
      <span className="font-semibold text-gray-900">{distance / 1000} km</span>
    </p>
  );
};

export default PlaceSummary;
