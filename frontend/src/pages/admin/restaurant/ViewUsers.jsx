import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders } from "../../../features/user/foodSlice";
import { Search, Users, ShoppingBag, Mail, User2 } from "lucide-react";

function ViewUsers() {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.food);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const uniqueUsers = useMemo(() => {
    const usersMap = {};

    orders.forEach((order) => {
      const userId = order.user?._id;

      if (!userId) return;

      if (!usersMap[userId]) {
        usersMap[userId] = {
          id: userId,
          name: order.user?.name || "No Name",
          email: order.user?.email,
          ordersCount: 1,
          totalSpent: order.totalAmount || 0,
        };
      } else {
        usersMap[userId].ordersCount += 1;
        usersMap[userId].totalSpent += order.totalAmount || 0;
      }
    });

    return Object.values(usersMap).filter((user) => {
      const q = search.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  return (
<div className="min-h-screen bg-gray-50 px-4 md:px-6 py-6 font-sans text-gray-900 transition-all duration-300">
      {/* HEADER */}
      <div className="mb-8 rounded-3xl border border-gray-200 bg-linear-to-r from-white via-gray-100 to-white p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="mb-2 text-sm uppercase tracking-wider text-gray-500 font-medium">
              Admin Panel
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 animate-fadeIn">
              Users Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600 text-sm md:text-base">
              View all customers, monitor their activity, and track how many
              orders each user has placed.
            </p>
          </div>

          <div className="w-full lg:w-85">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white/20 px-4 py-3 backdrop-blur-xl transition focus-within:border-blue-500/40 focus-within:bg-white/30">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="rounded-3xl border border-gray-200 bg-linear-to-br from-blue-200/20 to-cyan-100/30 p-6 shadow-lg backdrop-blur-xl hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {uniqueUsers.length}
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-300 bg-white/20 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-linear-to-br from-purple-200/20 to-indigo-100/30 p-6 shadow-lg backdrop-blur-xl hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {orders.length}
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-300 bg-white/20 p-3">
              <ShoppingBag className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-linear-to-br from-green-200/20 to-emerald-100/30 p-6 shadow-lg backdrop-blur-xl hover:scale-105 transform transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Customers</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {uniqueUsers.filter((u) => u.ordersCount > 1).length}
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-300 bg-white/20 p-3">
              <User2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Customer List</h2>
            <p className="mt-1 text-sm text-gray-500">
              {uniqueUsers.length} users found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-lg animate-pulse">
            Loading users...
          </div>
        ) : uniqueUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Users className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-100 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4 text-right">Spent</th>
                </tr>
              </thead>

              <tbody>
                {uniqueUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 transition-all duration-300 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500 border border-blue-200">
                          <User2 className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex rounded-full border border-blue-200 bg-blue-100/50 px-4 py-1 text-sm font-semibold text-blue-500">
                        {user.ordersCount} Orders
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right text-lg font-bold text-green-500">
                      ₹{user.totalSpent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewUsers;