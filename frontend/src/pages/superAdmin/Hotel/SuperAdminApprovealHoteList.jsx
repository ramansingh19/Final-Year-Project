import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { approveHotelById, getPendingHotels, rejectHotelById } from '../../../features/user/hotelSlice'

function SuperAdminApprovealHoteList() {
  const dispatch = useDispatch()
  const [selectedHotel, setSelectedHotel] = useState(null);
  const { hotels, loading } = useSelector((state) => state.hotel)
   console.log(hotels);

  useEffect(() => {
   dispatch(getPendingHotels())
  }, [dispatch])

  const handleApprove = (e, id) => {
    e.stopPropagation();
    dispatch(approveHotelById(id))

  };

  const handleReject = (e, id) => {
    e.stopPropagation();
    dispatch(rejectHotelById(id))
  };

  const closeModal = () => {
    setSelectedHotel(null);
  };
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-white rounded-xl shadow-md text-3xl">
            🏙️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Cities Pending Approval
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              Total Pending: {hotels.length}
            </p>
          </div>
        </div>
      </div>
  
      {/* CITY/HOTEL LIST */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div
              key={hotel._id}
              onClick={() => setSelectedHotel(hotel)}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border"
            >
              {/* IMAGE */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={hotel.images?.[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
  
                {/* STATUS BADGE */}
                <span
                  className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full font-semibold
                    ${
                      hotel.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : hotel.status === "active"
                        ? "bg-green-100 text-green-700"
                        : hotel.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {hotel.status}
                </span>
  
                {/* NAME & CITY */}
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-sm opacity-90">{hotel.city?.name || "City"}</p>
                </div>
              </div>
  
              {/* INFO */}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                  {hotel.address}
                </p>
  
                {/* FACILITIES PREVIEW */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.facilities?.slice(0, 3).map((f, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
  
                {/* ACTIONS */}
                {hotel.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => handleApprove(e, hotel._id)}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => handleReject(e, hotel._id)}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-20">
            No pending cities
          </p>
        )}
      </div>
  
      {/* POPUP MODAL */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-[95%] md:w-3/4 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>
  
            {/* TITLE & STATUS */}
            <h2 className="text-2xl font-bold mb-2 capitalize text-gray-800 dark:text-white">
              {selectedHotel.name}
            </h2>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full mb-5
                ${
                  selectedHotel.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : selectedHotel.status === "active"
                    ? "bg-green-100 text-green-700"
                    : selectedHotel.status === "inactive"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              {selectedHotel.status}
            </span>
  
            {/* IMAGES */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {selectedHotel.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="hotel"
                  className="w-full h-44 object-cover rounded-xl hover:scale-105 transition"
                />
              ))}
            </div>
  
            {/* DETAILS */}
            <div className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold">City:</span>{" "}
                {selectedHotel.city?.name || "City not loaded"}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {selectedHotel.address}
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold">Description:</span>{" "}
                {selectedHotel.description}
              </p>
              <p>
                <span className="font-semibold">Created By:</span>{" "}
                {selectedHotel.createdBy?.name || "Admin"}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
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
  
            {/* ACTION BUTTONS */}
            {selectedHotel.status === "pending" && (
              <div className="flex gap-3 mt-8">
                <button
                  onClick={(e) => handleApprove(e, selectedHotel._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                >
                  Approve Hotel
                </button>
                <button
                  onClick={(e) => handleReject(e, selectedHotel._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                >
                  Reject Hotel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminApprovealHoteList