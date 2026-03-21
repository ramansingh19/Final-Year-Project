import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsByHotel, updateBookingStatus } from "../../../features/user/hotelBookingSlice";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHotel, FaUserAlt } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";

function BookedHotels() {
  const dispatch = useDispatch();
  const { hotelId } = useParams();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { hotelBookings = [], loading } = useSelector(
    (state) => state.hotelBooking
  );

  const handleStatusUpdate = (id, status) => {
    console.log(id, status);
    dispatch(updateBookingStatus({ bookingId: id, status }));
    setSelectedBooking(null);
  };
  

  useEffect(() => {
    if (hotelId) {
      dispatch(getBookingsByHotel(hotelId));
    }
  }, [dispatch, hotelId]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="p-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg text-2xl">
          <FaHotel />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Room Bookings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor all bookings for this hotel
          </p>
        </div>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-gray-800 p-5 rounded-2xl shadow"
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && hotelBookings.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            No bookings found
          </h2>
          <p className="text-gray-400 mt-2">No one has booked rooms yet</p>
        </div>
      )}

      {/* BOOKINGS GRID */}
      {!loading && hotelBookings.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotelBookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedBooking(booking)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              {/* USER */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full">
                  <FaUserAlt />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {booking.user?.name || "Guest User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {booking.user?.email || "No email"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <MdMeetingRoom className="text-lg" />
                  Rooms Booked:{" "}
                  <span className="font-semibold">{booking.bookedRooms}</span>
                </p>

                <p>
                  Check-In:{" "}
                  <span className="font-medium">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </span>
                </p>

                <p>
                  Check-Out:{" "}
                  <span className="font-medium">
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* STATUS */}
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    booking.bookingStatus === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.bookingStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.bookingStatus}
                </span>

                <p className="text-xs text-gray-400">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            {/* HEADER */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Booking Details
            </h2>

            {/* USER INFO */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-700 dark:text-white">
                {selectedBooking.user?.name || "Guest"}
              </h3>
              <p className="text-gray-500">{selectedBooking.user?.email}</p>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300 mb-6">
              <p>
                <b>Rooms:</b> {selectedBooking.bookedRooms}
              </p>
              <p>
                <b>Status:</b> {selectedBooking.bookingStatus}
              </p>

              <p>
                <b>Check-In:</b>{" "}
                {new Date(selectedBooking.checkIn).toLocaleDateString()}
              </p>

              <p>
                <b>Check-Out:</b>{" "}
                {new Date(selectedBooking.checkOut).toLocaleDateString()}
              </p>

              <p>
                <b>Booked On:</b>{" "}
                {new Date(selectedBooking.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 justify-end">
              {/* CONFIRM */}
              <button
                onClick={() =>
                  handleStatusUpdate(selectedBooking._id, "confirmed")
                }
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer"
              >
                Confirm
              </button>

              {/* PENDING */}
              <button
                onClick={() =>
                  handleStatusUpdate(selectedBooking._id, "pending")
                }
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg cursor-pointer"
              >
                Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookedHotels;
