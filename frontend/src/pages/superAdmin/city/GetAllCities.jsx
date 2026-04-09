import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCities } from "../../../features/user/citySlice";
import { Link } from "react-router-dom";
import { FaCity } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

function GetAllCities() {
  const dispatch = useDispatch();
  const { cities = [], loading } = useSelector((state) => state.city);

  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    dispatch(getAllCities());
  }, [dispatch]);

  return (
<div className="min-h-screen bg-linear-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800 px-4 sm:px-6 lg:px-8 py-6 relative overflow-hidden">
  {/* Background Effects */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/40 blur-3xl rounded-full animate-blob" />
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/40 blur-3xl rounded-full animate-blob animation-delay-2000" />

  <div className="relative z-10 space-y-8">
    {/* Interactive Header */}
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.05)] backdrop-blur-2xl animate-fadeIn">
      <div className="relative p-6 md:p-8">
        <div className="absolute inset-0 bg-linear-to-r from-blue-100 via-cyan-50 to-purple-100 opacity-50" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-300 to-cyan-300 flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,0.25)] animate-pulse">
              <FaCity className="text-3xl text-white" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-300/30 bg-cyan-100 text-cyan-600 text-xs font-medium mb-3">
                City Management Dashboard
              </div>

              <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-gray-800 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Explore All Cities
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600 leading-relaxed text-sm md:text-base">
                Browse, inspect, and manage every city available on the platform from one place.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white/50 px-5 py-4 min-w-35 text-center hover:bg-white/60 transition-all duration-300">
              <p className="text-3xl font-bold text-cyan-500">{cities?.length}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">
                Total Cities
              </p>
            </div>

            <Link
              to="/superAdmin/createCity"
              className="group px-6 py-4 rounded-2xl bg-linear-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 text-white font-semibold shadow-[0_10px_30px_rgba(59,130,246,0.15)] transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-3"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
              Add New City
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Loading State */}
    {loading && (
      <div className="rounded-3xl border border-gray-200 bg-white/60 p-6 backdrop-blur-xl animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-16 rounded-2xl bg-gray-200/30 border border-gray-200/20"
          />
        ))}
      </div>
    )}

    {/* Empty State */}
    {!loading && cities?.length === 0 && (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white/50 p-8 sm:p-16 text-center backdrop-blur-xl">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <FaCity className="text-cyan-400 text-3xl" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Cities Found</h3>
        <p className="text-gray-500">There are currently no cities available in the system.</p>
      </div>
    )}

    {/* Cities Table */}
    {!loading && cities?.length > 0 && (
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-237.5">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="px-4 sm:px-6 py-5 text-left text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">City</th>
                <th className="px-4 sm:px-6 py-5 text-left text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">State</th>
                <th className="px-4 sm:px-6 py-5 text-left text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Country</th>
                <th className="px-4 sm:px-6 py-5 text-left text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Best Time</th>
                <th className="px-4 sm:px-6 py-5 text-left text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Budget</th>
                <th className="px-4 sm:px-6 py-5 text-left text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {cities.map((city) => (
                <tr
                  key={city._id}
                  onClick={() => setSelectedCity(city)}
                  className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 transition-all duration-300 group"
                >
                  <td className="px-4 sm:px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        {city.images?.[0] ? (
                          <img
                            src={city.images[0]}
                            alt={city.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaCity className="text-cyan-500 text-xl" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 capitalize text-base">{city.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to view full details</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-5 text-gray-600 capitalize">{city.state}</td>
                  <td className="px-4 sm:px-6 py-5 text-gray-600">{city.country}</td>
                  <td className="px-4 sm:px-6 py-5 text-gray-500">{city.bestTimeToVisit}</td>
                  <td className="px-4 sm:px-6 py-5 text-green-500 font-semibold">₹{city.avgDailyBudget}</td>
                  <td className="px-4 sm:px-6 py-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                      city.status === "active"
                        ? "bg-green-100 border-green-200 text-green-600"
                        : city.status === "pending"
                        ? "bg-yellow-100 border-yellow-200 text-yellow-600"
                        : "bg-red-100 border-red-200 text-red-600"
                    }`}>
                      {city.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Side Drawer Details */}
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-107.5 md:w-130 bg-white/80 border-l border-gray-200 shadow-[-20px_0_80px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 overflow-y-auto ${
        selectedCity ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {selectedCity && (
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="inline-flex px-3 py-1 rounded-full border border-cyan-300/30 bg-cyan-100 text-cyan-600 text-xs mb-3 mt-10">
                City Details
              </div>

              <h2 className="text-3xl font-bold text-gray-800 capitalize">{selectedCity.name}</h2>
              <p className="text-gray-600 mt-2">Detailed information about this city.</p>
            </div>

            <button
              onClick={() => setSelectedCity(null)}
              className="w-11 h-11 rounded-2xl border border-gray-200 bg-white/50 hover:bg-red-100 hover:border-red-200 text-gray-500 hover:text-red-500 transition-all duration-300 mt-10"
            >
              ✕
            </button>
          </div>

          {selectedCity.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedCity.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="city"
                  className="h-36 w-full object-cover rounded-2xl border border-gray-200 hover:scale-[1.03] transition-transform duration-300"
                />
              ))}
            </div>
          )}

          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Location</p>
              <div className="space-y-2 text-gray-700">
                <p><span className="text-gray-500">State:</span> {selectedCity.state}</p>
                <p><span className="text-gray-500">Country:</span> {selectedCity.country}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white/50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Best Time</p>
                <p className="text-gray-800 font-medium">{selectedCity.bestTimeToVisit}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Daily Budget</p>
                <p className="text-green-500 font-bold text-lg">₹{selectedCity.avgDailyBudget}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Description</p>
              <p className="text-gray-700 leading-7">{selectedCity.description}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Famous For</p>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedCity.famousFor) ? selectedCity.famousFor : [selectedCity.famousFor])
                  .map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-600 text-sm capitalize"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Overlay */}
    {selectedCity && (
      <div
        onClick={() => setSelectedCity(null)}
        className="fixed inset-0 bg-gray-400/40 backdrop-blur-sm z-40"
      />
    )}
  </div>

  {/* Animation Styles */}
  <style>
    {`
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
      }
      .animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      @keyframes fadeIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate-fadeIn { animation: fadeIn 1s ease forwards; }
    `}
  </style>
</div>
  );
}


export default GetAllCities;