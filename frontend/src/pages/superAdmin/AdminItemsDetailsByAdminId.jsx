import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAdminHotels } from "../../features/user/hotelSlice";

function AdminItemsDetailsByAdminId() {
  const { adminId } = useParams();
  const dispatch = useDispatch();
  const { hotels, loadingHotels, error } = useSelector((state) => state.hotel);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(getAdminHotels(adminId));
  }, [dispatch, adminId]);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Hosted Items
      </h1>

      {loadingHotels && (
  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md"
      >
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-5/6"></div>
      </div>
    ))}
  </div>
)}
      {error && (
        <p className="text-center py-10 text-red-500">{error}</p>
      )}
      {!loadingHotels && hotels.length === 0 && (
        <p className="text-center py-10 text-gray-500 dark:text-gray-400">
          No hosted items found for this admin.
        </p>
      )}

      {/* Item Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition"
            onClick={() => setSelectedItem(hotel)}
          >
            <img
              src={hotel.images?.[0]}
              alt={hotel.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{hotel.name}</h3>
            <p className="text-gray-500 dark:text-gray-300">{hotel.city?.name}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">{hotel.address}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full md:w-3/4 max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              {selectedItem.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">{selectedItem.city?.name}</p>

            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {selectedItem.images?.map((img, i) => (
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
              <p><b>Address:</b> {selectedItem.address}</p>
              <p><b>Status:</b> {selectedItem.status}</p>
              <p><b>Created By:</b> {selectedItem.createdBy?.name || "Admin"}</p>
              <p>
                <b>Location:</b>{" "}
                <a
                  href={`https://www.google.com/maps?q=${selectedItem.location?.coordinates?.[1]},${selectedItem.location?.coordinates?.[0]}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View Map
                </a>
              </p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Description</h3>
              <p className="text-gray-600 dark:text-gray-300">{selectedItem.description}</p>
            </div>

            {/* Facilities */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedItem.facilities?.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
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

export default AdminItemsDetailsByAdminId;