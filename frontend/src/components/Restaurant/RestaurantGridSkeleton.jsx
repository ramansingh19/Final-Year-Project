import { memo } from "react";
import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0.6 },
  show: (i) => ({
    opacity: 1,
    transition: { delay: i * 0.06 },
  }),
};

function RestaurantGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={item}
          initial="hidden"
          animate="show"
          className="ui-card overflow-hidden"
        >
          <div className="aspect-16/10 animate-skeleton-shimmer" />
          <div className="space-y-4 p-6">
            <div className="h-6 w-3/4 animate-skeleton-shimmer rounded-xl" />
            <div className="h-4 w-1/2 animate-skeleton-shimmer rounded-lg" />
            <div className="h-12 w-full animate-skeleton-shimmer rounded-2xl" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default memo(RestaurantGridSkeleton);
