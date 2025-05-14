import { useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'

import { formatNumber } from '@/utils'
import { Platform } from 'react-native'
import Logo from '../svgs/logo.svg'
import Icons from './common/icons'
import Search from './search'

export default function FeedHeader() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { totalItems } = useSelector(state => state.cart)

  const handleNavigation = (path) => router.push(path)

  return (
    <GestureHandlerRootView>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.mainHeader}>
          {/* Drawer Button and Logo */}
          <View style={styles.logoWrapper}>
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={styles.menuButton}
            >
              <Icons.MaterialIcons 
                name="menu" 
                size={moderateScale(24)} 
                color="#1A237E" 
              />
            </TouchableOpacity>
            <Logo
              width={moderateScale(120)}
              height={moderateVerticalScale(40)}
              style={styles.logo}
            />
          </View>

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

        {/* Search Bar */}
        <Search 
          placeholder="Search medicines or health products..." 
        />
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(16),
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
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  menuButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  logo: {
    marginLeft: moderateScale(8),
  },
  cartButton: {
    position: 'relative',
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    backgroundColor: '#FFFFFF',
    borderWidth: moderateScale(1),
    borderColor: '#E0E0E0',
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
})