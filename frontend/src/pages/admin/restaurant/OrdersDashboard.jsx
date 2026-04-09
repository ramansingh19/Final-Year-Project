import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ClipboardList,
  IndianRupee,
  Clock3,
  Users,
  Plus,
  Package,
  UserRound,
} from "lucide-react";
import { fetchAdminOrders } from "../../../features/user/foodSlice";

function OrdersDashboard() {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.food);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const revenue = orders
    .filter(
      (order) =>
        order.status === "confirmed" || order.status === "delivered"
    )
    .reduce((acc, order) => acc + order.totalAmount, 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const uniqueUsers = [...new Set(orders.map((o) => o.user?._id))].length;

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ClipboardList,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Revenue",
      value: `₹${revenue}`,
      icon: IndianRupee,
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock3,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Users",
      value: uniqueUsers,
      icon: Users,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
<div className="min-h-screen bg-[#fdf8f3] relative overflow-hidden px-4 py-6 md:px-8 lg:px-10">
  {/* Soft Ecommerce Background */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl animate-pulse" />
    <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-rose-100/60 blur-3xl" />
    <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
  </div>

  <div className="relative z-10 space-y-8">
    {/* Header */}
    <div className="rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
            <Package className="h-4 w-4" />
            Food Admin Dashboard
          </div>

          <h1 className="mt-5 text-3xl md:text-5xl font-black leading-tight tracking-tight text-slate-900">
            Monitor orders,
            <span className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              {" "}
              revenue
            </span>
            <br className="hidden md:block" />
            and customer activity
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] md:text-base leading-7 text-slate-500 font-medium">
            Get a complete overview of your platform with real-time order
            tracking, revenue insights, and quick access to food and user
            management.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/admin/create-food"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-6 py-4 font-semibold text-white shadow-[0_12px_30px_rgba(251,146,60,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            Add Food
          </Link>

          <Link
            to="/admin/manage-orders"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:text-amber-600"
          >
            View Orders
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group rounded-[1.8rem] border border-white/80 bg-white/80 p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full w-2/3 rounded-full bg-linear-to-r ${item.color}`}
              />
            </div>
          </div>
        );
      })}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr] gap-6">
      {/* Recent Orders */}
      <div className="rounded-4xl border border-white/70 bg-white/80 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest customer orders on your platform
            </p>
          </div>

          <div className="rounded-2xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            {orders.length} Total
          </div>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="group flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border border-slate-100 bg-[#fffdfa] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {order.deliveryAddress?.name || "Customer"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Order #{order._id.slice(-6)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Amount
                  </p>
                  <p className="font-bold text-emerald-600">
                    ₹{order.totalAmount}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${
                    order.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : order.status === "confirmed"
                      ? "bg-sky-100 text-sky-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="rounded-4xl border border-white/70 bg-white/80 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <h2 className="mb-5 text-2xl font-black text-slate-900">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <Link
              to="/admin/manage-orders"
              className="group flex items-center justify-between rounded-3xl border border-slate-100 bg-[#fffdfa] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
            >
              <div>
                <p className="font-bold text-slate-900">Manage Orders</p>
                <p className="mt-1 text-sm text-slate-500">
                  Update and track customer orders
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>

            <Link
              to="/admin/create-food"
              className="group flex items-center justify-between rounded-3xl border border-slate-100 bg-[#fffdfa] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
            >
              <div>
                <p className="font-bold text-slate-900">Add Food Item</p>
                <p className="mt-1 text-sm text-slate-500">
                  Create a new dish for your menu
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 text-orange-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>

            <Link
              to="/admin/ViewUsers"
              className="group flex items-center justify-between rounded-3xl border border-slate-100 bg-[#fffdfa] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-md"
            >
              <div>
                <p className="font-bold text-slate-900">View Users</p>
                <p className="mt-1 text-sm text-slate-500">
                  See all registered platform users
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 text-rose-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

        {/* Live Status */}
        <div className="rounded-4xl border border-white/70 bg-linear-to-br from-amber-50 via-white to-rose-50 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            Live Status
          </p>

          <h3 className="mt-3 text-2xl font-black text-slate-900">
            {loading ? "Loading dashboard..." : "Everything looks good"}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your platform is active and all recent orders are being updated in
            real-time.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-600">
              System Running Smoothly
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default OrdersDashboard;