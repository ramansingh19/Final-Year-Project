import React from "react";

const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
      <p className="text-base font-semibold text-gray-800">No places found.</p>
      <p className="mt-1 text-sm text-gray-500">Try increasing distance.</p>
    </div>
  );
};
  
export default EmptyState;
