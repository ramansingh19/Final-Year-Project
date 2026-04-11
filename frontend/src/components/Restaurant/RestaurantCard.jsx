import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { memo } from "react";

function RestaurantCard({
  restaurant,
  index,
  onViewMenu,
  onOpenRestaurant,
}) {
  const cityName = restaurant?.city?.name ?? "—";
  const img = restaurant?.images?.[0];
  const rating =
    typeof restaurant?.rating === "number"
      ? restaurant.rating.toFixed(1)
      : null;

  const id = restaurant?._id || restaurant?.id;

  return (
<motion.article
  layout
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.35,
    delay: Math.min(index * 0.05, 0.4),
    ease: [0.25, 0.46, 0.45, 0.94],
  }}
  className="group relative ui-card flex h-full flex-col overflow-hidden transition-all duration-500"
  whileHover={{ y: -6 }}
>

  {/* Top Accent */}
  <div className="pointer-events-none absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#c67c4e] via-[#d8b79d] to-transparent" />

  {/* Glow */}
  <div className="pointer-events-none absolute -inset-1 bg-linear-to-r from-[#c67c4e]/5 to-[#b86c3d]/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />

  <button
    type="button"
    onClick={() => id && onOpenRestaurant?.(id)}
    className="text-left w-full"
  >

    {/* IMAGE (SMALLER ON MOBILE) */}
    <motion.div
      className="relative overflow-hidden bg-[#faf5ef] aspect-video sm:aspect-16/10"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={img || "https://placehold.co/640x400"}
        alt={restaurant?.name ?? "Restaurant"}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      {rating != null && (
        <span className="absolute right-2 top-2 sm:right-4 sm:top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] sm:text-xs font-black text-[#2d1f16] shadow-md">
          <StarIcon className="h-3 w-3 text-[#c67c4e]" />
          {rating}
        </span>
      )}
    </motion.div>

    {/* CONTENT (COMPACT) */}
    <div className="flex flex-1 flex-col p-3 sm:p-6">
      
      <h3 className="line-clamp-1 text-base sm:text-xl font-black text-[#2d1f16] group-hover:text-[#c67c4e]">
        {restaurant?.name ?? "Restaurant"}
      </h3>

      <div className="mt-1 sm:mt-2 flex items-center gap-2 text-[11px] sm:text-sm font-bold text-[#6f5a4b]">
        <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#f3e5d8] to-[#ead4c0] text-[#b86c3d]">
          <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <span className="line-clamp-1">{cityName}</span>
      </div>

      <div className="mt-2 sm:mt-4 flex flex-wrap gap-1 sm:gap-2 text-[11px] sm:text-sm">
        <span className="font-black text-[#2d1f16]">
          {restaurant?.foodType ?? "Multi-cuisine"}
        </span>
        <span className="font-medium text-[#a07d63]">
          • ₹{restaurant?.avgCostForOne ?? "—"} for one
        </span>
      </div>
    </div>
  </button>

  {/* BUTTON (SMALLER) */}
  <div className="mt-auto px-3 sm:px-5 pb-3 sm:pb-5">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        const restaurantId = restaurant?._id || restaurant?.id;
        if (restaurantId) onViewMenu?.(restaurantId);
      }}
      className="ui-btn-primary w-full rounded-lg sm:rounded-xl px-3 py-2 sm:py-3 font-bold text-sm"
      style={{ isolation: "isolate" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      View Menu
      <ArrowRightIcon className="h-4 w-4 ml-2 inline" />
    </button>
  </div>

</motion.article>
  );
}

export default memo(RestaurantCard);
