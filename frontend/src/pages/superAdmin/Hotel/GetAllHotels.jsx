import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllHotels } from "../../../features/user/hotelSlice";

function GetAllHotels() {
  const dispatch = useDispatch();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(getAllHotels());
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-white rounded-xl shadow-md text-3xl">
            🏨
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Explore Hotels
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              Browse all hotels on the platform
            </p>
            <p className="text-black text-bold">Total Hotel: <span className="text-gray-500 dark:text-gray-300">{hotels.length}</span></p>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden animate-pulse shadow-md h-72"
            >
              {/* Image Skeleton */}
              <div className="h-48 w-full bg-gray-300 dark:bg-gray-600"></div>

              {/* Hotel Info Skeleton */}
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

      {/* HOTELS GRID */}
      {!loading && hotels?.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              onClick={() => setSelectedHotel(hotel)}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.images?.[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

                {/* STATUS BADGE */}
                <span
                  className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full font-semibold
                    ${
                      hotel.status === "active"
                        ? "bg-green-100 text-green-700"
                        : hotel.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {hotel.status}
                </span>

                {/* HOTEL NAME & CITY */}
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-sm opacity-90">
                    {hotel.city?.name || "City"}
                  </p>
                </div>
              </div>

              {/* INFO */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                  {hotel.description}
                </p>

                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                    ⭐ {hotel.averageRating || 0}
                    <span className="text-gray-400 dark:text-gray-400 text-xs">
                      ({hotel.totalReviews || 0})
                    </span>
                  </div>
                  <span className="text-xs text-blue-500">View →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && hotels?.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-20">
          No hotels found.
        </p>
      )}

      {/* MODAL */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-[95%] md:w-3/4 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              {selectedHotel.name}
            </h2>

            {/* STATUS */}
            <span
              className={`px-3 py-1 text-sm rounded-full font-semibold
                ${
                  selectedHotel.status === "active"
                    ? "bg-green-100 text-green-700"
                    : selectedHotel.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {selectedHotel.status}
            </span>

            {/* IMAGE GALLERY */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {selectedHotel.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="hotel"
                  className="w-full h-40 object-cover rounded-xl"
                />
              ))}
            </div>

            {/* DETAILS */}
            <div className="grid md:grid-cols-2 gap-4 mt-6 text-gray-700 dark:text-gray-300">
              <p>
                <b>City:</b> {selectedHotel.city?.name}
              </p>
              <p>
                <b>Address:</b> {selectedHotel.address}
              </p>
              <p>
                <b>Rating:</b> ⭐ {selectedHotel.averageRating} (
                {selectedHotel.totalReviews} reviews)
              </p>
              <p>
                <b>Created:</b>{" "}
                {new Date(selectedHotel.createdAt).toLocaleDateString()}
              </p>
              <p>
                <b>Location:</b>{" "}
                <a
                  href={`https://www.google.com/maps?q=${selectedHotel.location?.coordinates?.[1]},${selectedHotel.location?.coordinates?.[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View on Map
                </a>
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedHotel.description}
              </p>
            </div>

            {/* FACILITIES */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                Facilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedHotel.facilities?.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllHotels;
