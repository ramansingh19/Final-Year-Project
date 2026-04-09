import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrder, getOrderById } from "../../features/user/foodOrderSlice";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Custom SVG Marker Icons ────────────────────────────────────────────────

const userMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:48px;height:48px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:radial-gradient(circle at 35% 35%, #2d1f16, #1a1512);
        box-shadow:0 0 0 4px rgba(45,31,22,0.1), 0 4px 16px rgba(45,31,22,0.3);
        display:flex;align-items:center;justify-content:center;
      ">
        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='white'>
          <path d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z'/>
        </svg>
      </div>
      <div style="
        position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
        width:10px;height:10px;background:#2d1f16;
        clip-path:polygon(50% 100%, 0 0, 100% 0);
      "></div>
    </div>
  `,
  iconSize: [48, 54],
  iconAnchor: [24, 54],
  popupAnchor: [0, -54],
});

const deliveryMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:52px;height:52px;animation:pulse-marker 2s ease-in-out infinite;">
      <style>
        @keyframes pulse-marker {
          0%,100%{transform:scale(1);}
          50%{transform:scale(1.08);}
        }
        @keyframes ring-pulse {
          0%{transform:scale(1);opacity:0.7;}
          100%{transform:scale(2.2);opacity:0;}
        }
      </style>
      <div style="
        position:absolute;inset:4px;border-radius:50%;
        background:radial-gradient(circle at 35% 35%, #c67c4e, #9f5b31);
        box-shadow:0 0 0 3px rgba(198,124,78,0.2), 0 4px 20px rgba(198,124,78,0.4);
        display:flex;align-items:center;justify-content:center;z-index:2;
      ">
        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='white'>
          <path d='M17.5 8C15.6 8 14 9.6 14 11.5c0 2.5 3.5 6.5 3.5 6.5s3.5-4 3.5-6.5C21 9.6 19.4 8 17.5 8zm0 4.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM5 6h9v2H5zm-2 4h2v7H3zm3 0h6v2H6zm0 3h6v2H6z'/>
        </svg>
      </div>
      <div style="
        position:absolute;inset:0;border-radius:50%;
        border:2px solid rgba(198,124,78,0.4);
        animation:ring-pulse 1.8s ease-out infinite;
      "></div>
    </div>
  `,
  iconSize: [52, 52],
  iconAnchor: [26, 52],
  popupAnchor: [0, -52],
});

// ─── Map Helpers ─────────────────────────────────────────────────────────────

function FitBounds({ userLocation, deliveryLocation }) {
  const map = useMap();
  useEffect(() => {
    if (!userLocation || !deliveryLocation?.lat || !deliveryLocation?.lng) return;
    const bounds = L.latLngBounds([
      [userLocation.lat, userLocation.lng],
      [deliveryLocation.lat, deliveryLocation.lng],
    ]);
    map.fitBounds(bounds, { padding: [100, 100] });
  }, [map, userLocation, deliveryLocation]);
  return null;
}

function SmoothMarker({ position, icon, children }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!markerRef.current || !position) return;
    markerRef.current.setLatLng(position);
  }, [position]);

  return (
    <Marker ref={markerRef} position={position} icon={icon}>
      {children}
    </Marker>
  );
}

// ─── Distance & Time Calculation ─────────────────────────────────────────────

function haversineDistance(loc1, loc2) {
  if (!loc1 || !loc2) return null;
  const R = 6371;
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateTime(distanceKm) {
  if (!distanceKm) return null;
  const avgSpeedKmh = 25;
  const minutes = Math.ceil((distanceKm / avgSpeedKmh) * 60);
  return minutes;
}

// ─── Main Component ───────────────────────────────────────────────────────────

function OrderDetailsPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { currentOrder, loading } = useSelector((state) => state.foodOrder);

  useEffect(() => {
    if (!orderId) return;
    dispatch(getOrderById(orderId));
    const interval = setInterval(() => {
      dispatch(getOrderById(orderId));
      setLastUpdated(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch, orderId]);

  const deliveryLocation = useMemo(() => {
    const coordinates = currentOrder?.deliveryBoy?.location?.coordinates;
    if (!coordinates || coordinates.length < 2) return { lat: null, lng: null };
    return { lng: coordinates[0], lat: coordinates[1] };
  }, [currentOrder]);

  // Track route history
  useEffect(() => {
    if (!deliveryLocation.lat || !deliveryLocation.lng) return;
    setRoutePoints((prev) => {
      const newPoint = [deliveryLocation.lat, deliveryLocation.lng];
      if (prev.length === 0) return [newPoint];
      const last = prev[prev.length - 1];
      if (last[0] === newPoint[0] && last[1] === newPoint[1]) return prev;
      return [...prev.slice(-20), newPoint]; // keep last 20 points
    });
  }, [deliveryLocation.lat, deliveryLocation.lng]);

  useEffect(() => {
    if (!deliveryLocation.lat || !deliveryLocation.lng) return;
    const fetchAddress = async () => {
      try {
        setLocationLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${deliveryLocation.lat}&lon=${deliveryLocation.lng}`
        );
        const data = await response.json();
        setDeliveryAddress(data?.display_name || "Current location available");
      } catch {
        setDeliveryAddress("Location updating...");
      } finally {
        setLocationLoading(false);
      }
    };
    fetchAddress();
  }, [deliveryLocation.lat, deliveryLocation.lng]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => console.log("User location error:", error)
    );
  }, []);

  const distance = useMemo(
    () => haversineDistance(userLocation, deliveryLocation.lat ? deliveryLocation : null),
    [userLocation, deliveryLocation]
  );
  const eta = useMemo(() => estimateTime(distance), [distance]);

  const handleCancelOrder = async () => {
    try {
      await dispatch(cancelOrder({ orderId: currentOrder._id, reason: cancelReason || "Cancelled by user" })).unwrap();
      setShowCancelModal(false);
      setCancelReason("");
      dispatch(getOrderById(currentOrder._id));
    } catch (error) {
      console.log(error);
    }
  };

  const statusSteps = [
    { key: "pending", label: "Placed", icon: "📋" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { key: "assigned", label: "Assigned", icon: "🛵" },
    { key: "out_for_delivery", label: "On the Way", icon: "🚀" },
    { key: "delivered", label: "Delivered", icon: "🎉" },
  ];

  const statusOrder = ["pending", "confirmed", "preparing", "assigned", "accepted_by_delivery_boy", "out_for_delivery", "delivered"];
  const currentStatusIndex = statusOrder.indexOf(currentOrder?.status);

  const getStepState = (stepKey) => {
    const stepIndex = statusOrder.indexOf(stepKey);
    if (stepIndex === -1) return "pending";
    if (stepIndex < currentStatusIndex) return "done";
    if (stepIndex === currentStatusIndex) return "active";
    return "pending";
  };

  if (loading && !currentOrder)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdfb]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#c67c4e] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#a07d63] font-bold uppercase tracking-widest text-[10px]">Loading your creation...</p>
        </div>
      </div>
    );

  if (!currentOrder)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdfb]">
        <p className="text-[#6f5a4b] text-lg font-bold">Order not found</p>
      </div>
    );

  const isActiveDelivery = ["assigned", "accepted_by_delivery_boy", "out_for_delivery"].includes(currentOrder.status);
  const hasDeliveryBoy = currentOrder.deliveryBoy && ["assigned", "accepted_by_delivery_boy", "out_for_delivery", "delivered"].includes(currentOrder.status);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital,wght@0,400;1,400&display=swap');

        .od-root {
          min-height: 100vh;
          background: linear-gradient(to bottom, #fffdfb, #faf5ef, #f5ebe0);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #2d1f16;
          padding: 40px 16px 100px;
        }

        .od-container { max-width: 800px; margin: 0 auto; }

        .od-card {
          background: white;
          border: 1px solid #eadccf;
          border-radius: 28px;
          padding: 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(186,140,102,0.06);
        }

        .od-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c67c4e, #d8b79d, transparent);
          z-index: 10;
        }

        .od-title {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: 32px;
          font-style: italic;
          color: #2d1f16;
        }

        .od-section-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #a07d63;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        /* ── Status Badge ── */
        .status-badge {
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .status-badge.delivered { background: #10b981; color: white; box-shadow: 0 8px 20px rgba(16,185,129,0.25); }
        .status-badge.cancelled { background: #ef4444; color: white; box-shadow: 0 8px 20px rgba(239,68,68,0.25); }
        .status-badge.active { background: #2d1f16; color: white; box-shadow: 0 8px 20px rgba(45,31,22,0.25); }

        /* ── Progress Steps ── */
        .steps-row {
          display: flex;
          align-items: flex-start;
          position: relative;
          margin-top: 20px;
        }

        .step-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .step-circle.done {
          background: #2d1f16;
          color: white;
          box-shadow: 0 0 16px rgba(45,31,22,0.15);
        }

        .step-circle.active {
          background: #c67c4e;
          color: white;
          box-shadow: 0 0 25px rgba(198,124,78,0.4);
          transform: scale(1.1);
        }

        .step-circle.pending {
          background: white;
          border: 1px solid #eadccf;
          color: #eadccf;
        }

        .step-label {
          font-size: 11px;
          font-weight: 800;
          margin-top: 12px;
          color: #eadccf;
          text-align: center;
        }
        .step-label.done, .step-label.active { color: #2d1f16; }

        .step-connector {
          position: absolute;
          top: 22px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #f5ebe0;
          z-index: 1;
        }

        .step-connector-fill {
          height: 100%;
          background: #c67c4e;
          transition: width 0.6s ease;
        }

        /* ── ETA Bar ── */
        .eta-bar {
          background: white;
          border: 1px solid #eadccf;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(186,140,102,0.08);
        }

        .eta-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .eta-value {
          font-family: 'Instrument Serif', serif;
          font-size: 32px;
          font-weight: 400;
          font-style: italic;
          color: #c67c4e;
        }

        .eta-label {
          font-size: 10px;
          color: #a07d63;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .eta-divider {
          width: 1px;
          height: 48px;
          background: #f5ebe0;
        }

        /* ── Delivery Partner ── */
        .partner-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #faf5ef;
          border-radius: 20px;
          border: 1px solid #eadccf;
          margin-bottom: 20px;
        }

        .partner-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c67c4e, #b86c3d);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Instrument Serif', serif;
          font-size: 24px;
          color: white;
          flex-shrink: 0;
          position: relative;
        }

        .online-dot {
          position: absolute;
          bottom: 3px;
          right: 3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid #faf5ef;
        }
        .online-dot.online { background: #10b981; }
        .online-dot.offline { background: #eadccf; }

        .track-btn {
          width: 100%;
          padding: 18px;
          background: #2d1f16;
          border: none;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 10px 25px rgba(45,31,22,0.2);
        }
        .track-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(45,31,22,0.3); }

        /* ── Items ── */
        .item-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: white;
          border-radius: 18px;
          border: 1px solid #eadccf;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .item-row:hover { border-color: #c67c4e; transform: translateX(6px); }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(45, 31, 22, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-sheet {
          background: white;
          border-radius: 32px;
          width: 100%;
          max-width: 1000px;
          height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 100px rgba(0,0,0,0.15);
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #f5ebe0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-close {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #faf5ef;
          color: #2d1f16;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .bottom-panel {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          background: white;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          border: 1px solid #eadccf;
          z-index: 1000;
        }

        .stat-value {
          font-family: 'Instrument Serif', serif;
          font-size: 24px;
          color: #c67c4e;
        }

        .stat-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #a07d63;
        }

        .cancel-card {
          background: white;
          border-radius: 32px;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          border: 1px solid #eadccf;
        }

        .cancel-textarea {
          width: 100%;
          background: #faf5ef;
          border: 1px solid #eadccf;
          border-radius: 20px;
          padding: 16px;
          font-family: inherit;
          margin: 16px 0 24px;
          outline: none;
        }
        .cancel-textarea:focus { border-color: #c67c4e; }

        .btn-danger {
          background: #ef4444;
          color: white;
          padding: 16px;
          border: none;
          border-radius: 20px;
          font-weight: 800;
          cursor: pointer;
          width: 100%;
          margin-bottom: 12px;
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid #eadccf;
          color: #6f5a4b;
          padding: 16px;
          border-radius: 20px;
          font-weight: 800;
          cursor: pointer;
          width: 100%;
        }

        /* Dark map tiles filter */
        .leaflet-tile-pane { filter: brightness(0.95) saturate(0.8) sepia(0.2) hue-rotate(-20deg); }
      `}</style>

      <div className="od-root">
        <div className="od-container">

          {/* ── Header ── */}
          <div className="od-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#faf5ef] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#6f5a4b] border border-[#eadccf]"
                >
                  ← Back to Orders
                </button>
                <h1 className="od-title">Order Journey</h1>
                <p style={{ fontSize: 13, color: "#a07d63", fontWeight: 700, marginTop: 4 }}>
                  #{currentOrder._id.slice(-8).toUpperCase()} · {new Date(currentOrder.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span className={`status-badge ${currentOrder.status === "delivered" ? "delivered" : currentOrder.status === "cancelled" ? "cancelled" : "active"}`}>
                  {currentOrder.status.replaceAll("_", " ")}
                </span>
                {loading && <span style={{ fontSize: 10, color: "#c67c4e", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>● Live Syncing</span>}
              </div>
            </div>
          </div>

          {/* ── ETA Bar (active delivery only) ── */}
          {isActiveDelivery && distance && eta && (
            <div className="eta-bar">
              <div className="eta-item">
                <span className="eta-value">{eta}</span>
                <span className="eta-label">Min Arrival</span>
              </div>
              <div className="eta-divider" />
              <div className="eta-item">
                <span className="eta-value">{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}</span>
                <span className="eta-label">Distance</span>
              </div>
              <div className="eta-divider" />
              <div className="eta-item">
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ef4444", color: "white", padding: "4px 10px", borderRadius: "100px", fontSize: 10, fontWeight: 800 }}>
                  <div style={{ width: 6, height: 6, background: "white", borderRadius: "50%", animation: "pulse 1s infinite" }} />
                  LIVE
                </div>
                <span className="eta-label" style={{ marginTop: 8 }}>Tracking</span>
              </div>
            </div>
          )}

          {/* ── Order Progress ── */}
          <div className="od-card">
            <p className="od-section-title">Preparation Journey</p>
            <div className="steps-row">
              {statusSteps.map((step, idx) => {
                const state = getStepState(step.key);
                const isLast = idx === statusSteps.length - 1;
                return (
                  <div className="step-item" key={step.key}>
                    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                      {!isLast && (
                        <div className="step-connector">
                          <div className="step-connector-fill" style={{ width: state === "done" ? "100%" : state === "active" ? "50%" : "0%" }} />
                        </div>
                      )}
                      <div className={`step-circle ${state}`}>
                        <span style={{ fontSize: state === "pending" ? 14 : 18 }}>{step.icon}</span>
                      </div>
                    </div>
                    <span className={`step-label ${state}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Delivery Partner ── */}
          {hasDeliveryBoy && (
            <div className="od-card">
              <p className="od-section-title">Delivery Partner</p>

              <div className="partner-row">
                <div className="partner-avatar">
                  {(currentOrder.deliveryBoy?.user?.userName || "D").charAt(0).toUpperCase()}
                  <span className={`online-dot ${currentOrder.deliveryBoy?.isOnline ? "online" : "offline"}`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 18, color: "#2d1f16", margin: 0 }}>
                    {currentOrder.deliveryBoy?.user?.userName || currentOrder.deliveryBoy?.name || "Premium Partner"}
                  </p>
                  <p style={{ fontSize: 13, color: "#a07d63", fontWeight: 600, margin: 0 }}>
                    {currentOrder.deliveryBoy?.user?.contactNumber || currentOrder.deliveryBoy?.phone || "Private Line"}
                  </p>
                </div>
                <a
                  href={`tel:${currentOrder.deliveryBoy?.user?.contactNumber || currentOrder.deliveryBoy?.phone}`}
                  style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "#2d1f16", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", fontSize: 20, flexShrink: 0,
                    boxShadow: "0 8px 20px rgba(45,31,22,0.2)"
                  }}
                >📞</a>
              </div>

              {deliveryLocation.lat && deliveryLocation.lng && userLocation ? (
                <button className="track-btn" onClick={() => setShowTrackingModal(true)}>
                  🛵 Open Live Tracking Map
                </button>
              ) : (
                <div style={{
                  borderRadius: 20, border: "2px dashed #eadccf",
                  padding: "24px", textAlign: "center", color: "#a07d63", fontSize: 13, fontWeight: 700
                }}>
                  Locating partner on GPS...
                </div>
              )}
            </div>
          )}

          {/* ── Ordered Items ── */}
          <div className="od-card">
            <p className="od-section-title">Culinaries Selected</p>
            <div style={{ marginBottom: 24 }}>
              {currentOrder.items?.map((item, index) => (
                <div className="item-row" key={index}>
                  <img
                    src={item.food?.image || "https://placehold.co/80x80/faf5ef/c67c4e?text=🍽"}
                    alt={item.food?.name}
                    style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", flexShrink: 0, border: "1px solid #eadccf" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: 15, color: "#2d1f16", margin: 0, marginBottom: 4 }}>
                      {item.food?.name}
                    </p>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#a07d63", textTransform: "uppercase" }}>Qty: {item.food?.quantity || item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: 800, color: "#c67c4e", fontSize: 18, flexShrink: 0 }}>
                    ₹{(item.food?.price || 0) * (item.food?.quantity || item.quantity || 1)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderTop: "2px dashed #eadccf", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#6f5a4b", fontWeight: 800, textTransform: "uppercase", fontSize: 12, letterSpacing: "0.1em" }}>Investment in Taste</span>
              <span style={{ fontWeight: 800, fontSize: 32, color: "#2d1f16", tracking: "-0.05em" }}>
                ₹{currentOrder.totalAmount || currentOrder.total || "—"}
              </span>
            </div>
          </div>

          {/* ── Cancel Button ── */}
          {["pending", "confirmed"].includes(currentOrder.status) && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="ui-btn-secondary rounded-2xl! py-4! shadow-sm w-full"
            >
              Request Cancellation
            </button>
          )}
        </div>
      </div>

      {/* TRACKING MODAL */}
      {showTrackingModal && userLocation && deliveryLocation.lat && deliveryLocation.lng && (
        <div className="modal-overlay" onClick={() => setShowTrackingModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 24, margin: 0 }}>Live Journey</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ef4444", color: "white", padding: "4px 10px", borderRadius: "100px", fontSize: 10, fontWeight: 800 }}>
                    <div style={{ width: 6, height: 6, background: "white", borderRadius: "50%", animation: "pulse 1s infinite" }} />
                    LIVE Tracking
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowTrackingModal(false)}>×</button>
            </div>

            <div className="map-wrapper">
              <MapContainer center={[deliveryLocation.lat, deliveryLocation.lng]} zoom={14} style={{ width: "100%", height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {routePoints.length > 1 && <Polyline positions={routePoints} color="#c67c4e" weight={4} dashArray="8,12" />}
                <SmoothMarker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon} />
                <SmoothMarker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryMarkerIcon} />
                <FitBounds userLocation={userLocation} deliveryLocation={deliveryLocation} />
              </MapContainer>

              <div className="bottom-panel">
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div className="partner-avatar" style={{ width: 50, height: 50, fontSize: 18 }}>
                    {(currentOrder.deliveryBoy?.user?.userName || "D").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{currentOrder.deliveryBoy?.user?.userName || "Partner"}</p>
                    <p style={{ fontSize: 11, color: "#a07d63", margin: 0 }}>{locationLoading ? "Tracking satellite..." : (deliveryAddress?.split(",").slice(0, 2).join(", ") || "Active Journey")}</p>
                  </div>
                </div>

                <div className="panel-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div className="stat-cell" style={{ textAlign: "center" }}>
                    <span className="stat-value">{eta ? `${eta} min` : "—"}</span>
                    <span className="stat-label">Arrival</span>
                  </div>
                  <div className="stat-cell" style={{ textAlign: "center" }}>
                    <span className="stat-value">{distance ? (distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`) : "—"}</span>
                    <span className="stat-label">Distance</span>
                  </div>
                  <div className="stat-cell" style={{ textAlign: "center" }}>
                    <span className="stat-value" style={{ fontSize: 18 }}>Active</span>
                    <span className="stat-label">Status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="modal-overlay" style={{ background: "rgba(45, 31, 22, 0.6)" }} onClick={() => setShowCancelModal(false)}>
          <div className="cancel-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 28, margin: "0 0 12px" }}>Cancel Journey?</h3>
            <p style={{ fontSize: 14, color: "#6f5a4b", fontWeight: 500 }}>Please let us know the reason for cancellation.</p>
            <textarea
              className="cancel-textarea"
              rows={3}
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <button className="btn-danger" onClick={handleCancelOrder}>Confirm Cancellation</button>
            <button className="btn-ghost" onClick={() => setShowCancelModal(false)}>Keep Order</button>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderDetailsPage;
