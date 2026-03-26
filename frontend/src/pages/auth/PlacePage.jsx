import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNearbyPlaces } from "../../features/user/placeSlice";
import PlaceCard from "../../components/Place/PlaceCard";
import PlaceFilter from "../../components/Place/PlaceFilter";
import PlaceMap from "../../components/Place/PlaceMap";



const PlacePage = ({ cityId }) => {
  const dispatch = useDispatch();
  const { nearbyPlaces, loading } = useSelector((state) => state.place);

  const [coords, setCoords] = useState(null);
  const [distance, setDistance] = useState(25000);
  const [category, setCategory] = useState("");

  // 📍 Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  // 🔥 Fetch places
  useEffect(() => {
    if (coords) {
      dispatch(
        fetchNearbyPlaces({
          lat: coords.lat,
          lng: coords.lng,
          cityId,
          distance,
          category,
        })
      );
    }
  }, [coords, distance, category, cityId, dispatch]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDE */}
      <div style={{ width: "35%", overflowY: "auto", padding: "10px" }}>
        
        <PlaceFilter
          distance={distance}
          setDistance={setDistance}
          category={category}
          setCategory={setCategory}
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          nearbyPlaces.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "65%" }}>
        <PlaceMap places={nearbyPlaces} />
      </div>
    </div>
  );
};

export default PlacePage;