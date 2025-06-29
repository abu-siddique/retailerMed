import { createSlice, nanoid } from '@reduxjs/toolkit';


// Helper function to calculate free items for a single product
const calculateFreeQuantity = (item) => {
  if (item.buy && item.get && item.quantity >= item.buy) {
    return Math.floor(item.quantity / item.buy) * item.get;
  }
  return 0;
};
// Helper function to calculate item price (same as in cart_item.jsx)
const calculateItemPrice = (item) => {
  const priceAfterDiscount = item.ptr - (item.ptr * (item.discount / 100));
  const priceWithGst = priceAfterDiscount * (1 + (item.gst / 100));
  return priceWithGst * item.quantity;
};

// Helper function to calculate totals
const calculateTotals = (cartItems) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPriceToPay = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);

  // Calculate total MRP including free items
  const totalMRP = cartItems.reduce((sum, item) => 
    sum + (item.mrp * (item.quantity + (item.freeQuantity || 0))), 0);
  
  return { totalItems, totalPriceToPay, totalMRP };
};

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPriceToPay: 0,
  totalMRP: 0,
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
        existingItem.freeQuantity = calculateFreeQuantity(existingItem);
      } else {
        const newItem = {
          itemID: nanoid(),
          quantity: 1, // Default quantity
          ...action.payload,
        };
        newItem.freeQuantity = calculateFreeQuantity(newItem);
        state.cartItems.push(newItem);
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
      if (item){
        item.quantity += 1;
        item.freeQuantity = calculateFreeQuantity(item);
        Object.assign(state, calculateTotals(state.cartItems));
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.itemID === action.payload);
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1); // Never go below 1
        item.freeQuantity = calculateFreeQuantity(item);
        Object.assign(state, calculateTotals(state.cartItems));
      }
    },

    updateQuantity: (state, action) => {
      const { itemID, newQuantity } = action.payload;
      const item = state.cartItems.find(item => item.itemID === itemID);
      if (item && newQuantity >= 1) {
        item.quantity = newQuantity;
        item.freeQuantity = calculateFreeQuantity(item);
        Object.assign(state, calculateTotals(state.cartItems));
      }
    },

    // New action for direct quantity update (used in cart_buttons.jsx)
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.itemID === id);
      if (item && quantity >= 1) {
        item.quantity = Math.min(quantity, 1000); // Cap at 1000 to match MAX_QUANTITY constant
        item.freeQuantity = calculateFreeQuantity(item);
        Object.assign(state, calculateTotals(state.cartItems));
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPriceToPay = 0;
      state.totalMRP = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;