import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptOrderThunk,
  fetchAdminOrders,
  rejectOrderThunk,
  updateStatusThunk,
} from "../../../features/user/foodSlice";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Clock3,
  CircleDollarSign,
  User,
  X,
  CheckCircle2,
  Package,
} from "lucide-react";

function OrdersDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { orders = [], loading } = useSelector((state) => state.food);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch, location.pathname]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      return (
        order._id?.toLowerCase().includes(query) ||
        order.user?.email?.toLowerCase().includes(query) ||
        order.deliveryAddress?.name?.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    revenue: orders
      .filter((o) => ["confirmed", "delivered"].includes(o.status))
      .reduce((a, b) => a + b.totalAmount, 0),
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const statusStyles = {
    pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
    confirmed: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
    preparing: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
    out_for_delivery: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20",
    delivered: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
    failed: "bg-red-500/15 text-red-300 border border-red-500/20",
    cancelled: "bg-red-500/15 text-red-300 border border-red-500/20",
  };

  // Function to handle reject with reason
  const handleRejectOrder = () => {
    if (!cancelReason.trim()) return; // do not allow empty reason
    dispatch(rejectOrderThunk({ orderId: selectedOrder._id, reason: cancelReason }));
    setShowCancelModal(false);
    setCancelReason("");
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 md:px-6 py-6 font-sans">
      {/* HEADER */}
      <div className="mb-8 rounded-3xl border border-gray-200 bg-linear-to-r from-white via-gray-100 to-white p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gray-500">Admin Panel</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">Orders Dashboard</h1>
            <p className="mt-3 max-w-2xl text-gray-600 text-sm md:text-base">
              Manage customer orders, update statuses, assign delivery partners, and monitor real-time activity from one place.
            </p>
          </div>

          <div className="w-full lg:w-85">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-200">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, customer, ID..."
                className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "from-blue-100 to-blue-50" },
          { label: "Pending", value: stats.pending, icon: Clock3, color: "from-yellow-100 to-yellow-50" },
          { label: "Revenue", value: `₹${stats.revenue}`, icon: CircleDollarSign, color: "from-green-100 to-green-50" },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle2, color: "from-purple-100 to-purple-50" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-3xl border border-gray-200 bg-linear-to-br ${card.color} p-5 backdrop-blur-sm shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <h2 className="mt-3 text-3xl font-bold text-gray-900">{card.value}</h2>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/50 p-3">
                  <Icon className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Showing {filteredOrders.length} orders</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition-all duration-300"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-gray-900">#{order._id.slice(-6)}</p>
                      <p className="mt-1 text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.deliveryAddress?.name}</p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-lg font-bold text-green-600">₹{order.totalAmount}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-xl border border-blue-300 bg-blue-100/30 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition"
                    >
                      View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDEBAR MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-white/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="h-full w-full max-w-xl overflow-y-auto border-l border-gray-200 bg-gray-50 p-6 shadow-2xl">
            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Details</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">#{selectedOrder._id.slice(-6)}</h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-2xl border border-gray-300 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CUSTOMER */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="mt-1 font-semibold text-gray-900">{selectedOrder.user?.email}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedOrder.status]}`}
                >
                  {selectedOrder.status.replaceAll("_", " ")}
                </span>
              </div>
            </div>

            {/* ORDERED ITEMS */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-2 text-gray-900 font-semibold">
                <Package className="h-5 w-5 text-blue-400" />
                Ordered Items
              </div>

              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.food.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.food.quantity}</p>
                    </div>
                    <p className="font-bold text-green-600">₹{item.food.price * item.food.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-600">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
              <p className="mb-2 font-semibold text-gray-900">Delivery Address</p>
              <p className="text-gray-700">{selectedOrder.deliveryAddress?.name}</p>
              <p className="mt-2 text-sm text-gray-500 leading-6">
                {selectedOrder.deliveryAddress?.street},{selectedOrder.deliveryAddress?.city},{" "}
                {selectedOrder.deliveryAddress?.pincode}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3">
              {selectedOrder.status === "pending" && (
                <>
                  <button
                    onClick={() => dispatch(acceptOrderThunk(selectedOrder._id))}
                    className="rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
                  >
                    Accept Order
                  </button>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
                  >
                    Reject Order
                  </button>
                </>
              )}

              {selectedOrder.status === "confirmed" && (
                <button
                  onClick={() =>
                    dispatch(updateStatusThunk({ orderId: selectedOrder._id, status: "preparing" }))
                  }
                  className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                  Start Preparing
                </button>
              )}

              {selectedOrder.status === "preparing" && (
                <Link
                  to={`/admin/AdminAssignDeliveryBoy/${selectedOrder._id}`}
                  className="rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500"
                >
                  Assign Delivery Boy
                </Link>
              )}

              <Link
                to={`/admin/AdminOrderDetails/${selectedOrder._id}`}
                className="rounded-2xl border border-gray-300 bg-white/50 px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Full Details
              </Link>
            </div>

            {/* CANCEL MODAL */}
            {showCancelModal && (
              <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Reject Order</h3>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full resize-none rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:ring-2 focus:ring-red-400"
                  ></textarea>
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => setShowCancelModal(false)}
                      className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectOrder}
                      className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersDashboard;