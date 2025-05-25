import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';

// Import our custom cross-platform storage
import storage from '../../utils/storage';

//? Reducers
import cartReducer from './slices/cart_slice';
import userReducer from './slices/user_slice';

import apiSlice from '../services/api';

// Platform detection for conditional persistence
const isBrowser = typeof window !== 'undefined';
const isNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const shouldPersist = isBrowser || isNative;

// Custom transform to handle serialize/deserialize safely
const safeTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState, key) => {
    try {
      return inboundState;
    } catch (err) {
      console.warn('Error serializing state', err);
      return undefined;
    }
  },
  // transform state being rehydrated
  (outboundState, key) => {
    try {
      return outboundState;
    } catch (err) {
      console.warn('Error deserializing state', err);
      return undefined;
    }
  }
);

// Configure persistence based on environment
const persistConfig = {
  key: 'root',
  version: 1,
  storage, // Using our cross-platform storage solution
  // Skip persistence in certain scenarios to avoid errors
  timeout: 10000, // Increase timeout for slower devices
  transforms: [safeTransform],
  // Safe error handling
  writeFailHandler: (err) => {
    // Just log the error without interrupting the app flow
    console.warn('Redux persist write failure (non-critical):', err.message || err);
    return null;
  },
  // Customize blacklist/whitelist based on your app's needs
  blacklist: shouldPersist ? [] : ['user', 'cart'] // Skip persistence entirely when not in browser/native
};

// Allow individual reducers to fail without breaking the app
const makeSafePersistReducer = (reducer, config) => {
  // Skip persistence entirely when not in browser/native
  if (!shouldPersist) {
    return reducer;
  }
  
  try {
    return persistReducer(config, reducer);
  } catch (err) {
    console.warn(`Error setting up persist for reducer: ${err.message}`);
    return reducer; // Fallback to non-persisted reducer
  }
};

// Create persisted reducers safely
const cartPersistedReducer = makeSafePersistReducer(cartReducer, {
  ...persistConfig,
  key: 'cart' // Use individual keys for each reducer
});

const userPersistedReducer = makeSafePersistReducer(userReducer, {
  ...persistConfig,
  key: 'user' // Use individual keys for each reducer
});

//? Actions
export * from './slices/cart_slice';
export * from './slices/user_slice';

// Configure Redux DevTools
const devToolsOptions = {
  name: 'RetailerMed',
  trace: process.env.NODE_ENV === 'development',
  traceLimit: 25
};

// Create the store with enhanced error handling
export const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    cart: cartPersistedReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: { 
        warnAfter: 300,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // Increase thunk timeout for slower devices
      immutableCheck: { warnAfter: 300 },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production' ? devToolsOptions : false,
});

// Export persistor with error handling
export const getPersistor = () => {
  // Skip persistence entirely when not in browser/native
  if (!shouldPersist) {
    return {
      getState: () => ({}),
      subscribe: () => () => {},
      dispatch: store.dispatch,
    };
  }
  
  try {
    return persistStore(store);
  } catch (err) {
    console.warn('Failed to create persistor:', err);
    // Return a dummy persistor that won't break the app
    return {
      getState: () => ({}),
      subscribe: () => () => {},
      dispatch: store.dispatch,
    };
  }
};

setupListeners(store.dispatch);
