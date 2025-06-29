import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

// Create a context to expose the drawer navigation
export const DrawerContext = React.createContext(null)

// Custom tab bar icon component for consistent styling
const TabIcon = ({ name, IconComponent, color }) => {
  return (
    <IconComponent 
      name={name} 
      size={moderateScale(22)} 
      color={color} 
    />
  )
}

const TabsLayout = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const insets = useSafeAreaInsets()


// With this:
try {
  const componentModule = require('@/component');
  console.log('Path resolution successful:', Object.keys(componentModule));
} catch (error) {
  console.error('Path resolution failed:', error.message);
}
 
  
  return (
    <DrawerContext.Provider value={{ isOpen: drawerOpen, setOpen: setDrawerOpen }}>
      <Tabs  
        screenOptions={{
          tabBarActiveTintColor: '#1A237E',
          tabBarInactiveTintColor: '#64748B',
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: {
            ...styles.tabBar,
            height: moderateVerticalScale(60) + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarItemStyle: styles.tabItem,
          tabBarIconStyle: styles.tabIcon,
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
          tabBarPressColor: 'transparent', // Remove ripple effect on Android
          tabBarPressOpacity: 1, // Remove opacity change on iOS
          
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'feed',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="home" 
                IconComponent={Entypo} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="order_history"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="history" 
                IconComponent={MaterialIcons} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sheet"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="document-text-outline" 
                IconComponent={Ionicons} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="user" 
                IconComponent={FontAwesome} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </DrawerContext.Provider>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: moderateVerticalScale(6),
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    paddingVertical: moderateVerticalScale(3),
    borderRadius: 0, // Remove any default border radius
    margin: 0, // Remove any default margins
  },
  tabLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginTop: moderateVerticalScale(-3),
  },
  tabIcon: {
    marginBottom: 0,
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default TabsLayout