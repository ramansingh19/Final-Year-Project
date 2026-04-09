import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteHotel, getAllRejectedHotels } from "../../../features/user/hotelSlice";
import {
  FaHotel,
  FaSearch,
  FaTrash,
  FaChevronRight,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";

function GetAllRejectedHotels() {
  const dispatch = useDispatch();
  const { hotels = [], loading } = useSelector((state) => state.hotel);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    dispatch(getAllRejectedHotels());
  }, [dispatch]);

  const handleDeleteButton = (hotelId) => {
    dispatch(deleteHotel(hotelId));
  };

  // City filter buttons
  const cityFilters = useMemo(() => {
    const uniqueCities = [
      ...new Set(
        hotels.map((hotel) => hotel.city?.name).filter((name) => name)
      ),
    ];
    return ["All", ...uniqueCities];
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        hotel.name?.toLowerCase().includes(search) ||
        hotel.address?.toLowerCase().includes(search) ||
        hotel.city?.name?.toLowerCase().includes(search);

      const matchesCity =
        selectedCity === "All" || hotel.city?.name === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [hotels, searchTerm, selectedCity]);

  return (
<div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6 lg:p-8 text-gray-900">
  <div className="mx-auto max-w-7xl space-y-6">
    {/* HEADER */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1),transparent_50%)] pointer-events-none" />
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 border border-red-200 animate-pulse">
              <FaHotel className="text-2xl text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Rejected Hotels Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Manage all rejected hotels with search, filters, and actions.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-100 px-5 py-4 animate-fadeIn">
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Total Hotels
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">{hotels.length}</h3>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 animate-fadeIn delay-100">
              <p className="text-xs uppercase tracking-widest text-red-400">
                Showing
              </p>
              <h3 className="mt-2 text-3xl font-bold text-red-600">
                {filteredHotels.length}
              </h3>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="w-full xl:max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hotel, address, or city..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>
      </div>
    </div>

    {/* CITY FILTERS */}
    <div className="flex flex-wrap gap-3">
      {cityFilters.map((city) => (
        <button
          key={city}
          type="button"
          onClick={() => setSelectedCity(city)}
          className={`rounded-2xl border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
            selectedCity === city
              ? "border-red-500 bg-red-100 text-red-700 shadow-md"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {city}
        </button>
      ))}
    </div>

    {/* HOTELS TABLE */}
    {loading ? (
      <div className="flex min-h-87.5 items-center justify-center rounded-3xl border border-gray-200 bg-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-red-500" />
      </div>
    ) : filteredHotels.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
        <FaHotel className="mx-auto mb-4 text-5xl text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">
          No rejected hotels found
        </h2>
        <p className="mt-2 text-gray-500">
          Try changing the search text or selected city.
        </p>
      </div>
    ) : (
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Hotel
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  City
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Address
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Status
                </th>
                <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredHotels.map((hotel) => (
                <tr
                  key={hotel._id}
                  className="border-b border-gray-200 transition-all duration-300 hover:bg-gray-50/70"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={hotel.images?.[0] || "https://via.placeholder.com/80"}
                        alt={hotel.name}
                        className="h-14 w-14 rounded-2xl border border-gray-200 object-cover"
                      />
                      <div>
                        <h3 className="text-base font-semibold capitalize text-gray-900">
                          {hotel.name}
                        </h3>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">{hotel.city?.name || "N/A"}</td>
                  <td className="px-6 py-5 text-gray-600">{hotel.address}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                      Rejected
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteButton(hotel._id)}
                        className="inline-flex items-center rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedHotel(hotel)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* SIDE PANEL */}
    {selectedHotel && (
      <div className="fixed inset-0 z-50 flex justify-end bg-white/80 backdrop-blur-sm">
        <div className="h-full w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white p-6 shadow-lg animate-[slideIn_.35s_ease]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Hotel Details</h2>
            <button
              type="button"
              onClick={() => setSelectedHotel(null)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <FaTimes />
            </button>
          </div>

          <img
            src={selectedHotel.images?.[0] || "https://via.placeholder.com/600x300"}
            alt={selectedHotel.name}
            className="mb-5 h-56 w-full rounded-2xl object-cover"
          />

          <h3 className="text-3xl font-bold capitalize text-gray-900">{selectedHotel.name}</h3>

          <div className="mt-3 flex items-center gap-2 text-gray-500">
            <FaMapMarkerAlt className="text-red-600" />
            <span>
              {selectedHotel.city?.name || "N/A"}, {selectedHotel.address}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-100 p-4">
            <p className="text-sm text-gray-500">Status</p>
            <h4 className="mt-2 text-2xl font-bold text-red-600">Rejected</h4>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  );
}

export default GetAllRejectedHotels;