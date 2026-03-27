import React, { useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const getPlaceLatLng = (place) => {
  const lat = Number(place?.latitude);
  const lng = Number(place?.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };

  // Backend returns coordinates as: location: { type: "Point", coordinates: [lng, lat] }
  const coordinates = place?.location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    const lngNum = Number(coordinates[0]);
    const latNum = Number(coordinates[1]);
    if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
      return { lat: latNum, lng: lngNum };
    }
  }

  return null;
};

const PlaceMap = ({ center, places, selectedPlaceId, hoveredPlaceId, onSelectPlace }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    id: "place-discovery-map",
  });

  const mapCenter = center || defaultCenter;

  const selectedPlace = useMemo(
    () =>
      places.find((place) => (place._id || place.id) === selectedPlaceId) ||
      places.find((place) => (place._id || place.id) === hoveredPlaceId),
    [hoveredPlaceId, places, selectedPlaceId],
  );

  if (!apiKey) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-6 text-center text-sm text-gray-600">
        Add `VITE_GOOGLE_MAPS_API_KEY` to show live Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={selectedPlace ? getPlaceLatLng(selectedPlace) || mapCenter : mapCenter}
      zoom={selectedPlace ? 14 : 12}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
    >
      {places.map((place, index) => {
        const id = place._id || place.id || `${place?.name ?? "place"}-${index}`;
        const active = id === selectedPlaceId || id === hoveredPlaceId;
        const markerPos = getPlaceLatLng(place);

        if (!markerPos) return null;

        return (
          <Marker
            key={id}
            position={markerPos}
            title={place.name}
            onClick={() => onSelectPlace(id)}
            icon={
              active
                ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
          />
        );
      })}
    </GoogleMap>
  );
};

export default PlaceMap;