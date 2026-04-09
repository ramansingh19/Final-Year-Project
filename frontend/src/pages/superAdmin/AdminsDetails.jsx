import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdmin } from "../../features/auth/adminAuthSlice";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaArrowRight,
  FaCircle,
  FaCheckCircle,
} from "react-icons/fa";

function AdminsDetails() {
  const dispatch = useDispatch();

  const { admins = [] } = useSelector((state) => state.adminAuth);
  const { superAdmin } = useSelector((state) => state.superAdmin);
  const { selectedAdminId, loadingAdmins, error } = useSelector(
    (state) => state.hotel
  );

  const [search, setSearch] = useState("");
  const [hostTypeFilter, setHostTypeFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllAdmin());
  }, [dispatch]);

  const hostTypeCounts = useMemo(
    () => ({
      all: admins.length,
      hotel: admins.filter(
        (admin) => admin.host?.toLowerCase() === "hotel"
      ).length,
      restaurant: admins.filter(
        (admin) => admin.host?.toLowerCase() === "restaurant"
      ).length,
    }),
    [admins]
  );

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        admin.userName?.toLowerCase().includes(searchText) ||
        admin.email?.toLowerCase().includes(searchText) ||
        admin.contactNumber?.includes(searchText);

      const matchesHostType =
        hostTypeFilter === "all" ||
        admin.host?.toLowerCase() === hostTypeFilter;

      return matchesSearch && matchesHostType;
    });
  }, [admins, search, hostTypeFilter]);

  return (
<div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900 relative overflow-hidden">

{/* Background Glow */}
<div className="pointer-events-none fixed inset-0 overflow-hidden">
  <div className="absolute -top-32 left-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl animate-pulse" />
  <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl animate-pulse" />
  <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl animate-pulse" />
</div>

{/* Header */}
<div className="mb-8 rounded-3xl border border-gray-200 bg-white/80 p-6 md:p-8 shadow-lg backdrop-blur-xl">
  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <span className="mb-4 inline-flex rounded-full border border-blue-300/40 bg-blue-200/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
        Admin Management
      </span>

      <h1 className="text-3xl md:text-5xl font-black">
        Welcome back,{" "}
        <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          {superAdmin?.userName}
        </span>
      </h1>

      <p className="mt-3 text-gray-600">
        Search and filter admins by host type.
      </p>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white/10 px-6 py-5 backdrop-blur-sm">
      <p className="text-sm text-gray-600">Total Admins</p>
      <h2 className="mt-1 text-3xl font-bold text-gray-900">{filteredAdmins.length}</h2>
    </div>
  </div>
</div>

{/* Search */}
<div className="mb-6 rounded-3xl border border-gray-200 bg-white/50 p-4 backdrop-blur-sm">
  <div className="relative">
    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

    <input
      type="text"
      placeholder="Search admin by name, email or phone..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-2xl border border-gray-200 bg-white/30 py-4 pl-14 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400"
    />
  </div>
</div>

{/* Host Type Filters */}
<div className="mb-8 flex flex-wrap gap-3">
  {[
    {
      key: "all",
      label: "All",
      count: hostTypeCounts.all,
      active: "border-blue-400/40 bg-blue-200/20 text-blue-600",
    },
    {
      key: "hotel",
      label: "Hotel",
      count: hostTypeCounts.hotel,
      active: "border-cyan-400/40 bg-cyan-200/20 text-cyan-600",
    },
    {
      key: "restaurant",
      label: "Restaurant",
      count: hostTypeCounts.restaurant,
      active: "border-purple-400/40 bg-purple-200/20 text-purple-600",
    },
  ].map((filter) => (
    <button
      key={filter.key}
      onClick={() => setHostTypeFilter(filter.key)}
      className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
        hostTypeFilter === filter.key
          ? filter.active
          : "border-gray-200 bg-white/10 text-gray-600 hover:border-gray-300 hover:bg-white/20 hover:text-gray-900"
      }`}
    >
      {filter.label} ({filter.count})
    </button>
  ))}
</div>

{/* Error */}
{error && (
  <div className="mb-6 rounded-2xl border border-red-300 bg-red-100 px-5 py-4 text-red-600">
    {error}
  </div>
)}

{/* Table */}
<div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-xl">
  <div className="overflow-x-auto">
    <table className="min-w-250 w-full">
      <thead className="border-b border-gray-200 bg-white/30">
        <tr>
          {["Admin", "Host Type", "Contact", "Location", "Status", "Action"].map((header) => (
            <th
              key={header}
              className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-gray-500"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {loadingAdmins ? (
          [...Array(5)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <td key={i} className="px-6 py-5">
                  <div className="h-6 w-full rounded bg-gray-200" />
                </td>
              ))}
            </tr>
          ))
        ) : filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin) => (
            <tr
              key={admin._id}
              className="border-b border-gray-200 transition hover:bg-gray-100"
            >
              {/* Admin */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                    {admin.avatar ? (
                      <img
                        src={admin.avatar}
                        alt={admin.userName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-400 to-cyan-300 text-sm font-bold text-white">
                        {admin.userName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-white ${
                        admin.isLoggedIn
                          ? "bg-emerald-400"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{admin.userName}</h3>
                    <p className="mt-1 text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
              </td>

              {/* Host Type */}
              <td className="px-6 py-5">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                    admin.host?.toLowerCase() === "hotel"
                      ? "bg-cyan-200/20 text-cyan-600 border border-cyan-400/40"
                      : "bg-purple-200/20 text-purple-600 border border-purple-400/40"
                  }`}
                >
                  {admin.host || "Unknown"}
                </span>
              </td>

              {/* Contact */}
              <td className="px-6 py-5 text-sm text-gray-600">{admin.contactNumber}</td>

              {/* Location */}
              <td className="px-6 py-5 text-sm text-gray-600">
                {admin.location?.city || "Unknown"}, {admin.location?.state || "Unknown"}
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      admin.isActive ? "bg-emerald-200/20 text-emerald-600" : "bg-red-200/20 text-red-600"
                    }`}
                  >
                    <FaCircle className="text-[8px]" />
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>

                  {admin.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200/20 px-3 py-1 text-xs font-semibold text-yellow-600">
                      <FaCheckCircle className="text-[10px]" />
                      Verified
                    </span>
                  )}
                </div>
              </td>

              {/* Action */}
              <td className="px-6 py-5">
                <Link
                  to={`/superAdmin/admin-products/${admin._id}`}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    selectedAdminId === admin._id
                      ? "bg-linear-to-r from-blue-400 to-cyan-300 text-white"
                      : "border border-gray-200 bg-white/10 text-gray-700 hover:border-blue-400/30 hover:bg-blue-200/20 hover:text-gray-900"
                  }`}
                >
                  View Items
                  <FaArrowRight className="text-xs" />
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-16 text-center">
              <div className="flex flex-col items-center">
                <FaSearch className="mb-4 text-3xl text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">No admins found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try another search or host type filter.
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
</div>
  );
}

export default AdminsDetails;