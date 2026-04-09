import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllFoodForUser } from "../../features/user/foodSlice";

function RestaurantPage() {
  const dispatch = useDispatch();
  const { restaurantId } = useParams();

  const { foods = [], loading } = useSelector((state) => state.food);

  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState(null);

  useEffect(() => {
    dispatch(
      getAllFoodForUser({
        page: 1,
        restaurantId: restaurantId || "",
        category: "",
        isVeg: vegFilter === null ? "" : vegFilter,
      })
    );
  }, [dispatch, restaurantId, vegFilter]);

  const filteredFoods = foods.filter((f) =>
    f?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const restaurantName =
    foods[0]?.restaurantId?.name ?? "Restaurant";
  const cityName =
    foods[0]?.restaurantId?.city?.name ?? "City";

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fffdfb] via-[#faf5ef] to-[#f5ebe0] text-[#2d1f16]">
      <div className="ui-container py-6 sm:py-8">
        <div className="ui-card mb-8 p-10 mt-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#c67c4e] to-[#eadccf]" />
          <h1 className="text-4xl font-black text-[#2d1f16] tracking-tight">
            {restaurantName}
          </h1>
          <p className="text-sm font-bold text-[#a07d63] uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-4 h-px bg-[#eadccf]" />
            {cityName}
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-75">
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ui-input rounded-2xl! pl-12!"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a07d63]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="flex bg-white/50 p-1.5 rounded-2xl border border-[#eadccf] gap-1">
            <button
              type="button"
              onClick={() => setVegFilter(null)}
              className={`rounded-xl! px-6! py-2.5! text-xs! font-black! uppercase! tracking-widest! transition-all ${
                vegFilter === null
                  ? "bg-[#2d1f16] text-white shadow-lg"
                  : "text-[#6f5a4b] hover:bg-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setVegFilter(true)}
              className={`rounded-xl! px-6! py-2.5! text-xs! font-black! uppercase! tracking-widest! transition-all ${
                vegFilter === true
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-[#6f5a4b] hover:bg-white"
              }`}
            >
              Veg
            </button>
            <button
              type="button"
              onClick={() => setVegFilter(false)}
              className={`rounded-xl! px-6! py-2.5! text-xs! font-black! uppercase! tracking-widest! transition-all ${
                vegFilter === false
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-[#6f5a4b] hover:bg-white"
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFoods.map((item) => (
              <div
                key={item._id}
                className="ui-card p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src={item.images?.[0] || "/no-image.jpg"}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/40 backdrop-blur-md bg-white/20 text-white`}>
                    {item.isVeg ? "Veg" : "Non-Veg"}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-[#2d1f16] tracking-tight">
                    {item.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-2xl font-black text-[#c67c4e]">
                      ₹{item.price}
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#a07d63] bg-[#faf5ef] px-3 py-1 rounded-full border border-[#eadccf]">
                      View Detail
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantPage;
