import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cross-platform storage implementation for Redux Persist
 * Uses AsyncStorage for React Native and localStorage for web
 */

// Safer platform detection that runs at module initialization time
const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

// For SSR safety, create storage implementation only when needed
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
  getAllKeys: () => Promise.resolve([]),
  clear: () => Promise.resolve(),
  // Required by redux-persist v6
  _getRequests: [],
  _setRequests: []
});

// Web localStorage with Promise-based API for Redux Persist
const createWebStorage = () => {
  if (!canUseDOM) {
    return createNoopStorage();
  }
  
  return {
    getItem: (key) => {
      return new Promise((resolve) => {
        resolve(localStorage.getItem(key));
      });
    },
    setItem: (key, item) => {
      return new Promise((resolve) => {
        resolve(localStorage.setItem(key, item));
      });
    },
    removeItem: (key) => {
      return new Promise((resolve) => {
        resolve(localStorage.removeItem(key));
      });
    },
    getAllKeys: () => {
      return new Promise((resolve) => {
        resolve(Object.keys(localStorage));
      });
    },
    clear: () => {
      return new Promise((resolve) => {
        resolve(localStorage.clear());
      });
    }
  };
};

// Function to get the correct storage for the current platform
const getStorage = () => {
  // Use try-catch to handle any unexpected errors during platform detection
  try {
    // React Native environment
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      return AsyncStorage;
    }
    
    // Web environment
    if (canUseDOM) {
      return createWebStorage();
    }
  } catch (err) {
    console.warn('Failed to initialize storage:', err);
  }
  
  // Fallback to noop storage if platform detection fails
  return createNoopStorage();
};

// Export the appropriate storage implementation
const storage = getStorage();

export default storage;