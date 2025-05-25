import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, Image, Modal, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'

import { formatNumber } from '@/utils'
import { Platform } from 'react-native'
import Icons from './common/icons'
import CustomDrawerContent from './drawer_content'
import Search from './search'

const { width } = Dimensions.get('window');
// Setting drawer width to 70% of screen width with a minimum size
const DRAWER_WIDTH = Math.max(width * 0.7, 280);

export default function FeedHeader({ title }) {
  const insets = useSafeAreaInsets()
  const { totalItems } = useSelector(state => state.cart)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const translateX = new Animated.Value(-DRAWER_WIDTH)
  const fadeAnim = new Animated.Value(0)
  
  useEffect(() => {
    if (drawerVisible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [drawerVisible]);
  
  const handleNavigation = (path) => router.push(path)
  
  const handleOpenDrawer = () => {
    setDrawerVisible(true)
  }

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
  }

  const handleCallPress = () => {
    // Implement phone call functionality here
    console.log('Call button pressed')
  }

  const handleNotificationPress = () => {
    // Implement notification functionality here
    console.log('Notification button pressed')
  }

  return (
    <GestureHandlerRootView style={{backgroundColor: '#FFFFFF'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.mainHeader}>
          {/* Drawer Button and Logo */}
          <View style={styles.logoWrapper}>
            <TouchableOpacity
              onPress={handleOpenDrawer}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <Icons.MaterialIcons 
                name="menu" 
                size={moderateScale(24)} 
                color="#1A237E" 
              />
            </TouchableOpacity>
            <Image
              source={require('../svgs/medclavis_logo_laptop.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            {title && <Text style={styles.headerTitle}>{title}</Text>}
          </View>

          {/* Action Icons */}
          <View style={styles.actionIcons}>
            {/* Call Icon */}
            <TouchableOpacity
              onPress={handleCallPress}
              style={styles.iconButton}
            >
              <Icons.MaterialIcons 
                name="phone" 
                size={moderateScale(24)} 
                color="#1A237E" 
              />
            </TouchableOpacity>

            {/* Notification Icon */}
            <TouchableOpacity
              onPress={handleNotificationPress}
              style={styles.iconButton}
            >
              <Icons.MaterialIcons 
                name="notifications" 
                size={moderateScale(24)} 
                color="#1A237E" 
              />
            </TouchableOpacity>

            {/* Cart Icon */}
            <Pressable
              onPress={() => handleNavigation('/cart')}
              style={styles.cartButton}
            >
              <Icons.AntDesign 
                name="shoppingcart" 
                size={moderateScale(24)} 
                color="#1A237E" 
              />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {formatNumber(totalItems)}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search 
            placeholder="Search medicines or health products..." 
          />
        </View>
      </View>

      {/* Animated Custom Drawer */}
      <Modal
        visible={drawerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseDrawer}
      >
        <View style={styles.drawerContainer}>
          {/* Drawer positioned at left side first, then overlay */}
          <Animated.View 
            style={[
              styles.drawerContent,
              { transform: [{ translateX }] }
            ]}
          >
            <CustomDrawerContent 
              navigation={{
                closeDrawer: handleCloseDrawer,
                navigate: (path) => {
                  handleCloseDrawer();
                  setTimeout(() => router.push(path), 300);
                }
              }}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.overlay, 
              { opacity: fadeAnim }
            ]}
          >
            <TouchableOpacity 
              style={{ width: '100%', height: '100%' }}
              activeOpacity={1} 
              onPress={handleCloseDrawer}
            />
          </Animated.View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateVerticalScale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { 
          width: 0, 
          height: moderateScale(2) 
        },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(6),
      },
      android: {
        elevation: 8,
      },
    }),
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateVerticalScale(12),
    marginTop: moderateVerticalScale(4),
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0, // Removed gap to make logo stick to menu icon
  },
  menuButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  logo: {
    width: scale(30), // Using scale for responsive width
    height: moderateVerticalScale(50), // Using moderateVerticalScale for responsive height
    marginLeft: 0, // Removed margin to make logo stick to menu icon
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  iconButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  cartButton: {
    position: 'relative',
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    backgroundColor: '#FFFFFF',
    // Removed borderWidth and borderColor
  },
  searchContainer: {
    marginBottom: moderateVerticalScale(8),
  },
  badge: {
    position: 'absolute',
    top: moderateVerticalScale(-6),
    right: moderateVerticalScale(-6),
    backgroundColor: '#FF5252',
    borderRadius: moderateScale(20),
    minWidth: moderateScale(20),
    height: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: moderateScale(1.5),
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(12),
    fontWeight: '700',
    paddingHorizontal: moderateScale(4),
  },
  drawerContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#1A237E',
  },
})