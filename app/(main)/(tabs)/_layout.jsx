import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
const TabsLayout = () => {
  return (
    <Tabs  
    screenOptions={{
        tabBarActiveTintColor: '#000000',
      }}>
        <Tabs.Screen
            name="index"
            options={{
            title: 'feed',
            tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
            }}
        />
        <Tabs.Screen
            name="order_history"
            options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />,
            }}
        />
        <Tabs.Screen
            name="sheet"
            options={{
            tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />,
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
            tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
            }}
        />
    </Tabs>
  )
}

export default TabsLayout