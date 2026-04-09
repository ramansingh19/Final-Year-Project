import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookingsByHotel,
  updateBookingStatus,
} from "../../../features/user/hotelBookingSlice";
import { useParams } from "react-router-dom";
import {
  Search,
  User,
  Clock3,
  CircleDollarSign,
  CheckCircle2,
  X,
  Package,
} from "lucide-react";

function BookedHotels() {
  const dispatch = useDispatch();
  const { hotelId } = useParams();
  const { hotelBookings = [], loading } = useSelector(
    (state) => state.hotelBooking
  );

  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (hotelId) {
      dispatch(getBookingsByHotel(hotelId));
    }
  }, [dispatch, hotelId]);

  // FILTER BOOKINGS
  const filteredBookings = useMemo(() => {
    return hotelBookings.filter((b) => {
      const query = search.toLowerCase();
      return (
        b.user?.name?.toLowerCase().includes(query) ||
        b.user?.email?.toLowerCase().includes(query)
      );
    });
  }, [hotelBookings, search]);

  // STATS
  const stats = {
    total: hotelBookings.length,
    pending: hotelBookings.filter((b) => b.bookingStatus === "pending").length,
    confirmed: hotelBookings.filter(
      (b) => b.bookingStatus === "confirmed"
    ).length,
    revenue: hotelBookings.reduce((a, b) => a + (b.totalPrice || 0), 0),
  };

  const statusStyles = {
    pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
    confirmed: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
    cancelled: "bg-red-500/15 text-red-300 border border-red-500/20",
  };

  const handleStatusUpdate = (id, status) => {
    dispatch(updateBookingStatus({ bookingId: id, status }));
    setSelectedBooking(null);
  };

  return (
<div className="min-h-screen bg-[#f6f8fc] text-slate-900 relative overflow-hidden px-4 md:px-6 py-6">
  {/* Background Effects */}
  <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
  <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
  <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />

  <div className="relative z-10">
    {/* HEADER */}
    <div className="mb-8 rounded-4xl border border-white/70 bg-white/80 p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-orange-100 blur-3xl opacity-70" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-100 blur-3xl opacity-70" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <p className="mb-2 text-xs md:text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
            Admin Panel
          </p>

          <h1 className="text-3xl md:text-5xl font-black leading-tight text-slate-900">
            Hotel Bookings
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500 text-sm md:text-base leading-7">
            Manage all room bookings, update status, and monitor revenue from one dashboard.
          </p>
        </div>

        <div className="w-full lg:w-85">
          <div className="group flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user name or email..."
              className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {[
        {
          label: "Total Bookings",
          value: stats.total,
          icon: User,
          bg: "from-sky-50 to-blue-100",
          iconBg: "bg-sky-500",
        },
        {
          label: "Pending",
          value: stats.pending,
          icon: Clock3,
          bg: "from-amber-50 to-orange-100",
          iconBg: "bg-orange-500",
        },
        {
          label: "Confirmed",
          value: stats.confirmed,
          icon: CheckCircle2,
          bg: "from-violet-50 to-indigo-100",
          iconBg: "bg-violet-500",
        },
        {
          label: "Revenue",
          value: `₹${stats.revenue}`,
          icon: CircleDollarSign,
          bg: "from-emerald-50 to-green-100",
          iconBg: "bg-emerald-500",
        },
      ].map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`group rounded-[28px] border border-white/70 bg-linear-to-br ${card.bg} p-5 shadow-[0_15px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {card.label}
                </p>

                <h2 className="mt-3 text-3xl font-black text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} text-white shadow-lg transition-all duration-300 group-hover:scale-105`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* BOOKINGS TABLE */}
    <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/85 backdrop-blur-2xl shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 px-6 py-5 bg-slate-50/80">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Recent Bookings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredBookings.length} bookings
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-237.5">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Rooms</th>
              <th className="px-6 py-4 font-bold">Check-In</th>
              <th className="px-6 py-4 font-bold">Check-Out</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr
                key={booking._id}
                onClick={() => setSelectedBooking(booking)}
                className="group cursor-pointer border-b border-slate-100 transition-all duration-300 hover:bg-orange-50/60"
                style={{
                  animation: `fadeInUp 0.4s ease ${index * 0.05}s both`,
                }}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-600 text-white shadow-md transition-all duration-300 group-hover:scale-105">
                      <User className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        {booking.user?.name || "Guest"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {booking.user?.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {booking.bookedRooms}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm font-medium text-slate-600">
                  {new Date(booking.checkIn).toLocaleDateString()}
                </td>

                <td className="px-6 py-5 text-sm font-medium text-slate-600">
                  {new Date(booking.checkOut).toLocaleDateString()}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[booking.bookingStatus]}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>

                <td
                  className="px-6 py-5 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:scale-105 hover:shadow-orange-300"
                  >
                    View Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* SIDEBAR MODAL */}
    {selectedBooking && (
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm">
        <div className="h-full w-full max-w-xl overflow-y-auto border-l border-white/60 bg-[#f8fafc] p-6 shadow-[0_0_80px_rgba(15,23,42,0.15)] animate-[slideInRight_0.35s_ease]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500 mt-15">
                Booking Details
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                {selectedBooking.user?.name || "Guest"}
              </h2>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 shadow-sm transition-all duration-300 hover:rotate-90 hover:bg-orange-50 hover:text-orange-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6 rounded-3xl border border-white/70 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">User</p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {selectedBooking.user?.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedBooking.user?.email}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize ${statusStyles[selectedBooking.bookingStatus]}`}
              >
                {selectedBooking.bookingStatus}
              </span>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-white/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-blue-600 text-white">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Booking Info</h3>
                <p className="text-sm text-slate-500">
                  Detailed booking information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">Rooms Booked</span>
                <span className="font-bold text-slate-900">
                  {selectedBooking.bookedRooms}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">Check-In</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedBooking.checkIn).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">Check-Out</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedBooking.checkOut).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3">
                <span className="text-orange-600 font-medium">Total Price</span>
                <span className="text-xl font-black text-orange-600">
                  ₹{selectedBooking.totalPrice || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectedBooking.bookingStatus !== "confirmed" && (
              <button
                onClick={() =>
                  handleStatusUpdate(selectedBooking._id, "confirmed")
                }
                className="rounded-2xl bg-linear-to-r from-emerald-500 to-green-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-105"
              >
                Confirm Booking
              </button>
            )}

            {selectedBooking.bookingStatus !== "pending" && (
              <button
                onClick={() =>
                  handleStatusUpdate(selectedBooking._id, "pending")
                }
                className="rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:scale-105"
              >
                Mark Pending
              </button>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Add this once in your global CSS or below component */}
    <style jsx>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `}</style>
  </div>
</div>
  );
}

export default BookedHotels;