
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const existing = state.find(item => item._id === action.payload._id);
      if (existing) {
        existing.quantity += 1; // <-- increment quantity
      } else {
        state.push({ ...action.payload, quantity: 1 }); // <-- set initial quantity
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item._id !== action.payload);
    },
    updateQuantity: (state, action) => { // <-- new reducer
      const { id, quantity } = action.payload;
      const item = state.find(item => item._id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart: () => [],
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: [],
//   reducers: {
//     addToCart: (state, action) => {
//       state.push(action.payload);
//     },
//     removeFromCart: (state, action) => {
//       return state.filter(item => item._id !== action.payload);
//     },
//     clearCart: () => {
//       return [];
//     },
//   },
// });

// export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;