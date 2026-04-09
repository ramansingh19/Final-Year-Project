import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFood } from "../../../features/user/foodSlice";
import { getRestaurantStatus } from "../../../features/user/restaurantSlice";

function CreateFood() {
  const dispatch = useDispatch();

  const { restaurants = [], loading } = useSelector((state) => state.restaurant);

  // console.log(restaurants);
  
  useEffect(() => {
   dispatch(getRestaurantStatus("active"))
  }, [dispatch])

  const [formData, setFormData] = useState({
    restaurantId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
    images: [null, null, null],
  });


  // ✅ Filter ACTIVE restaurants safely
  const activeRestaurants = (restaurants || []).filter(
    (r) => r.status === "active"
  );

  // -------- HANDLERS --------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, file) => {
    const updated = [...formData.images];
    updated[index] = file;

    setFormData((prev) => ({
      ...prev,
      images: updated,
    }));
  };

  // -------- SUBMIT --------
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ validation
    if (!formData.restaurantId) {
      alert("Please select a restaurant");
      return;
    }

    if (!formData.name || !formData.price || !formData.category) {
      alert("Please fill all required fields");
      return;
    }

    const data = new FormData();

    data.append("restaurantId", formData.restaurantId);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);

    // ✅ convert boolean to string (safe for backend)
    data.append("isVeg", formData.isVeg ? "true" : "false");

    formData.images.forEach((img) => {
      if (img) data.append("images", img);
    });

    dispatch(createFood(data));

    // ✅ reset form
    setFormData({
      restaurantId: "",
      name: "",
      description: "",
      price: "",
      category: "",
      isVeg: true,
      images: [null, null, null],
    });

    alert("Food Created Successfully");
  };

  return (
<div className="min-h-screen bg-linear-to-b from-gray-50 via-gray-100 to-gray-200 px-4 md:px-6 py-6 text-gray-900">

{/* Header */}
<div className="relative mb-8 overflow-hidden rounded-4xl border border-gray-200 bg-linear-to-br from-white via-gray-100 to-gray-50 p-6 md:p-8 shadow-lg transition-transform duration-500 hover:scale-[1.01]">
  <div className="absolute -top-10 right-0 h-44 w-44 rounded-full bg-orange-200/30 blur-3xl animate-pulse" />
  <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-pink-200/30 blur-3xl animate-pulse" />

  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div className="flex items-center gap-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-orange-400 to-pink-400 text-3xl shadow-lg animate-bounce">
        🍔
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-gray-500">
          Menu Management
        </p>

        <h1 className="text-3xl md:text-5xl font-black bg-linear-to-r from-gray-900 via-orange-400 to-pink-400 bg-clip-text text-transparent">
          Add Food Item
        </h1>

        <p className="mt-2 text-sm md:text-base text-gray-600">
          Add food name, description, price, images, and other details
        </p>
      </div>
    </div>

    <div className="rounded-2xl border border-orange-200 bg-orange-100/30 px-5 py-3 text-sm text-orange-600 backdrop-blur-sm animate-pulse">
      Fill all required details carefully
    </div>
  </div>
</div>

{/* Form Card */}
<div className="mx-auto max-w-4xl rounded-4xl border border-gray-200 bg-white/90 p-6 md:p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">

  <form onSubmit={handleSubmit} className="space-y-8">

    {/* Restaurant & Category */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-600">
          Select Restaurant
        </label>
        <select
          name="restaurantId"
          value={formData.restaurantId}
          onChange={handleChange}
          className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
        >
          <option value="">Select Restaurant</option>
          {activeRestaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name} ({r.city?.name})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-600">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
        >
          <option value="">Select Category</option>
          <option value="starter">Starter</option>
          <option value="main">Main Course</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>
    </div>

    {/* Name & Description */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-600">
          Food Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter food name"
          className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-600">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
        />
      </div>
    </div>

    {/* Price & Veg */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-600">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isVeg"
          checked={formData.isVeg}
          onChange={handleChange}
          className="h-5 w-5 rounded border-gray-300 bg-green-100 text-green-500 focus:ring-green-300"
        />
        <span className="text-gray-900 font-medium">Veg Item</span>
      </div>
    </div>

    {/* Images */}
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Food Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {formData.images.map((img, i) => (
          <label
            key={i}
            className="group relative flex h-28 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-gray-50 transition-all duration-300 hover:border-orange-400 hover:scale-105"
          >
            {img ? (
              <img
                src={URL.createObjectURL(img)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl text-gray-400 group-hover:text-orange-400">
                  +
                </div>
                <p className="text-xs text-gray-500">Upload</p>
              </div>
            )}
            <input
              hidden
              type="file"
              onChange={(e) => handleImageChange(i, e.target.files[0])}
            />
          </label>
        ))}
      </div>
    </div>

    {/* Submit Button */}
    <div className="pt-2">
      <button
        disabled={loading}
        className="w-full rounded-3xl bg-linear-to-r from-orange-400 to-pink-400 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding Food..." : "Add Food"}
      </button>
    </div>

  </form>
</div>
</div>
  );
}

export default CreateFood;