import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNearbyPlaces } from "../../features/user/placeSlice";
import PlaceHeader from "../../components/Place/PlaceHeader";
import PlaceFilters from "../../components/Place/PlaceFilters";
import PlaceSummary from "../../components/Place/PlaceSummary";
import PlaceList from "../../components/Place/PlaceList";
import PlaceMap from "../../components/Place/PlaceMap";
import EmptyState from "../../components/Place/EmptyState";
import LoadingSkeleton from "../../components/Place/LoadingSkeleton";

const DEFAULT_DISTANCE = 100000;

const PlacePage = ({ cityId }) => {
  const dispatch = useDispatch();
  const { nearbyPlaces = [], loading, error } = useSelector((state) => state.place);

  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(DEFAULT_DISTANCE);
  const [category, setCategory] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [cityName, setCityName] = useState("Discover Nearby");
  const [searchQuery, setSearchQuery] = useState("");

  const requestUserLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCoords(nextCoords);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  useEffect(() => {
    requestUserLocation();
  }, []);

  useEffect(() => {
    if (!coords) return;

    dispatch(
      fetchNearbyPlaces({
        lat: coords.lat,
        lng: coords.lng,
        cityId,
        distance,
        category,
      }),
    );
  }, [coords, distance, category, cityId, dispatch]);

  useEffect(() => {
    if (!coords || !window.google?.maps?.Geocoder) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status !== "OK" || !results?.length) return;

      const locality = results[0].address_components?.find((component) =>
        component.types.includes("locality"),
      );
      const adminArea = results[0].address_components?.find((component) =>
        component.types.includes("administrative_area_level_1"),
      );

      setCityName(locality?.long_name || adminArea?.long_name || "Nearby Places");
    });
  }, [coords]);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return nearbyPlaces;

    return nearbyPlaces.filter((place) => {
      const name = place?.name?.toLowerCase() || "";
      const placeCategory = place?.category?.toLowerCase() || "";
      return name.includes(normalizedQuery) || placeCategory.includes(normalizedQuery);
    });
  }, [nearbyPlaces, searchQuery]);

  return (
    <section className="mx-auto grid h-[calc(100vh-4rem)] max-w-[1440px] grid-cols-1 gap-4 p-3 md:p-4 lg:grid-cols-12">
      <aside className="order-2 flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md lg:order-1 lg:col-span-5">
        <div className="space-y-4 border-b border-gray-100 p-4">
          <PlaceHeader
            cityName={cityName}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUseLocation={requestUserLocation}
          />
          <PlaceFilters
            distance={distance}
            category={category}
            onDistanceChange={setDistance}
            onCategoryChange={setCategory}
          />
          <PlaceSummary count={filteredPlaces.length} distance={distance} />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : filteredPlaces.length === 0 ? (
            <EmptyState />
          ) : (
            <PlaceList
              places={filteredPlaces}
              selectedPlaceId={selectedPlaceId}
              hoveredPlaceId={hoveredPlaceId}
              onSelect={setSelectedPlaceId}
              onHover={setHoveredPlaceId}
            />
          )}
        </div>
      </aside>

      <div className="order-1 h-[360px] overflow-hidden rounded-2xl bg-white shadow-md md:h-[420px] lg:order-2 lg:col-span-7 lg:h-full">
        <PlaceMap
          center={coords}
          places={filteredPlaces}
          selectedPlaceId={selectedPlaceId}
          hoveredPlaceId={hoveredPlaceId}
          onSelectPlace={setSelectedPlaceId}
        />
      </div>
    </section>
  );
};



export default PlacePage;