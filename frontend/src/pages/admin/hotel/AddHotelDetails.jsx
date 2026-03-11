import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createHotel } from "../../../features/user/hotelSlice";


function AddHotelDetails() {
  const dispatch = useDispatch();
  const { loading, createSuccess } = useSelector((state) => state.hotel);

  const facilitiesList = [
    "wifi",
    "pool",
    "gym",
    "parking",
    "restaurant",
    "spa",
    "bar",
  ];

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    pricePerNight: "",
    totalRooms: "",
    latitude: "",
    longitude: "",
    facilities: [],
    images: [null, null, null, null, null],
  });

  /* -------- Input Change -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -------- Facility Toggle -------- */
  const toggleFacility = (facility) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(facility);

      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  /* -------- Get Current Location -------- */
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setFormData((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  };

  /* -------- Image Upload -------- */
  const handleImageChange = (index, file) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = file;

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  /* -------- Submit -------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("address", formData.address);
    data.append("pricePerNight", formData.pricePerNight);
    data.append("totalRooms", formData.totalRooms);

    data.append("facilities", formData.facilities.join(","));

    const location = {
      type: "Point",
      coordinates: [formData.longitude, formData.latitude],
    };

    data.append("location", JSON.stringify(location));

    formData.images.forEach((img) => {
      if (img) data.append("images", img);
    });

    dispatch(createHotel(data));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">Create Hotel</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Hotel Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City ID"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="pricePerNight"
            placeholder="Price Per Night"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="number"
            name="totalRooms"
            placeholder="Total Rooms"
            className="border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        {/* LOCATION */}
        <div className="grid grid-cols-3 gap-3">

          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            className="border p-2 rounded"
            value={formData.latitude}
            readOnly
          />

          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            className="border p-2 rounded"
            value={formData.longitude}
            readOnly
          />

          <button
            type="button"
            onClick={handleGetLocation}
            className="bg-blue-600 text-white rounded-lg"
          >
            Get Location
          </button>
        </div>

        {/* FACILITIES */}
        <div>
          <p className="font-semibold mb-2">Facilities</p>

          <div className="grid grid-cols-3 gap-2">
            {facilitiesList.map((facility) => (
              <label
                key={facility}
                className="flex items-center gap-2 border p-2 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.facilities.includes(facility)}
                  onChange={() => toggleFacility(facility)}
                />
                {facility}
              </label>
            ))}
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <p className="font-semibold mb-2">Hotel Images (Max 5)</p>

          <div className="grid grid-cols-5 gap-3">
            {formData.images.map((img, index) => (
              <label
                key={index}
                className="border h-24 flex items-center justify-center cursor-pointer rounded overflow-hidden"
              >
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "+"
                )}

                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleImageChange(index, e.target.files[0])
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create Hotel"}
        </button>

        {createSuccess && (
          <p className="text-green-600 font-semibold">
            Hotel Created Successfully
          </p>
        )}
      </form>
    </div>
  );
}

export default AddHotelDetails;