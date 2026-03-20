import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import SuperAdminDataUpdateForm from '../../components/SuperAdminDataUpdateForm';

function SuperAdminProfile() {
  const { superAdmin, profileUpdate } = useSelector((state) => state.superAdmin);
  const [showForm, setShowForm] = useState(false);

  const getInitials = (name) => {
    if (!name) return "SA";
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  useEffect(()=> {
   if(profileUpdate){
    setShowForm(false)
   }
  }, [profileUpdate])

return (
  <div className="w-[90%] md:w-[75%] lg:w-[65%] mx-auto mt-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 transition-all">

    {/* Profile Header */}
    <div className="flex flex-col md:flex-row md:items-center gap-6">

      {/* Avatar */}
      <div className="relative w-24 h-24 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg">
        {superAdmin?.avatar ? (
          <img
            src={superAdmin.avatar}
            alt={superAdmin.userName || "Super Admin"}
            className="w-full h-full object-cover"
          />
        ) : (
          getInitials(superAdmin?.userName)
        )}
      </div>

      {/* SuperAdmin Info */}
      <div className="flex-1 space-y-2">

        {/* Name + Edit */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            {superAdmin?.userName || "Super Admin"}
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="p-1 rounded-md text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
          >
            <FiEdit size={20} />
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-gray-600 dark:text-gray-300 text-sm md:text-base">
          <p className="flex items-center gap-2">
            <MdOutlineEmail className="text-blue-500" />
            {superAdmin?.email}
          </p>
          <p className="flex items-center gap-2">
            <IoCallOutline className="text-green-500" />
            {superAdmin?.contactNumber || "N/A"}
          </p>
        </div>

      </div>
    </div>

    {/* Divider */}
    <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

    {/* Extra Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition">
        <span className="font-medium">Role</span>
        <p className="mt-1">{superAdmin?.role || "Super Admin"}</p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition">
        <span className="font-medium">Account Status</span>
        <p className={`mt-1 font-semibold ${superAdmin?.isVerified ? "text-green-500" : "text-red-500"}`}>
          {superAdmin?.isVerified ? "Verified" : "Not Verified"}
        </p>
      </div>
    </div>

    {/* Update Form */}
    {showForm && (
      <div className="mt-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-inner transition-all">
        <SuperAdminDataUpdateForm />
      </div>
    )}

  </div>
);
}

export default SuperAdminProfile