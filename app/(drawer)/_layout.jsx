import { createDrawerNavigator } from '@react-navigation/drawer';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import CustomDrawerContent from '../../component/drawer_content';

// Content component that renders tabs content
function DrawerHomeContent() {
  return (
    <View style={styles.container}>
      <Redirect href="/(main)/(tabs)" />
    </View>
  );
}

export default function DrawerLayout() {
  const Drawer = createDrawerNavigator();
  
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          animation: 'none',
        }}
      />
      <Drawer.Navigator
        initialRouteName="index"
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            width: '85%',
            backgroundColor: '#FFFFFF',
          },
          overlayColor: 'rgba(0,0,0,0.6)',
          swipeEnabled: true,
          drawerType: 'front',
          drawerStatusBarAnimation: 'fade',
          lazy: false,
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        backBehavior="initialRoute"
      >
        <Drawer.Screen 
          name="index" 
          component={DrawerHomeContent} 
          options={{ 
            title: 'Home',
            unmountOnBlur: false,
          }} 
        />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});