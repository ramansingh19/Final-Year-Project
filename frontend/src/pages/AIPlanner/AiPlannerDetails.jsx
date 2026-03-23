import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import L from "leaflet";
import { getActiveCities } from "../../features/user/citySlice";
import { loadAiPlan, loadPlanHistory } from "../../features/user/placeSlice";
import { IoIosCloseCircleOutline } from "react-icons/io";

// ✅ MAP IMPORTS
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ FIX MARKER ISSUE
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ✅ ICONS
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const markerIcons = {
  Place: createIcon("green"),
  Hotel: createIcon("red"),
  Restaurant: createIcon("orange"),
};

function AiPlannerDetails() {
  const dispatch = useDispatch();
  const [modalData, setModalData] = useState(null);

  const { aiPlan } = useSelector((state) => state.place);
  const safeAiPlan = aiPlan || [];

  useEffect(() => {
    dispatch(getActiveCities());
    dispatch(loadPlanHistory());

    const lastPlan = JSON.parse(localStorage.getItem("lastAiPlan"));
    if (lastPlan) dispatch(loadAiPlan(lastPlan));
  }, [dispatch]);

  // ✅ Coordinates
  const coordinates = safeAiPlan.flatMap((day) => [
    ...(day.places?.map((p) => [
      p.location.coordinates[1],
      p.location.coordinates[0],
    ]) || []),
    ...(day.hotels?.map((h) => [
      h.location.coordinates[1],
      h.location.coordinates[0],
    ]) || []),
  ]);

  const bounds = coordinates.length ? L.latLngBounds(coordinates) : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="text-gray-800 mb-4 px-6 py-4 rounded-2xl shadow-md bg-gray-200">
        <h1 className="text-3xl font-bold">AI Travel Planner 🤖</h1>
        <h3 className="text-lg font-semibold mt-2">Plan Overview</h3>
      </div>

      {/* EMPTY STATE */}
      {safeAiPlan?.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          No plan generated yet
        </p>
      )}

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeAiPlan.map((day, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="font-bold mb-3 text-lg">Day {day.day}</h2>

            {day.places?.map((p, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setModalData({ type: "place", data: p, day })
                }
                className="p-3 mb-2 rounded-md shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3"
              >
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div>
                  <strong>{p.name}</strong>
                  <p className="text-sm text-gray-500">
                    {p.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ================= GLOBAL MAP ================= */}
      {coordinates.length > 0 && (
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-3">Map Overview 🗺️</h2>

          <MapContainer
            bounds={bounds}
            scrollWheelZoom={true}
            style={{ height: "450px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {safeAiPlan.map((day) =>
              [
                ...(day.places || []).map((p) => ({
                  ...p,
                  type: "Place",
                })),
                ...(day.hotels || []).map((h) => ({
                  ...h,
                  type: "Hotel",
                })),
              ].map((loc, idx) => (
                <Marker
                  key={`${day.day}-${idx}`}
                  position={[
                    loc.location.coordinates[1],
                    loc.location.coordinates[0],
                  ]}
                  icon={markerIcons[loc.type]}
                >
                  <Popup>
                    <strong>{loc.name}</strong>
                    <br />
                    {loc.type}
                  </Popup>
                </Marker>
              ))
            )}

            <Polyline positions={coordinates} />
          </MapContainer>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {modalData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-9999"
          onClick={() => setModalData(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[90%] h-[85%] overflow-y-auto shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-3xl hover:text-red-500"
              onClick={() => setModalData(null)}
            >
              <IoIosCloseCircleOutline />
            </button>

            {/* PLACE DETAILS */}
            {modalData.type === "place" && (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  {modalData.data.name}
                </h2>

                <p className="text-gray-600 mb-2">
                  {modalData.data.description}
                </p>

                <p className="text-sm text-gray-500 mb-2">
                  Category: {modalData.data.category}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  ₹{modalData.data.entryfees} •{" "}
                  {modalData.data.timeRequired} hrs
                </p>

                {/* IMAGES */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {modalData.data.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ))}
                </div>

                {/* HOTELS */}
                <h3 className="text-lg font-bold mb-2">
                  Nearby Hotels 🏨
                </h3>

                <div className="grid grid-cols-1 gap-2 mb-4">
                  {modalData.day?.hotels?.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md shadow-sm flex gap-3"
                    >
                      {h.images?.[0] && (
                        <img
                          src={h.images[0]}
                          className="w-16 h-16 rounded-md"
                        />
                      )}
                      <div>
                        <strong>{h.name}</strong>
                        <p className="text-sm text-gray-500">
                          ₹{h.cheapestRoom?.pricePerNight}/night
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AiPlannerDetails;