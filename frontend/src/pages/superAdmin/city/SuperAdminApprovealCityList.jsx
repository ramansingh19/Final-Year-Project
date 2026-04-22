import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveCityById,
  getPendingCities,
  rejectCityById,
} from "../../../features/user/citySlice";
import { FaCity } from "react-icons/fa";
import { motion } from "framer-motion";

function SuperAdminApprovealCityList() {
  const dispatch = useDispatch();
  const { cities = [], loading } = useSelector((state) => state.city);
  //  console.log(cities);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    dispatch(getPendingCities());
  }, [dispatch]);

  const handleApprove = (e, id) => {
    e.stopPropagation();
    dispatch(approveCityById(id));
  };

  const handleReject = (e, id) => {
    e.stopPropagation();
    dispatch(rejectCityById(id));
  };

  const closeModal = () => {
    setSelectedCity(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 md:px-8 py-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 blur-3xl rounded-full animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200/20 blur-3xl rounded-full animate-pulse-slow" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-lg overflow-hidden shadow-md sm:shadow-lg">
          <div className="relative p-4 sm:p-6 md:p-8">
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-100 via-cyan-50 to-purple-100 opacity-50" />

            <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-400 to-cyan-300 flex items-center justify-center shadow-md sm:shadow-lg animate-pulse">
                  <FaCity className="text-xl sm:text-2xl md:text-3xl text-white" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600 text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 animate-bounce-slow">
                    Pending Requests
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 via-cyan-600 to-blue-500 bg-clip-text text-transparent leading-tight">
                    City Approval Center
                  </h1>

                  <p className="text-gray-600 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base max-w-xl lg:max-w-2xl leading-relaxed">
                    Review all pending city submissions, approve verified
                    cities, or reject incomplete requests.
                  </p>
                </div>
              </div>

              {/* RIGHT STATS */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">
                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white px-3 sm:px-5 py-3 sm:py-4 text-center min-w-0 sm:min-w-30 hover:bg-gray-100 transition-all duration-300 shadow-sm">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-600">
                    {cities?.length}
                  </p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mt-1">
                    Pending Cities
                  </p>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white px-3 sm:px-5 py-3 sm:py-4 text-center min-w-0 sm:min-w-30 hover:bg-gray-100 transition-all duration-300 shadow-sm">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-500">
                    {cities?.filter((c) => c.status === "pending").length}
                  </p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mt-1">
                    Awaiting Action
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 backdrop-blur-lg animate-pulse">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-gray-200/50 border border-gray-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && cities?.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-16 text-center backdrop-blur-lg">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-5 animate-pulse">
              <FaCity className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Pending Cities
            </h3>
            <p className="text-gray-500">
              All city requests have already been reviewed.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && cities?.length > 0 && (
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200 bg-white/90 overflow-hidden backdrop-blur-lg shadow-md sm:shadow-lg">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-200 lg:min-w-225">
                {/* HEADER */}
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    {[
                      "City",
                      "State",
                      "Country",
                      "Best Time",
                      "Status",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 font-semibold whitespace-nowrap"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {cities.map((city) => (
                    <tr
                      key={city._id}
                      onClick={() => setSelectedCity(city)}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-300 cursor-pointer group"
                    >
                      {/* CITY */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-40">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-100/50 to-cyan-100/50 border border-cyan-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FaCity className="text-cyan-500 text-sm sm:text-base md:text-lg" />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 capitalize text-xs sm:text-sm md:text-base">
                              {city.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              Tap to view
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STATE */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-700 capitalize text-xs sm:text-sm whitespace-nowrap">
                        {city.state}
                      </td>

                      {/* COUNTRY */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-700 text-xs sm:text-sm whitespace-nowrap">
                        {city.country}
                      </td>

                      {/* BEST TIME */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 text-gray-600 text-xs sm:text-sm whitespace-nowrap">
                        {city.bestTimeToVisit}
                      </td>

                      {/* STATUS */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap">
                        <span className="inline-flex px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border border-yellow-300/30 bg-yellow-100 text-yellow-600 capitalize">
                          {city.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-37.5">
                          <button
                            onClick={(e) => handleApprove(e, city._id)}
                            disabled={loading}
                            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-green-100 border border-green-300 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300 text-[10px] sm:text-xs md:text-sm font-medium"
                          >
                            Approve
                          </button>

                          <button
                            onClick={(e) => handleReject(e, city._id)}
                            disabled={loading}
                            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-red-100 border border-red-300 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 text-[10px] sm:text-xs md:text-sm font-medium"
                          >
                            Reject
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

        {/* Side Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-105 md:w-130 bg-white border-l border-gray-200 shadow-lg z-50 transform transition-transform duration-500 overflow-y-auto ${
            selectedCity ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {selectedCity && (
            <div className="p-4 sm:p-6 md:p-8">
              {/* HEADER */}
              <div className="flex items-start justify-between mb-6 sm:mb-8">
                <div>
                  <div className="inline-flex px-2.5 sm:px-3 py-1 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600 text-[10px] sm:text-xs mb-2 sm:mb-3 mt-13 sm:mt-10">
                    City Details
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize text-gray-900 leading-tight">
                    {selectedCity.name}
                  </h2>

                  <p className="text-gray-500 mt-1.5 sm:mt-2 text-xs sm:text-sm">
                    Complete information about this city request.
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-gray-100 hover:bg-red-100 border border-gray-200 hover:border-red-300 text-gray-500 hover:text-red-500 transition-all duration-300 mt-13 sm:mt-10 flex items-center justify-center text-sm sm:text-base"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="space-y-4 sm:space-y-5">
                {/* LOCATION */}
                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-2">
                    Location
                  </p>
                  <div className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
                    <p>
                      <span className="text-gray-500">State:</span>{" "}
                      {selectedCity.state}
                    </p>
                    <p>
                      <span className="text-gray-500">Country:</span>{" "}
                      {selectedCity.country}
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-2 sm:mb-3">
                    Description
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-6 sm:leading-7">
                    {selectedCity.description}
                  </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-2">
                      Best Time
                    </p>
                    <p className="text-gray-900 font-medium text-xs sm:text-sm md:text-base">
                      {selectedCity.bestTimeToVisit}
                    </p>
                  </div>

                  <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-2">
                      Avg Budget
                    </p>
                    <p className="text-green-600 font-semibold text-sm sm:text-base md:text-lg">
                      ₹{selectedCity.avgDailyBudget}
                    </p>
                  </div>
                </div>

                {/* FAMOUS */}
                <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-2 sm:mb-3">
                    Famous For
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedCity.famousFor)
                      ? selectedCity.famousFor
                      : String(selectedCity.famousFor).split(",")
                    ).map((item, index) => (
                      <span
                        key={index}
                        className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 text-[10px] sm:text-xs md:text-sm capitalize"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* IMAGES */}
                {selectedCity.images?.length > 0 && (
                  <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 mb-3 sm:mb-4">
                      Images
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                      {selectedCity.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="city"
                          className="w-full h-24 sm:h-28 md:h-32 rounded-xl sm:rounded-2xl object-cover border border-gray-200 hover:scale-[1.03] transition-transform duration-300"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Overlay */}
        {selectedCity && (
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
          />
        )}
      </div>
    </div>
  );
}

export default SuperAdminApprovealCityList;
