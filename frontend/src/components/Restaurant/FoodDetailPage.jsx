import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { getFoodByIdForUser } from "../../features/user/foodSlice";
import { addToCart, selectCartItemCount } from "../../features/user/cartSlice";

function FoodDetailPage() {
  const { foodId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userFoodDetail, userFoodDetailLoading, error } = useSelector(
    (state) => state.food
  );
  const cartCount = useSelector(selectCartItemCount);

  useEffect(() => {
    if (foodId) {
      dispatch(getFoodByIdForUser(foodId));
    }
  }, [dispatch, foodId]);

  const food = userFoodDetail;
  const restaurant = food?.restaurantId;
  const restaurantId =
    restaurant?._id ?? location.state?.restaurantId ?? "";

  const handleOrder =  () => {
    if (!food) return;
    dispatch(
      addToCart({
        foodId: food._id,
        name: food.name,
        price: food.price,
        image: food.images?.[0],
        restaurantId: restaurant?._id,
        restaurantName: restaurant?.name,
        qty: 1,
      })
    );
  };

  if (userFoodDetailLoading && !food) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 dark:bg-gray-950">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-orange-400/30 border-t-orange-500" />
      </div>
    );
  }

  if (error && !food) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center dark:text-gray-200">
        <p>{String(error)}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 text-orange-600 dark:text-orange-400"
        >
          Back
        </button>
      </div>
    );
  }

  const img = food?.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-b from-[#fffdfb] via-[#faf5ef] to-[#f5ebe0] pb-32 text-[#2d1f16]"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden sm:max-h-125 border-b border-[#eadccf]">
        <img
          src={img || "/no-image.jpg"}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#2d1f16]/40 to-transparent" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#2d1f16] shadow-2xl border border-white/40 active:scale-95 transition-all"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="ui-container max-w-2xl py-10 px-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1 w-8 bg-[#c67c4e] rounded-full" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a07d63]">
            {restaurant?.name ?? "Restaurant"}
          </p>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-[#2d1f16] tracking-tight leading-[1.1]">
          {food?.name}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            food?.isVeg ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {food?.isVeg ? "Vegetarian" : "Non-Veg"}
          </span>
          <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white border border-[#eadccf] text-[#6f5a4b]">
            {food?.category}
          </span>
        </div>

        <p className="mt-8 text-lg leading-relaxed text-[#6f5a4b] font-medium">
          {food?.description ?? "Experience a symphony of flavors crafted with the finest ingredients and culinary expertise."}
        </p>

        <div className="mt-10 flex items-baseline gap-2">
          <span className="text-sm font-black text-[#a07d63]">₹</span>
          <span className="text-5xl font-black text-[#2d1f16] tracking-tighter">
            {food?.price}
          </span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#eadccf] bg-white/80 backdrop-blur-2xl px-6 py-6 shadow-2xl">
        <div className="mx-auto flex max-w-2xl gap-4">
          <Link
            to="/cart"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#eadccf] text-[#2d1f16] shadow-sm active:scale-95 transition-all group"
          >
            <div className="relative">
              <ShoppingBagIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c67c4e] text-white text-[10px] font-black border-2 border-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
          </Link>
          <button
            type="button"
            onClick={handleOrder}
            className="ui-btn-primary flex-1 rounded-2xl! py-4! text-sm! font-black! tracking-widest! uppercase! shadow-xl shadow-[#c67c4e]/20"
          >
            Add to Basket — ₹{food?.price}
          </button>
        </div>
        {restaurantId ? (
          <Link
            to={`/restaurant/${restaurantId}/menu`}
            className="mt-4 block text-center text-[10px] font-black uppercase tracking-widest text-[#a07d63] hover:text-[#c67c4e] transition-colors"
          >
            Explore the full menu
          </Link>
        ) : null}
      </div>
    </motion.div>
  );
}

export default FoodDetailPage;
