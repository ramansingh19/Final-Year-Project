import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { FiEdit } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import AdmindataUpdateForm from '../../components/AdmindataUpdateForm';
import { FaUserSecret } from "react-icons/fa";

function AdminProfile() {

  const [showForm, setShowForm] = useState(false);

  const {admin, profileUpdate} = useSelector((state) => state.admin)

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
  // console.log(admin);
  return (
<div className="relative mx-auto mt-10 w-[94%] overflow-hidden rounded-[36px] border border-white/70 bg-[#f6f8fc] shadow-[0_25px_80px_rgba(15,23,42,0.08)] md:w-[88%] lg:w-[75%]">
  {/* Background Glow */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl animate-pulse" />
    <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl animate-pulse [animation-delay:1s]" />
    <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-200/30 blur-3xl animate-pulse [animation-delay:2s]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_45%)]" />
  </div>

  <div className="relative z-10 p-5 sm:p-6 lg:p-8">
    {/* Header */}
    <div className="group relative overflow-hidden rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.1)] lg:p-8">
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-orange-100 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Avatar + Basic Info */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-4xl bg-linear-to-r from-orange-400 via-amber-400 to-pink-400 opacity-40 blur-md transition duration-500 group-hover:opacity-70" />

            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border border-white/80 bg-linear-to-br from-orange-500 to-amber-500 text-3xl font-black text-white shadow-[0_20px_40px_rgba(249,115,22,0.25)] transition duration-500 group-hover:scale-[1.03] sm:h-32 sm:w-32 sm:text-4xl">
              {admin?.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.userName || "Admin"}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(admin?.userName)
              )}
            </div>

            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-2xl border-2 border-[#f6f8fc] bg-emerald-500 shadow-lg shadow-emerald-300/40">
              <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
            </div>
          </div>

          {/* Name + Edit + Badges */}
          <div className="text-center sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <h2 className="bg-linear-to-r from-slate-900 via-orange-500 to-amber-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                {admin?.userName || "Admin"}
              </h2>

              <button
                onClick={() => setShowForm(!showForm)}
                className="group/edit flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-500 shadow-sm transition-all duration-300 hover:scale-105 hover:border-orange-200 hover:bg-orange-100 hover:text-orange-600"
              >
                <FiEdit
                  size={18}
                  className="transition-transform duration-300 group-hover/edit:rotate-12"
                />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                {admin?.role || "Admin"}
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                  admin?.isVerified
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border border-red-200 bg-red-50 text-red-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    admin?.isVerified ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {admin?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-125">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_15px_35px_rgba(14,165,233,0.08)]">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <MdOutlineEmail className="text-sky-500" size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Email Address
              </span>
            </div>

            <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              {admin?.email || "No Email Found"}
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_15px_35px_rgba(16,185,129,0.08)]">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <IoCallOutline className="text-emerald-500" size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Contact Number
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 sm:text-base">
              {admin?.contactNumber || "Not Available"}
            </p>
          </div>

          <div className="sm:col-span-2 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_15px_35px_rgba(249,115,22,0.08)]">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <FaUserSecret className="text-orange-500" size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Host Type
              </span>
            </div>

            <p className="text-sm font-semibold capitalize text-slate-900 sm:text-base">
              {admin?.host || "Not Available"}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Cards */}
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="group rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_15px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_45px_rgba(249,115,22,0.08)]">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l6.16-3.422A12.083 12.083 0 0112 20.055a12.083 12.083 0 01-6.16-9.477L12 14z"
              />
            </svg>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Role
            </p>

            <h3 className="text-lg font-black text-slate-900">
              {admin?.role || "Admin"}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-500">
          You currently have access to manage your assigned host data, profile,
          food listings and administrative controls.
        </p>
      </div>

      <div className="group rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_15px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_45px_rgba(16,185,129,0.08)]">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              admin?.isVerified
                ? "bg-emerald-100 text-emerald-500"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
              />
            </svg>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Account Status
            </p>

            <h3
              className={`text-lg font-black ${
                admin?.isVerified ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {admin?.isVerified ? "Verified" : "Not Verified"}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-500">
          {admin?.isVerified
            ? "Your account is verified and active. You can use all available features."
            : "Your account is not verified yet. Please complete verification to access all features."}
        </p>
      </div>
    </div>

    {/* Form Section */}
    <div
      className={`overflow-hidden transition-all duration-700 ease-in-out ${
        showForm ? "mt-6 max-h-300 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="rounded-4xl border border-white/70 bg-white/90 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
            <FiEdit size={18} />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              Update Admin Information
            </h3>

            <p className="text-sm text-slate-500">
              Edit your admin profile details and save the changes securely.
            </p>
          </div>
        </div>

        <AdmindataUpdateForm />
      </div>
    </div>
  </div>
</div>
  )
}

export default AdminProfile