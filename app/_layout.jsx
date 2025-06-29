import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { store } from '../component/store';


const persistor = persistStore(store)



const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          {/* <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />

          </GestureHandlerRootView> */}
          <Stack >
            <Stack.Screen
              name="(main)/(tabs)"
              options={{
                headerShown: false,
              }}
            />
            
          </Stack>
          
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  )
}

export default RootLayout