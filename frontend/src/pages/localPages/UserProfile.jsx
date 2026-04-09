import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserdataUpdateForm from "../../components/UserdataUpdateForm";
import { FiEdit } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

function UserProfile() {
  const { user } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);

  // fallback initials function
  const getInitials = (name = "User") => {
    if (typeof name !== "string") return "U";
    return name
      .trim()
      .split(" ")
      .filter((n) => n)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>

        {/* Loading text */}
        <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
          Loading user data...
        </p>
      </div>
    );
  }

  return (
<div className="relative mx-auto mt-10 w-[94%] overflow-hidden rounded-4xl border border-amber-100  md:w-[88%] lg:w-[75%]">
  {/* Ecommerce Light Background */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="" />
    <div className="" />
    <div className="" />
    <div className="" />
    <div className="" />
  </div>

  <div className="relative z-10 p-4 sm:p-6 lg:p-8">
    {/* Header */}
    <div className="group relative overflow-hidden rounded-[28px] border border-amber-100 transition-all duration-500 hover:-translate-y-1 hover:border-amber-100  sm:p-6 lg:p-8">
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="" />
        <div className="" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Avatar + Main Info */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-[30px] opacity-60 blur-sm transition duration-500 group-hover:scale-105 group-hover:opacity-100" />

            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-white  text-3xl font-black text-white  transition duration-500 group-hover:scale-[1.03] sm:h-32 sm:w-32 sm:text-4xl">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.userName || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user?.userName)
              )}
            </div>

            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-2xl border-2 border-[#fffaf4] bg-emerald-500 shadow-lg shadow-emerald-200 transition duration-300 group-hover:scale-110">
              <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
            </div>
          </div>

          {/* User Name + Buttons */}
          <div className="text-center sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <h2 className="bg-linear-to-r from-amber-900 via-orange-400 to-yellow-700 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                {user?.userName || "User"}
              </h2>

              <button
                onClick={() => setShowForm(!showForm)}
                className="group/edit flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-white text-amber-600 shadow-sm transition-all duration-300 hover:scale-105 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
              >
                <FiEdit
                  size={18}
                  className="transition-transform duration-300 group-hover/edit:rotate-12"
                />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700 transition duration-300 hover:scale-105">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {user?.role || "User"}
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition duration-300 hover:scale-105 ${
                  user?.isVerified
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border border-red-200 bg-red-50 text-red-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    user?.isVerified ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
                {user?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-130">
          <div className="rounded-2xl border border-amber-100 bg-white/90 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-50">
            <div className="mb-2 flex items-center gap-2 text-amber-500">
              <MdOutlineEmail className="text-amber-500" size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Email Address
              </span>
            </div>

            <p className="truncate text-sm font-semibold text-amber-950 sm:text-base">
              {user?.email || "No Email Found"}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white/90 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50/50">
            <div className="mb-2 flex items-center gap-2 text-emerald-500">
              <IoCallOutline className="text-emerald-500" size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Contact Number
              </span>
            </div>

            <p className="text-sm font-semibold text-amber-950 sm:text-base">
              {user?.contactNumber || "Not Available"}
            </p>
          </div>

          <div className="sm:col-span-2 rounded-2xl border border-amber-100 bg-white/90 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-50/50">
            <div className="mb-2 flex items-center gap-2 text-orange-500">
              <IoLocationOutline className="text-orange-500" size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Location
              </span>
            </div>

            <p className="text-sm font-semibold text-amber-950 sm:text-base">
              {user?.location?.city
                ? `${user.location.city}, ${user.location.state}`
                : "Location not added"}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Info Cards */}
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="group rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-[0_15px_40px_rgba(251,191,36,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)]">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition duration-300 group-hover:scale-110">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              ...
            </svg>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
              User Role
            </p>
            <h3 className="text-lg font-bold text-amber-950">
              {user?.role || "User"}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-6 font-medium text-amber-700">
          Your account allows you to manage your profile, save favorite places,
          browse food listings and access personalized features.
        </p>
      </div>

      <div className="group rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-[0_15px_40px_rgba(251,191,36,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)]">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${
              user?.isVerified
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-500"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              ...
            </svg>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
              Account Status
            </p>
            <h3
              className={`text-lg font-bold ${
                user?.isVerified ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {user?.isVerified ? "Verified" : "Not Verified"}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-6 font-medium text-amber-700">
          {user?.isVerified
            ? "Your account is verified and ready to use all features securely."
            : "Please verify your account to unlock all features and improve trust."}
        </p>
      </div>
    </div>

    {/* Update Form */}
    <div
      className={`overflow-hidden transition-all duration-700 ease-in-out ${
        showForm ? "mt-6 max-h-250 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="rounded-[28px] border border-amber-100 bg-[#fffdf8]/95 p-4 shadow-[0_20px_60px_rgba(251,191,36,0.10)] backdrop-blur-xl transition-all duration-500 sm:p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-amber-100 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <FiEdit size={18} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-amber-950">
              Update User Information
            </h3>
            <p className="text-sm font-medium text-amber-700">
              Edit your profile details and save your changes securely.
            </p>
          </div>
        </div>

        <UserdataUpdateForm />
      </div>
    </div>
  </div>
</div>
  );
}

export default UserProfile;
