import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  removeFromCart,
  updateCartQty,
  selectCartTotal,
} from "../../features/user/cartSlice";

function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-950"
    >
      <div className="border-b border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your cart
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review items before checkout
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-300">Your cart is empty</p>
            <Link
              to="/RestaurantLandingPage"
              className="mt-4 inline-block text-orange-600 hover:underline dark:text-orange-400"
            >
              Browse restaurants
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((line) => (
              <li
                key={line.cartLineId}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <img
                  src={line.image || "https://placehold.co/120/f3f4f6/9ca3af?text=+"}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {line.name}
                  </p>
                  {line.restaurantName ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {line.restaurantName}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm font-medium text-orange-600 dark:text-orange-400">
                    ₹{line.price} each
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateCartQty({
                            cartLineId: line.cartLineId,
                            qty: line.qty - 1,
                          })
                        )
                      }
                      className="rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateCartQty({
                            cartLineId: line.cartLineId,
                            qty: line.qty + 1,
                          })
                        )
                      }
                      className="rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(removeFromCart(line.cartLineId))
                      }
                      className="ml-auto text-sm text-red-600 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold text-gray-900 dark:text-white">
                  ₹{(line.price * line.qty).toFixed(0)}
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Checkout can be connected to payments in a later step.
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 py-3.5 text-sm font-semibold text-white opacity-90"
              disabled
            >
              Place order (coming soon)
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CartPage;
