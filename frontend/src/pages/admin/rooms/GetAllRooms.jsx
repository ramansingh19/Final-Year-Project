import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeRoomAction,
  inactiveRoomAction,
  getAllRoomsByID,
} from "../../../features/user/roomSlice";
import { getAllHotels } from "../../../features/user/hotelSlice";
import { Link, useParams } from "react-router-dom";

function GetAllRooms() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { rooms = [], loading } = useSelector((state) => state.room);
  const { hotels = [] } = useSelector((state) => state.hotel);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("All");

  useEffect(() => {
    if (id) {
      dispatch(getAllRoomsByID(id));
    }

    dispatch(getAllHotels());
  }, [dispatch, id]);

  const getHotelName = (hotel) => {
    if (!hotel) return "N/A";

    if (typeof hotel === "object") {
      return hotel.name || "N/A";
    }

    const matchedHotel = hotels.find((h) => h._id === hotel);
    return matchedHotel?.name || "N/A";
  };

  const roomTypes = useMemo(() => {
    return ["All", ...new Set(rooms.map((room) => room.roomType))];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesType =
        activeType === "All" || room.roomType === activeType;

      const matchesSearch =
        searchTerm === "" ||
        room.roomNumber?.toString().includes(searchTerm);

      return matchesType && matchesSearch;
    });
  }, [rooms, activeType, searchTerm]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-900">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between md:p-8">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
              Rooms Dashboard
            </p>

            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              Room Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
              View, manage and update all rooms of this hotel.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="min-w-37.5 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                Total Rooms
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {rooms.length}
              </h2>
            </div>

            <div className="min-w-37.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
                Active Rooms
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {rooms.filter((room) => room.status === "active").length}
              </h2>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search room by number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 sm:w-72"
          />

          <div className="flex flex-wrap gap-3">
            {roomTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeType === type
                    ? "border-orange-500 bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {!loading && filteredRooms.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-20 text-center shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-2xl">
            <div className="mb-4 text-6xl">🏨</div>
            <h2 className="mb-2 text-2xl font-black text-slate-900">
              No Rooms Found
            </h2>
            <p className="text-slate-500">
              Try adding rooms or changing the filters.
            </p>
          </div>
        )}

        {/* Rooms Table */}
        {!loading && filteredRooms.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-237.5">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {[
                      "Room Number",
                      "Type",
                      "Price",
                      "Capacity",
                      "Status",
                      "Hotel",
                      "Details",
                    ].map((head) => (
                      <th
                        key={head}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-[0.25em] text-slate-500 ${
                          head === "Details" ? "text-right" : "text-left"
                        }`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredRooms.map((room) => (
                    <tr
                      key={room._id}
                      onClick={() => setSelectedRoom(room)}
                      className="cursor-pointer border-b border-slate-100 transition hover:bg-orange-50/60"
                    >
                      <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                        #{room.roomNumber}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-600">
                        {room.roomType}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-orange-600">
                        ₹{room.pricePerNight}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-600">
                        {room.capacity}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-xl border px-3 py-1 text-xs font-bold capitalize ${
                            room.status === "active"
                              ? "border-emerald-200 bg-emerald-100 text-emerald-600"
                              : "border-red-200 bg-red-100 text-red-500"
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-600">
                        {room.hotelId.name}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white">
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full border-l border-white/70 bg-white/95 shadow-[-20px_0_60px_rgba(15,23,42,0.12)] backdrop-blur-3xl transition-transform duration-500 sm:w-105 md:w-120 ${
          selectedRoom ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedRoom && (
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 p-5 backdrop-blur-2xl">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                  Room Details
                </p>

                <h2 className="text-2xl font-black text-slate-900">
                  {selectedRoom.roomType} - Room {selectedRoom.roomNumber}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Hotel: {getHotelName(selectedRoom.hotel)}
                </p>
              </div>

              <button
                onClick={() => setSelectedRoom(null)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-4">
                <InfoCard title="Room Type" value={selectedRoom.roomType} />
                <InfoCard title="Price" value={`₹${selectedRoom.pricePerNight}`} accent />
                <InfoCard title="Capacity" value={selectedRoom.capacity} />
                <InfoCard
                  title="Status"
                  value={selectedRoom.status}
                  status={selectedRoom.status}
                />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  Description
                </h3>
                <p className="text-sm leading-7 text-slate-500">
                  {selectedRoom.description || "No description available."}
                </p>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-200 bg-white/95 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  to={`/admin/update-room/${selectedRoom._id}`}
                  className="rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:scale-[1.02]"
                >
                  Update Room
                </Link>

                {selectedRoom.status === "active" ? (
                  <button
                    onClick={() => dispatch(inactiveRoomAction(selectedRoom._id))}
                    className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-red-600"
                  >
                    Make Inactive
                  </button>
                ) : (
                  <button
                    onClick={() => dispatch(activeRoomAction(selectedRoom._id))}
                    className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-emerald-600"
                  >
                    Make Active
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedRoom && (
        <div
          onClick={() => setSelectedRoom(null)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        />
      )}
    </div>
  );
}

function InfoCard({ title, value, accent, status }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>

      <p
        className={`font-semibold capitalize ${
          accent
            ? "text-orange-600"
            : status === "active"
            ? "text-emerald-600"
            : status === "inactive"
            ? "text-red-500"
            : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default GetAllRooms;