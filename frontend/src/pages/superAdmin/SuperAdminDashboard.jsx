import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllAdmin } from "../../features/auth/adminAuthSlice";
import {
  FaUsers,
  FaServer,
  FaUserCheck,
  FaArrowRight,
  FaBell,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const { superAdmin } = useSelector((state) => state.superAdmin);
  const { admins } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    dispatch(getAllAdmin());
  }, [dispatch]);

  const getInitials = (name) => {
    if (!name) return "SA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: "0",
      icon: <FaUsers className="text-xl text-cyan-300" />,
      iconBg: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/20",
      glow: "group-hover:shadow-cyan-500/20",
    },
    {
      title: "Total Admins",
      value: admins?.length || 0,
      icon: <FaUserCheck className="text-xl text-violet-300" />,
      iconBg: "from-violet-500/20 to-fuchsia-500/20",
      border: "border-violet-500/20",
      glow: "group-hover:shadow-violet-500/20",
      link: "/superAdmin/admin-details",
    },
    {
      title: "Active Sessions",
      value: "0",
      icon: <FaChartLine className="text-xl text-amber-300" />,
      iconBg: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/20",
      glow: "group-hover:shadow-amber-500/20",
    },
    {
      title: "System Status",
      value: "Running",
      icon: <FaServer className="text-xl text-emerald-300" />,
      iconBg: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/20",
      glow: "group-hover:shadow-emerald-500/20",
      status: true,
    },
  ];

  return (
<div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-8 lg:px-10 py-5 sm:py-6 text-gray-900 relative overflow-hidden">

{/* Background Glow */}
<div className="pointer-events-none fixed inset-0 overflow-hidden">
  <div className="absolute -top-32 left-0 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-blue-200/30 blur-3xl animate-pulse" />
  <div className="absolute top-1/3 right-0 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-purple-200/30 blur-3xl animate-pulse" />
  <div className="absolute bottom-0 left-1/3 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-cyan-200/30 blur-3xl animate-pulse" />
</div>

<div className="relative z-10 mx-auto max-w-7xl">

  {/* HEADER */}
  <div className="mb-6 sm:mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-xl">
    <div className="relative p-4 sm:p-6 md:p-8">

      {/* Decorative */}
      <div className="absolute -right-16 -top-16 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-blue-200/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-10 sm:right-20 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />

      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        {/* LEFT */}
        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-center">

          {/* Avatar */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-300 to-purple-300 blur-lg opacity-30 animate-pulse" />
            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-linear-to-br from-blue-400 to-purple-400 text-xl sm:text-2xl font-bold text-white shadow-md">
              {superAdmin?.avatar ? (
                <img
                  src={superAdmin.avatar}
                  alt={superAdmin.userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(superAdmin?.userName)
              )}
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-200/20 px-3 py-1 text-[10px] sm:text-xs font-medium text-cyan-700">
              <FaBell className="text-[10px]" />
              Super Admin Panel
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              {greeting},{" "}
              <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                {superAdmin?.userName || "Super Admin"}
              </span>
            </h1>

            <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm md:text-base leading-6 text-gray-600">
              Monitor platform activity, manage admins, and keep your
              system running smoothly from one place.
            </p>

            {/* Info */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-xl sm:rounded-2xl border border-gray-200 bg-white/10 px-3 py-1.5 text-xs sm:text-sm text-gray-700">
                <FaClock className="text-cyan-400" />
                Last login: Today
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-emerald-300/40 bg-emerald-300/20 px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald-700">
                System Online
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3 sm:gap-4 items-center xl:items-end text-center xl:text-right">

          <Link
            to="/superAdmin/admin-registration"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-lg">+</span>
            Register New Admin
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <p className="text-[10px] sm:text-xs text-gray-500 max-w-xs">
            Add and manage new administrators with full platform access.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* STATS */}
  <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map((card, index) => {
      const CardWrapper = card.link ? Link : "div";

      return (
        <CardWrapper
          key={index}
          to={card.link}
          className={`group relative overflow-hidden rounded-3xl border ${card.border} bg-white/90 p-4 sm:p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-gray-300 hover:shadow-lg ${card.glow}`}
        >
          <div
            className={`absolute -right-6 -top-6 sm:-right-8 sm:-top-8 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-linear-to-br ${card.iconBg} blur-2xl transition-transform duration-500 group-hover:scale-125 animate-pulse`}
          />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <div className="mt-3 sm:mt-4 flex items-end gap-2">
                <h3 className={`text-2xl sm:text-3xl font-bold ${card.status ? "text-emerald-500" : "text-gray-900"}`}>
                  {card.value}
                </h3>

                {!card.status && (
                  <span className="mb-1 text-[10px] sm:text-xs text-emerald-500">
                    +0%
                  </span>
                )}
              </div>

              <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs leading-5 sm:leading-6 text-gray-500">
                {card.description}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-gray-200 bg-linear-to-br ${card.iconBg} backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
            >
              {card.icon}
            </div>
          </div>

          {card.link && (
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm font-medium text-purple-500 group-hover:text-purple-400">
              View Details
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          )}
        </CardWrapper>
      );
    })}
  </div>

</div>
</div>
  );
}

export default SuperAdminDashboard;