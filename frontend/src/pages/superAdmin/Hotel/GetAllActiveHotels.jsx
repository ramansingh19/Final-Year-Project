import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllActiveHotels,
  inactiveHotel,
} from "../../../features/user/hotelSlice";

function GetAllActiveHotels() {
  const dispatch = useDispatch();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(getAllActiveHotels());
  }, [dispatch]);

  const handelInactiveHotel = (hotelId) => {
    dispatch(inactiveHotel(hotelId));
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-800 text-green-600 dark:text-white rounded-xl shadow-md">
            🏨
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Active Hotels
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              Browse all active hotels on the platform
            </p>
          </div>
        </div>
      </div>
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden animate-pulse h-72 shadow-md"
            >
              {/* Image Skeleton */}
              <div className="h-48 w-full bg-gray-300 dark:bg-gray-600"></div>

              {/* Info Skeleton */}
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-4 text-lg font-medium">
            Loading hotels...
          </p>
        </div>
      )}

      {/* Hotels Grid */}
      {!loading && hotels?.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              onClick={() => setSelectedHotel(hotel)}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transform transition"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.images?.[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Status Badge */}
                <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
                  {hotel.status}
                </span>

                {/* Hotel Info Overlay */}
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-sm opacity-90">{hotel.city?.name}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                  {hotel.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && hotels?.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-20">
          No active hotels found.
        </p>
      )}

      {/* Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-[95%] md:w-3/4 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              {selectedHotel.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">
              {selectedHotel.city?.name}
            </p>

            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {selectedHotel.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="hotel"
                  className="w-full h-40 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <p>
                <b>Address:</b> {selectedHotel.address}
              </p>
              <p>
                <b>Status:</b> {selectedHotel.status}
              </p>
              <p>
                <b>Created By:</b> {selectedHotel.createdBy?.name || "Admin"}
              </p>
              <p>
                <b>Location:</b>{" "}
                <a
                  href={`https://www.google.com/maps?q=${selectedHotel.location?.coordinates?.[1]},${selectedHotel.location?.coordinates?.[0]}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View Map
                </a>
              </p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedHotel.description}
              </p>
            </div>

            {/* Facilities */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Facilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedHotel.facilities?.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex gap-3 mt-6 border-t pt-4 justify-end">
              <button
                onClick={() => handelInactiveHotel(selectedHotel._id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllActiveHotels;
