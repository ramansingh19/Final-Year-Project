import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrderDetails } from "../../../features/user/foodSlice";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CreditCard,
  MapPin,
  Package,
  Calendar,
} from "lucide-react";

function AdminOrderDetails() {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const { orderDetails, loading, error } = useSelector(
    (state) => state.food
  );

  useEffect(() => {
    dispatch(fetchAdminOrderDetails(orderId));
  }, [dispatch, orderId]);

  const statusColor = {
    pending:
      "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
    confirmed:
      "bg-blue-500/15 text-blue-300 border border-blue-500/20",
    preparing:
      "bg-purple-500/15 text-purple-300 border border-purple-500/20",
    out_for_delivery:
      "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20",
    delivered:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
    failed: "bg-red-500/15 text-red-300 border border-red-500/20",
    cancelled:
      "bg-red-500/15 text-red-300 border border-red-500/20",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400 text-lg">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400 text-lg">
        {error}
      </div>
    );
  }

  if (!orderDetails) return null;

  return (
<div className="min-h-screen bg-gray-50 px-4 md:px-6 py-6 font-sans text-gray-900 transition-all duration-300">
      {/* HEADER */}
      <div className="mb-8 rounded-3xl border border-gray-200 bg-linear-to-r from-white via-gray-100 to-white p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <Link
              to="/admin/orders"
              className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white/20 px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>

            <p className="mb-2 text-sm uppercase tracking-wider text-gray-500 font-medium">
              Order Details
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 animate-fadeIn">
              #{orderDetails.orderId.slice(-6)}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(orderDetails.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <span
              className={`inline-flex rounded-full px-5 py-3 text-sm font-semibold capitalize ${statusColor[orderDetails.status]} animate-pulse`}
            >
              {orderDetails.status.replaceAll("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer Info */}
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-xl hover:scale-105 transform transition-all duration-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Customer Info</h2>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold">{orderDetails.user?.name}</p>
            <p className="text-gray-600">{orderDetails.user?.email}</p>
            <p className="text-gray-500">{orderDetails.user?.phone}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-xl hover:scale-105 transform transition-all duration-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-3 text-green-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Payment Info</h2>
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Method</span>
              <span className="font-medium uppercase">
                {orderDetails.paymentMethod}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Items</span>
              <span>{orderDetails.items.length}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-500">Total</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{orderDetails.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-xl hover:scale-105 transform transition-all duration-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
          </div>

          <div className="space-y-2 text-gray-700 leading-7">
            <p className="font-semibold text-gray-900">
              {orderDetails.deliveryAddress?.name}
            </p>
            <p>{orderDetails.deliveryAddress?.street}</p>
            <p>
              {orderDetails.deliveryAddress?.city} - {orderDetails.deliveryAddress?.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/80 shadow-lg backdrop-blur-xl mb-8">
        <div className="border-b border-gray-200 px-6 py-5 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ordered Items</h2>
            <p className="text-sm text-gray-500 mt-1">
              {orderDetails.items.length} items in this order
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Total</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails.items.map((item) => (
                <tr
                  key={item.foodId}
                  className="border-b border-gray-200 transition hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-2xl object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Food ID: {item.foodId?.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">{item.restaurant?.name}</td>
                  <td className="px-6 py-5 text-gray-700">₹{item.price}</td>
                  <td className="px-6 py-5 font-medium">{item.quantity}</td>
                  <td className="px-6 py-5 text-lg font-bold text-green-600">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CANCEL CARD */}
      {orderDetails.cancelReason && (
        <div className="rounded-3xl border border-red-500/30 bg-red-50 p-6 shadow-lg animate-fadeIn">
          <h3 className="mb-2 text-lg font-bold text-red-600">Order Cancelled</h3>
          <p className="text-red-500">{orderDetails.cancelReason}</p>
        </div>
      )}
    </div>
  );
}

export default AdminOrderDetails;