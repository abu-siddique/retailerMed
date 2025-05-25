import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, Platform, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { getPersistor, store } from '../component/store';

// Prevent SMS retriever related errors in Expo environment
if (Platform.OS === 'android') {
  // Create a complete mock for SMS retriever to prevent errors
  const mockSmsRetriever = {
    removeAllListeners: () => {},
    requestPhoneNumber: () => Promise.resolve(null),
    startOtpListener: () => Promise.resolve(null),
    stopOtpListener: () => Promise.resolve(null),
    request: () => Promise.resolve(),
    SMS: {
      startRetriever: () => Promise.resolve({ message: null }),
      stopRetriever: () => Promise.resolve()
    }
  };
  
  // Add this mock to global for app-wide access
  global.SMS_MODULE = mockSmsRetriever;
}

// Platform detection for conditional persistence
const isBrowser = typeof window !== 'undefined';
const isNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const shouldPersist = isBrowser || isNative;

// Create persistor using our safe method
const persistor = getPersistor();

// Loading component for PersistGate
const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Loading...</Text>
  </View>
);

// Error Boundary component for PersistGate
const SafePersistGate = ({ children, loading }) => {
  const [error, setError] = useState(false);

  // Reset error state when app comes to foreground
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active') {
          setError(false);
        }
      });
      
      return () => {
        subscription.remove();
      };
    }
    
    return undefined;
  }, []);

  // If persistence isn't supported or fails, render children without PersistGate
  if (error || !shouldPersist) {
    return children;
  }

  return (
    <PersistGate 
      loading={loading} 
      persistor={persistor}
      onError={(err) => {
        console.warn('PersistGate error:', err);
        setError(true);
      }}
    >
      {children}
    </PersistGate>
  );
};

const RootLayout = () => {
  return (
    <Provider store={store}>
      <SafePersistGate loading={<LoadingComponent />}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
          </GestureHandlerRootView>
          <Toast />
        </SafeAreaProvider>
      </SafePersistGate>
    </Provider>
  )
}

export default RootLayout