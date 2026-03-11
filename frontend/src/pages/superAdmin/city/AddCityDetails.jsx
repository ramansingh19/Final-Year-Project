import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCity } from "../../../features/user/citySlice";
import { useNavigate } from "react-router-dom";

function AddCityDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, createSuccess } = useSelector((state) => state.city);

  /* ---------------- OPTIONS ---------------- */

  const famousOptions = [
    "tourism",
    "beaches",
    "mountains",
    "food",
    "history",
    "nightlife",
    "shopping",
  ];

  const bestTimeOptions = [
    "January - March",
    "April - June",
    "July - September",
    "October - December",
    "Winter",
    "Summer",
    "Monsoon",
    "All Year",
  ];

  /* ---------------- STATE ---------------- */

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    country: "",
    description: "",
    bestTimeToVisit: "",
    avgDailyBudget: "",
    famousFor: [],
    latitude: "",
    longitude: "",
    images: [null, null, null, null, null],
  });

  /* ---------------- INPUT CHANGE ---------------- */

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- TOGGLE FAMOUS ---------------- */

  const toggleFamous = (item) => {
    setFormData((prev) => {
      const exists = prev.famousFor.includes(item);

      return {
        ...prev,
        famousFor: exists
          ? prev.famousFor.filter((f) => f !== item)
          : [...prev.famousFor, item],
      };
    });
  };

  /* ---------------- AUTO LOCATION ---------------- */

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

  /* ---------------- IMAGE CHANGE ---------------- */

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = file;

      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("state", formData.state);
    data.append("country", formData.country);
    data.append("description", formData.description);
    data.append("bestTimeToVisit", formData.bestTimeToVisit);
    data.append("avgDailyBudget", formData.avgDailyBudget);

    // convert array → string
    data.append("famousFor", formData.famousFor.join(","));

    const location = {
      type: "Point",
      coordinates: [
        Number(formData.longitude),
        Number(formData.latitude),
      ],
    };

    data.append("location", JSON.stringify(location));

    // append images
    formData.images
      .filter(Boolean)
      .forEach((img) => data.append("images", img));

    dispatch(createCity(data));
  };

  useEffect(() => {
    if(createSuccess === true){
      navigate("/superAdmin/superAdminDashboard")
    }
  }, [navigate, createSuccess])

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">Create City</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* CITY NAME */}
        <input
          name="name"
          placeholder="City Name"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={handleChange}
        />

        {/* STATE & COUNTRY */}
        <div className="grid grid-cols-2 gap-4">

          <input
            name="state"
            placeholder="State"
            className="border p-2 rounded"
            value={formData.state}
            onChange={handleChange}
          />

          <input
            name="country"
            placeholder="Country"
            className="border p-2 rounded"
            value={formData.country}
            onChange={handleChange}
          />

        </div>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="City Description"
          className="w-full border p-2 rounded"
          value={formData.description}
          onChange={handleChange}
        />

        {/* BEST TIME + BUDGET */}
        <div className="grid grid-cols-2 gap-4">

          <select
            name="bestTimeToVisit"
            className="border p-2 rounded"
            value={formData.bestTimeToVisit}
            onChange={handleChange}
          >
            <option value="">Select Best Time</option>

            {bestTimeOptions.map((time) => (
              <option key={time}>{time}</option>
            ))}

          </select>

          <input
            name="avgDailyBudget"
            placeholder="Average Daily Budget"
            className="border p-2 rounded"
            value={formData.avgDailyBudget}
            onChange={handleChange}
          />

        </div>

        {/* LOCATION */}
        <div>

          <p className="font-semibold mb-2">Location</p>

          <div className="grid grid-cols-3 gap-3">

            <input
              name="latitude"
              placeholder="Latitude"
              className="border p-2 rounded"
              value={formData.latitude}
              onChange={handleChange}
            />

            <input
              name="longitude"
              placeholder="Longitude"
              className="border p-2 rounded"
              value={formData.longitude}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={handleGetLocation}
              className="bg-blue-600 text-white rounded-lg"
            >
              Get Location
            </button>

          </div>

          <p className="text-xs text-gray-500 mt-1">
            Type coordinates manually or click "Get Location".
          </p>

        </div>

        {/* FAMOUS FOR */}
        <div>

          <p className="font-semibold mb-2">Famous For</p>

          <div className="grid grid-cols-3 gap-2">

            {famousOptions.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 border p-2 rounded cursor-pointer"
              >

                <input
                  type="checkbox"
                  checked={formData.famousFor.includes(item)}
                  onChange={() => toggleFamous(item)}
                />

                {item}

              </label>
            ))}

          </div>

        </div>

        {/* IMAGES */}
        <div>

          <p className="font-semibold mb-2">City Images (Max 5)</p>

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
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(e, index)}
                />

              </label>
            ))}

          </div>

        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create City"}
        </button>

      </form>

    </div>
  );
}

export default AddCityDetails;