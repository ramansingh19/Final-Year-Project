import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const {
        foodId,
        name,
        price,
        image,
        restaurantId,
        restaurantName,
        qty = 1,
      } = action.payload;
      if (!foodId) return;
      const existing = state.items.find((i) => i.foodId === foodId);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          cartLineId: `${foodId}-${Date.now()}`,
          foodId,
          name,
          price: Number(price) || 0,
          image: image || "",
          restaurantId: restaurantId || "",
          restaurantName: restaurantName || "",
          qty,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => i.cartLineId !== action.payload
      );
    },
    updateCartQty: (state, action) => {
      const { cartLineId, qty } = action.payload;
      const item = state.items.find((i) => i.cartLineId === cartLineId);
      if (!item) return;
      if (qty <= 0) {
        state.items = state.items.filter((i) => i.cartLineId !== cartLineId);
      } else {
        item.qty = qty;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartQty, clearCart } =
  cartSlice.actions;

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export default cartSlice.reducer;
