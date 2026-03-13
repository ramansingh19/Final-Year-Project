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
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Explore Hotels</h1>
        <p className="text-gray-500">Browse all hotels on platform</p>
      </div>

      {loading && <p>Loading hotels...</p>}

      {/* HOTEL GRID */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {hotels?.map((hotel) => (
          <div
            key={hotel._id}
            onClick={() => setSelectedHotel(hotel)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition hover:-translate-y-2"
          >
            {/* IMAGE */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={hotel.images?.[0]}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-110 transition"
              />

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

              {/* NAME */}
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <p className="text-sm opacity-90">
                  {hotel.city?.name || "City"}
                </p>
              </div>
            </div>

            {/* INFO */}
            <div className="p-4">
              <p className="text-sm text-gray-500 line-clamp-2">
                {hotel.description}
              </p>

              {/* RATING */}
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                  ⭐ {hotel.averageRating || 0}
                  <span className="text-gray-400 text-xs">
                    ({hotel.totalReviews || 0})
                  </span>
                </div>

                <span className="text-xs text-blue-500">View →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-[95%] md:w-225 max-h-[90vh] overflow-y-auto p-6 relative">

            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedHotel.name}</h2>

            {/* STATUS */}
            <span
              className={`px-3 py-1 text-sm rounded-full
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

            {/* GALLERY */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {selectedHotel.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-44 w-full object-cover rounded-xl"
                />
              ))}
            </div>

            {/* DETAILS */}
            <div className="grid md:grid-cols-2 gap-4 mt-6 text-gray-700">

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
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600">{selectedHotel.description}</p>
            </div>

            {/* FACILITIES */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Facilities</h3>
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