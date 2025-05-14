import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { Platform } from 'react-native';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//? Reducers
import cartReducer from './slices/cart_slice';
import userReducer from './slices/user_slice';

import apiSlice from '../services/api';


const persistConfig = {
  key: 'root',
  version: 1,
  storage: Platform.OS === 'web' ? storage : AsyncStorage,
}

const cartPersistedReducer = persistReducer(persistConfig, cartReducer)
const userPersistedReducer = persistReducer(persistConfig, userReducer)

//? Actions
export * from './slices/cart_slice';
export * from './slices/user_slice';


export const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    cart: cartPersistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),

    devTools: true
})

setupListeners(store.dispatch)
