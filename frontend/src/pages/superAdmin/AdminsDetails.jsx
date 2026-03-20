import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdmin } from "../../features/auth/adminAuthSlice";
import { Link } from "react-router-dom";

function AdminsDetails() {
  const dispatch = useDispatch();
  const { admins } = useSelector((state) => state.adminAuth);
  const { superAdmin } = useSelector((state) => state.superAdmin);
  const { selectedAdminId, loadingAdmins, error } = useSelector(
    (state) => state.hotel
  );
  // console.log(hotels);
  // console.log(admins);

  useEffect(() => {
    dispatch(getAllAdmin()); // fetch all admins
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        {/* Left Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Hi{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {superAdmin?.userName}
            </span>
            , manage your platform from here.
          </p>
          <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full shadow-sm">
              Total Admin: {admins.length}
            </span>
          </div>
        </div>

        {/* Right Icon/Visual */}
        <div className="shrink-0 flex items-center justify-center w-24 h-24 bg-linear-to-tr from-blue-500 to-indigo-500 text-white rounded-full shadow-lg">
          👑
        </div>
      </div>

      {/* Admin List */}
      {loadingAdmins && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md"
            >
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 w-5/6"></div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-center py-10 text-red-500">{error}</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {admins.map((admin) => (
          <div
            key={admin._id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            {/* Avatar */}
            <img
              src={admin.avatar || "/default-avatar.png"}
              alt={admin.userName}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-500"
            />

            {/* Name & Email */}
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {admin.userName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              {admin.email}
            </p>

            {/* Contact */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {admin.contactNumber}
            </p>

            {/* Location */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {admin.location?.city}, {admin.location?.state}
            </p>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {admin.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Active
                </span>
              )}
              {!admin.isActive && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  Inactive
                </span>
              )}
              {admin.isLoggedIn && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Online
                </span>
              )}
              {admin.isVerified && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  Verified
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-xs">
                {admin.status}
              </span>
            </div>

            {/* Host count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Hosted Items: {admin.host}
            </p>

            {/* View Button */}
            <Link
              to={`/superAdmin/admin-products/${admin._id}`}
              // onClick={() => handleAdminClick(admin._id)}
              className={`px-4 py-2 rounded-xl font-semibold w-full transition ${
                selectedAdminId === admin._id
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              View {admin.host ? admin.host : "items"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminsDetails;
