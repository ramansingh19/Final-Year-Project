import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHotel, FaSearch } from "react-icons/fa";
import { getAllActiveHotels } from "../../../features/user/hotelSlice";

function HotelBookingDashboard() {
  const dispatch = useDispatch();
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    dispatch(getAllActiveHotels());
  }, [dispatch]);

  const filteredHotels = hotels.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity ? h.city?.name === selectedCity : true;
    return matchesSearch && matchesCity;
  });

  const cities = Array.from(new Set(hotels.map((h) => h.city?.name).filter(Boolean)));

  return (
<div className="min-h-screen bg-[#f6f8fc] text-slate-900 relative overflow-hidden px-4 py-8 md:px-8">
  {/* Background Glow */}
  <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
  <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

  <div className="relative z-10 max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-8 rounded-4xl border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_25px_60px_rgba(15,23,42,0.08)] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-orange-100 blur-3xl opacity-70" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-100 blur-3xl opacity-70" />

      <div className="relative z-10 flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500 text-3xl text-white shadow-[0_18px_35px_rgba(249,115,22,0.35)] transition-all duration-300 hover:scale-105">
          <FaHotel />
        </div>

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
            Admin Panel
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Room Booking Dashboard
          </h1>

          <p className="mt-2 text-sm md:text-base text-slate-500 max-w-2xl leading-7">
            Manage and monitor all active hotels on your platform
          </p>
        </div>
      </div>
    </div>

    {/* Search & City Filters */}
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="relative w-full md:w-1/2">
        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

        <input
          type="text"
          placeholder="Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-3xl border border-white/70 bg-white/90 pl-12 pr-4 py-3.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
            selectedCity === ""
              ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200"
              : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          }`}
          onClick={() => setSelectedCity("")}
        >
          All Cities
        </button>

        {cities.map((city) => (
          <button
            key={city}
            className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              selectedCity === city
                ? "bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200"
                : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
            }`}
            onClick={() => setSelectedCity(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>

    {/* Hotels Table */}
    <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/85 backdrop-blur-2xl shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Hotel Name
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                City
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Address
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="py-10 text-center text-slate-400 text-sm font-medium"
                >
                  Loading hotels...
                </td>
              </tr>
            ) : filteredHotels.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="py-10 text-center text-slate-400 text-sm font-medium"
                >
                  No hotels found.
                </td>
              </tr>
            ) : (
              filteredHotels.map((hotel) => (
                <tr
                  key={hotel._id}
                  className="group cursor-pointer border-b border-slate-100 transition-all duration-300 hover:bg-orange-50/60"
                  onClick={() =>
                    (window.location.href = `/admin/booked-hotels/${hotel._id}`)
                  }
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 text-white shadow-md transition-all duration-300 group-hover:scale-105">
                        <FaHotel className="text-lg" />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 transition-colors duration-300 group-hover:text-orange-600">
                          {hotel.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Hotel ID: {hotel._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                      {hotel.city?.name}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm leading-6 text-slate-500 max-w-sm">
                    {hotel.address}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  );
}

export default HotelBookingDashboard;