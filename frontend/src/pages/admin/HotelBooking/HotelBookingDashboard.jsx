import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHotel } from "react-icons/fa";
import { getAllActiveHotels } from "../../../features/user/hotelSlice";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

function HotelBookingDashboard() {
  const dispatch = useDispatch();

  const { hotels = [], loading } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(getAllActiveHotels())
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* header */}
      <div className="flex items-center gap-4  px-5 py-5 rounded-2xl shadow-sm shadow-gray-500">
        <div className="p-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg text-2xl">
          <FaHotel />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Room Booking Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor all active hotels on your platform
          </p>
        </div>
      </div>
      {/* Admin active hotels */}
      <div>
      {loading ? (
        <p className="text-gray-500">Loading hotels...</p>
      ) : hotels.length === 0 ? (
        <p className="text-gray-500">No active hotels found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {hotels
            .filter((h) => h && h._id)
            .map((hotel) => (
              <motion.div
                key={hotel._id}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 mt-5"
              >
                {/* Info */}
                <Link to={`/admin/booked-hotels/${hotel._id}`}>
                  <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {hotel.city?.name}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                    {hotel.address}
                  </p>

                  </div> 
                </Link>
              </motion.div>
            ))}
        </div>
      )}
      </div>

    </div>
  );
}

export default HotelBookingDashboard;
