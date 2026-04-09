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
      className="group relative ui-card flex h-full flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
      whileHover={{ y: -8 }}
    >
      {/* Top Accent Line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-[#c67c4e] via-[#d8b79d] to-transparent opacity-100" />
      
      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute -inset-1 bg-linear-to-r from-[#c67c4e]/5 to-[#b86c3d]/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
      <button
        type="button"
        onClick={() => id && onOpenRestaurant?.(id)}
        className="text-left"
        aria-label={`Open ${restaurant?.name ?? "restaurant"} details`}
      >
        <motion.div
          className="relative aspect-16/10 overflow-hidden bg-[#faf5ef]"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <img
            src={img || "https://placehold.co/640x400/f3f4f6/9ca3af?text=Food"}
            alt={restaurant?.name ?? "Restaurant"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />
          {rating != null && (
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-black text-[#2d1f16] shadow-xl backdrop-blur-md border border-white/50">
              <StarIcon className="h-4 w-4 text-[#c67c4e]" />
              {rating}
            </span>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="line-clamp-1 text-xl font-black tracking-tight text-[#2d1f16] group-hover:text-[#c67c4e] transition-colors">
            {restaurant?.name ?? "Restaurant"}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[#6f5a4b]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-[#f3e5d8] to-[#ead4c0] text-[#b86c3d] group-hover:scale-110 transition-transform">
              <MapPinIcon className="h-4 w-4" />
            </div>
            <span className="line-clamp-1">{cityName}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-black text-[#2d1f16]">
              {restaurant?.foodType ?? "Multi-cuisine"}
            </span>
            <span className="text-sm font-medium text-[#a07d63]">
              • ₹{restaurant?.avgCostForOne ?? "—"} for one
            </span>
          </div>
        </div>
      </button>

      <div className="mt-auto px-4 pb-4 sm:px-5 sm:pb-5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const restaurantId = restaurant?._id || restaurant?.id;
            console.log("View Menu button clicked. Restaurant ID:", restaurantId);
            if (restaurantId) {
              onViewMenu?.(restaurantId);
            } else {
              console.warn("View Menu clicked but no ID found for:", restaurant?.name);
            }
          }}
          className="ui-btn-primary w-full rounded-xl! px-4! py-3! font-bold! relative z-50 cursor-pointer"
          style={{ isolation: 'isolate' }}
          className="ui-btn-primary w-full rounded-xl! px-4! py-2.5! font-semibold!"
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
