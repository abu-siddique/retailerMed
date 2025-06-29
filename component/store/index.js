import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer } from 'redux-persist';
import storage from '../../utils/storage';

//? Reducers
import cartReducer from './slices/cart_slice';
import userReducer from './slices/user_slice';

import apiSlice from '../services/api';


//? Actions
export * from './slices/cart_slice';
export * from './slices/user_slice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
}

// API persist configuration with whitelist of specific endpoints to cache
const apiPersistConfig = {
  key: 'api',
  version: 1,
  storage: storage,
  // Only persist specific endpoints (replace with your endpoint names)
  whitelist: ['getProducts', 'getCategories'],
}

const cartPersistedReducer = persistReducer(persistConfig, cartReducer)
const userPersistedReducer = persistReducer(persistConfig, userReducer)
const apiPersistedReducer = persistReducer(apiPersistConfig, apiSlice.reducer)




export const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    cart: cartPersistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
})


setupListeners(store.dispatch);
