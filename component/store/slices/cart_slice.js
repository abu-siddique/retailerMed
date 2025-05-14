import { createSlice, nanoid } from '@reduxjs/toolkit';

// Helper function to calculate totals
const calculateTotals = (cartItems) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (item.discount || 0 * item.quantity), 0);
  
  return { totalItems, totalPrice, totalDiscount };
};

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  totalDiscount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productID } = action.payload;
      const existingItem = state.cartItems.find(item => item.productID === productID);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          itemID: nanoid(),
          quantity: 1, // Default quantity
          ...action.payload
        });
      }
      
      // Update all totals
      Object.assign(state, calculateTotals(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.itemID !== action.payload);
      Object.assign(state, calculateTotals(state.cartItems));
    },

    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.itemID === action.payload);
      if (item) item.quantity += 1;
      Object.assign(state, calculateTotals(state.cartItems));
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.itemID === action.payload);
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1); // Never go below 1
        Object.assign(state, calculateTotals(state.cartItems));
      }
    },

    updateQuantity: (state, action) => {
      const { itemID, newQuantity } = action.payload;
      const item = state.cartItems.find(item => item.itemID === itemID);
      if (item && newQuantity >= 1) {
        item.quantity = newQuantity;
        Object.assign(state, calculateTotals(state.cartItems));
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.totalDiscount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;