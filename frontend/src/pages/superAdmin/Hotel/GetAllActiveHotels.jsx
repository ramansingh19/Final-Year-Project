import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllActiveHotels, inactiveHotel } from "../../../features/user/hotelSlice";
import { FaHotel, FaMapMarkerAlt, FaSearch, FaTimes } from "react-icons/fa";

function GetAllActiveHotels() {
  const dispatch = useDispatch();
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    dispatch(getAllActiveHotels());
  }, [dispatch]);

  const handelInactiveHotel = (hotelId) => {
    dispatch(inactiveHotel(hotelId));
  };

  // Filters for cities
  const cityOptions = useMemo(() => {
    const uniqueCities = [...new Set(hotels.map((h) => h.city?.name).filter(Boolean))];
    return ["All", ...uniqueCities];
  }, [hotels]);

  // Filtered hotels
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name?.toLowerCase().includes(search.toLowerCase()) ||
        hotel.address?.toLowerCase().includes(search.toLowerCase()) ||
        hotel.city?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesCity = cityFilter === "All" || hotel.city?.name === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [hotels, search, cityFilter]);

  return (
<div className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 sm:px-6 lg:px-8 relative overflow-hidden">
  {/* Background Glow */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl animate-pulse-slow" />
  </div>

  {/* Header */}
  <div className="relative mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-linear-to-br from-white via-gray-100 to-gray-50 shadow-lg">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_35%)]" />

    <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 text-blue-600 shadow-lg shadow-blue-200 animate-pulse">
          <FaHotel className="text-3xl" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Active Hotels Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Manage, search, and filter active hotels in your platform.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm text-blue-600 animate-bounce-slow">
              {filteredHotels.length} Active Hotels
            </div>

            <div className="rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-600">
              {cityFilter === "All" ? "Showing All Cities" : cityFilter}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Search + Filters */}
  <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
    <div className="relative w-full xl:max-w-md">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by hotel name, address or city..."
        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-200"
      />
    </div>

    <div className="flex flex-wrap gap-3">
      {cityOptions.map((city) => (
        <button
          key={city}
          onClick={() => setCityFilter(city)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
            cityFilter === city
              ? "border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-200"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {city}
        </button>
      ))}
    </div>
  </div>

  {/* Table */}
  <div className="overflow-y-scroll h-125 rounded-3xl border border-gray-200 bg-white shadow-lg backdrop-blur-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-100">
          <tr>
            <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Hotel</th>
            <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">City</th>
            <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Status</th>
            <th className="px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Address</th>
            <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(6)].map((_, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td colSpan="5" className="px-6 py-5">
                  <div className="h-14 animate-pulse rounded-2xl bg-gray-100" />
                </td>
              </tr>
            ))
          ) : filteredHotels.length ? (
            filteredHotels.map((hotel) => (
              <tr
                key={hotel._id}
                onClick={() => setSelectedHotel(hotel)}
                className="cursor-pointer border-b border-gray-100 transition-all duration-300 hover:bg-blue-100/20"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={hotel.images?.[0]}
                      alt={hotel.name}
                      className="h-14 w-14 rounded-2xl border border-gray-200 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold capitalize text-gray-900">{hotel.name}</h3>
                      <p className="mt-1 max-w-xs truncate text-xs text-gray-500">{hotel.description}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-gray-600">{hotel.city?.name}</td>
                <td className="px-6 py-5 text-sm text-gray-600">{hotel.status}</td>
                <td className="px-6 py-5 text-sm text-gray-600">{hotel.address}</td>

                <td className="px-6 py-5 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); handelInactiveHotel(hotel._id); }}
                    className="rounded-xl border border-blue-200 bg-blue-100 px-4 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-200"
                  >
                    Inactive
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                No active hotels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Side Drawer */}
  {selectedHotel && (
    <div className="fixed inset-0 z-50 bg-gray-50/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setSelectedHotel(null)} />

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-gray-200 bg-white shadow-lg animate-[slideIn_.35s_ease]">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold capitalize text-gray-900">{selectedHotel.name}</h2>
              <div className="mt-2 flex items-center gap-2 text-gray-500">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>{selectedHotel.city?.name}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedHotel(null)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-red-400 hover:bg-red-100 hover:text-red-500"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Images */}
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedHotel.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={selectedHotel.name}
                className="h-48 w-full rounded-3xl border border-gray-200 object-cover transition duration-300 hover:scale-[1.02]"
              />
            ))}
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{selectedHotel.status}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">Location</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                <a
                  href={`https://www.google.com/maps?q=${selectedHotel.location?.coordinates?.[1]},${selectedHotel.location?.coordinates?.[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline"
                >
                  View Map
                </a>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
            <p className="leading-7 text-gray-600">{selectedHotel.description}</p>
          </div>

          {/* Facilities */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {selectedHotel.facilities?.map((f, idx) => (
                <span key={idx} className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => handelInactiveHotel(selectedHotel._id)}
            className="w-full rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Inactive Hotel
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

export default GetAllActiveHotels;