import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Bike, Clock } from "lucide-react";
import { getDeliveryBoyProfileThunk } from "../../../features/user/deliveryBoySlice";


export default function DeliveryBoyDashboard() {
  const dispatch = useDispatch();

  const { profile = [], loading, error } = useSelector(
    (state) => state.deliveryBoy
  );

  console.log(profile);

  useEffect(() => {
    dispatch(getDeliveryBoyProfileThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
          <p className="mt-2 text-blue-100">
            Welcome back, your current delivery status is shown below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Bike className="text-blue-600" />
              <h2 className="text-lg font-bold">Availability</h2>
            </div>

            <p
              className={`inline-flex px-4 py-2 rounded-2xl text-sm font-semibold ${
                profile?.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {profile?.isAvailable ? "Available" : "Busy"}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-indigo-600" />
              <h2 className="text-lg font-bold">Current Address</h2>
            </div>

            <p className="text-slate-700 leading-7">
              {profile?.fullAddress || "Location not updated yet"}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-amber-600" />
              <h2 className="text-lg font-bold">Current Order</h2>
            </div>

            {profile?.currentOrder ? (
              <div>
                <p className="font-semibold text-slate-900">
                  Order Status: {profile.currentOrder.status}
                </p>
                <p className="mt-2 text-slate-600">
                  Customer: {profile.currentOrder.user?.name}
                </p>
                <p className="text-slate-600">
                  Restaurant: {profile.currentOrder.restaurant?.name}
                </p>
              </div>
            ) : (
              <p className="text-slate-500">No order assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}