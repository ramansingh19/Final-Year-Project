import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../features/user/foodOrderSlice";
import { clearCart, selectCartTotal } from "../../features/user/cartSlice";
import { useNavigate } from "react-router-dom";
import { MapPinIcon } from "@heroicons/react/24/outline";

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);
  const { loading } = useSelector((state) => state.foodOrder);

  const [geoLoading, setGeoLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    pincode: "",
    location: null,
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // 📍 AUTO LOCATION (FIXED)
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported ❌");
      return;
    }

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          setAddress((prev) => ({
            ...prev,
            street: data.address?.road || data.display_name || "",
            city:
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "",
            pincode: data.address?.postcode || "",
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
          }));
        } catch (err) {
          alert("Failed to fetch address ❌");
        }

        setGeoLoading(false);
      },
      () => {
        alert("Location permission denied ❌");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 🚀 PLACE ORDER
  const handleOrder = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Login required 🔐");
      navigate("/login");
      return;
    }

    // ✅ VALIDATION
    if (!address.name || !address.street || !address.city) {
      alert("Please fill address properly ❌");
      return;
    }

    if (!address.location) {
      alert("Please detect location 📍");
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        restaurant: item.restaurantId,
        food: {
          id: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image,
        },
      })),
      totalAmount: total,
      paymentMethod,
      deliveryAddress: address,
    };

    const res = await dispatch(createOrder(orderData));

    if (createOrder.fulfilled.match(res)) {
      alert("Order placed successfully ✅");
      dispatch(clearCart());
      navigate("/My-Food-orders");
    } else {
      alert("Order failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fffdfb] via-[#faf5ef] to-[#f5ebe0] p-4 text-[#2d1f16]">
      <div className="ui-container max-w-4xl space-y-8 py-8">

        {/* 🧾 HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-[#2d1f16]">
            Complete Checkout
          </h1>
          <p className="mt-3 text-sm font-medium text-[#6f5a4b]">
            Finalize your order and enjoy premium delivery
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COL: ADDRESS & PAYMENT */}
          <div className="lg:col-span-7 space-y-6">
            {/* 📍 ADDRESS */}
            <div className="ui-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-[#2d1f16] flex items-center gap-2">
                  <span className="h-6 w-1 bg-[#c67c4e] rounded-full" />
                  Delivery Address
                </h2>

                <button
                  onClick={handleDetectLocation}
                  className="ui-btn-secondary px-4! py-2! text-[10px]! uppercase! tracking-widest! rounded-xl!"
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {geoLoading ? "Detecting..." : "Detect Location"}
                </button>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="text-[10px] font-black uppercase text-[#a07d63] ml-1 mb-1 block">Receiver Name</label>
                  <input
                    placeholder="e.g. John Doe"
                    className="ui-input"
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black uppercase text-[#a07d63] ml-1 mb-1 block">Street / Area</label>
                  <input
                    placeholder="e.g. 123 Luxury Lane"
                    value={address.street}
                    className="ui-input"
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-[#a07d63] ml-1 mb-1 block">City</label>
                    <input
                      placeholder="City"
                      value={address.city}
                      className="ui-input"
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-[#a07d63] ml-1 mb-1 block">Pincode</label>
                    <input
                      placeholder="Pincode"
                      value={address.pincode}
                      className="ui-input"
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 💳 PAYMENT */}
            <div className="ui-card p-8">
              <h2 className="text-lg font-black text-[#2d1f16] mb-6 flex items-center gap-2">
                <span className="h-6 w-1 bg-[#c67c4e] rounded-full" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-2xl border border-[#eadccf] transition-all hover:bg-white hover:border-[#c67c4e]">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#c67c4e]"
                  />
                  <div className="flex-1">
                    <p className="font-black text-[#2d1f16]">Cash on Delivery</p>
                    <p className="text-xs text-[#a07d63]">Pay when your food arrives</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-2xl border border-[#eadccf] transition-all hover:bg-white hover:border-[#c67c4e]">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-[#c67c4e]"
                  />
                  <div className="flex-1">
                    <p className="font-black text-[#2d1f16]">Online Payment</p>
                    <p className="text-xs text-[#a07d63]">Credit/Debit card or UPI</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COL: SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            <div className="ui-card p-8 sticky top-24">
              <h2 className="text-lg font-black text-[#2d1f16] mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-75 overflow-y-auto pr-2 scrollbar-thin">
                {items.map((item) => (
                  <div
                    key={item.cartLineId}
                    className="flex justify-between items-center border-b border-[#eadccf]/50 pb-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover border border-[#eadccf]" />
                      <div>
                        <p className="font-bold text-[#2d1f16] text-sm">{item.name}</p>
                        <p className="text-[#a07d63] text-[10px] font-black uppercase">
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-[#c67c4e] text-sm">
                      ₹{item.qty * item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t-2 border-dashed border-[#eadccf]">
                <div className="flex justify-between text-sm font-bold text-[#6f5a4b]">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#6f5a4b]">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between mt-6 font-black text-2xl text-[#2d1f16]">
                  <span>Grand Total</span>
                  <span className="text-[#c67c4e]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className="ui-btn-primary w-full mt-8 rounded-2xl! py-4! shadow-xl"
              >
                {loading ? "Processing..." : "Confirm & Place Order"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;