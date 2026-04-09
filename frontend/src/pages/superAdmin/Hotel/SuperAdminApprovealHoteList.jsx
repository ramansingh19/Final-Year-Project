import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveHotelById,
  getPendingHotels,
  rejectHotelById,
} from "../../../features/user/hotelSlice";
import {
  FaHotel,
  FaSearch,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaFilter,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function SuperAdminApprovealHoteList() {
  const dispatch = useDispatch();
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  useEffect(() => {
    dispatch(getPendingHotels());
  }, [dispatch]);

  const handleApprove = (e, id) => {
    e.stopPropagation();
    dispatch(approveHotelById(id));
  };

  const handleReject = (e, id) => {
    e.stopPropagation();
    dispatch(rejectHotelById(id));
  };

  const states = useMemo(() => {
    const uniqueStates = [
      ...new Set(
        hotels
          ?.map((hotel) => hotel?.city?.state)
          .filter((state) => state && state.trim() !== "")
      ),
    ];
    return ["All", ...uniqueStates];
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel?.name?.toLowerCase().includes(search.toLowerCase()) ||
        hotel?.city?.name?.toLowerCase().includes(search.toLowerCase()) ||
        hotel?.address?.toLowerCase().includes(search.toLowerCase());

      const matchesState =
        selectedState === "All" ||
        hotel?.city?.state === selectedState;

      return matchesSearch && matchesState;
    });
  }, [hotels, search, selectedState]);

  return (
<div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 px-4 md:px-8 py-6 overflow-hidden text-gray-900">
  {/* Background Glow */}
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-200/20 blur-3xl rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/20 blur-3xl rounded-full" />
  </div>

  {/* Header */}
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative z-10 mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg"
  >
    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-cyan-200/20 blur-3xl" />
    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-200/20 blur-2xl" />

    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-400 text-3xl shadow-md shadow-cyan-300/20">
          <FaHotel />
        </div>

        <div>
          <div className="mb-2 inline-flex rounded-full border border-cyan-200/50 bg-cyan-200/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-600">
            Hotel Approval Panel
          </div>

          <h1 className="text-3xl md:text-5xl font-bold">Pending Hotel Approvals</h1>

          <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-500 leading-7">
            Review, approve or reject pending hotels from one clean and interactive dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 animate-fadeIn">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total Pending</p>
              <p className="mt-1 text-2xl font-bold">{filteredHotels.length}</p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-cyan-100 px-4 py-3 animate-fadeIn delay-100">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Current Filter</p>
              <p className="mt-1 text-lg font-semibold text-cyan-700">{selectedState}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="w-full xl:w-95 space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search hotel, city or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                selectedState === state
                  ? "bg-cyan-400 text-white shadow-md shadow-cyan-300/20"
                  : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>

  {/* Table */}
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="relative z-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md"
  >
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-100">
          <tr>
            <th className="px-6 py-5 text-sm font-semibold text-gray-600">Hotel</th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-600">City</th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-600">State</th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-600">Address</th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-6 py-5 text-sm font-semibold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel, index) => (
              <motion.tr
                key={hotel._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedHotel(hotel)}
                className="group cursor-pointer border-b border-gray-200 transition hover:bg-gray-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={hotel.images?.[0]}
                      alt={hotel.name}
                      className="h-14 w-14 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-cyan-500 transition">{hotel.name}</p>
                      <p className="text-sm text-gray-500">Click to view details</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-700">{hotel.city?.name || "-"}</td>
                <td className="px-6 py-5 text-gray-600">{hotel.city?.state || "-"}</td>
                <td className="px-6 py-5 max-w-65 truncate text-gray-600">{hotel.address}</td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-yellow-100 border border-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-600">
                    {hotel.status}
                  </span>
                </td>
                <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => handleApprove(e, hotel._id)}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={(e) => handleReject(e, hotel._id)}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-20 text-center text-gray-500">
                No hotels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </motion.div>

  {/* Side Detail Panel */}
  <AnimatePresence>
    {selectedHotel && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedHotel(null)}
          className="fixed inset-0 z-40 bg-gray-100/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="fixed right-0 top-0 z-50 h-full w-full sm:w-125 overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-cyan-200/50 bg-cyan-200/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-600">
                Hotel Details
              </div>
              <h2 className="text-3xl font-bold">{selectedHotel.name}</h2>
            </div>

            <button
              onClick={() => setSelectedHotel(null)}
              className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-gray-700 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <FaTimes />
            </button>
          </div>

          <img
            src={selectedHotel.images?.[0]}
            alt={selectedHotel.name}
            className="mt-6 h-64 w-full rounded-3xl object-cover border border-gray-200"
          />

          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">City</span>
                  <span className="text-gray-900">{selectedHotel.city?.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">State</span>
                  <span className="text-gray-900">{selectedHotel.city?.state || "-"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Status</span>
                  <span className="text-yellow-600 capitalize">{selectedHotel.status}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-3 text-lg font-semibold">Address</h3>
              <p className="text-sm leading-7 text-gray-700">{selectedHotel.address}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-3 text-lg font-semibold">Description</h3>
              <p className="text-sm leading-7 text-gray-700">{selectedHotel.description}</p>
            </div>

            {selectedHotel.facilities?.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-4 text-lg font-semibold">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHotel.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-cyan-200 bg-cyan-100 px-3 py-2 text-sm text-cyan-700"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedHotel.location?.coordinates && (
              <a
                href={`https://www.google.com/maps?q=${selectedHotel.location.coordinates[1]},${selectedHotel.location.coordinates[0]}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-blue-400 px-5 py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                <FaMapMarkerAlt />
                Open in Google Maps
                <FaArrowRight className="text-sm" />
              </a>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={(e) => handleApprove(e, selectedHotel._id)}
                className="rounded-2xl bg-emerald-500 py-4 font-semibold text-white transition hover:bg-emerald-600"
              >
                Approve Hotel
              </button>

              <button
                onClick={(e) => handleReject(e, selectedHotel._id)}
                className="rounded-2xl bg-red-500 py-4 font-semibold text-white transition hover:bg-red-600"
              >
                Reject Hotel
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>
  );
}

export default SuperAdminApprovealHoteList;