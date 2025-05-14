import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  lastSeen: [],
  userData: null,
};

const MAX_LAST_SEEN_ITEMS = 15;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    userLogout: (state) => {
      state.token = '';
      state.userData = null;
    },
    addToLastSeen: (state, action) => {
      const existingIndex = state.lastSeen.findIndex(
        item => item.productID === action.payload.productID
      );
      if (existingIndex !== -1) state.lastSeen.splice(existingIndex, 1);
      state.lastSeen.unshift(action.payload);
      if (state.lastSeen.length > MAX_LAST_SEEN_ITEMS) state.lastSeen.pop();
    },
    clearLastSeen: (state) => {
      state.lastSeen = [];
    },
    updateUserProfile: (state, action) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
  },
});

export const {
  userLogin,
  userLogout,
  addToLastSeen,
  clearLastSeen,
  updateUserProfile,
} = userSlice.actions;

// Selectors
export const selectAuthToken = (state) => state.user.token;
export const selectLastSeenItems = (state) => state.user.lastSeen;
export const selectUserData = (state) => state.user.userData;
export const selectApprovalStatus = (state) => 
  state.user.userData?.approvalStatus || 'not-submitted';

export default userSlice.reducer;