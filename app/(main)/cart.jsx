import { router, Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'

import { AuthWrapper, Button, CartInfo, CartItem, useUserInfo } from '@/component'
import { formatNumber } from '@/utils'
import { useSelector } from 'react-redux'
import EmptyCart from '../../svgs/empty-cart.svg'

export default function CartScreen() {
  // Get User Data
  const { userInfo, mustAuthAction } = useUserInfo()

  // Store
  const { cartItems, totalItems, totalPriceToPay, totalMRP } = useSelector(state => state.cart)

  // Handlers
  const handleRoute = () => {
    mustAuthAction(() => {
      router.push({ pathname: `/payment`, params: {} })
    })
  }

  // Render
  return (
    <>
      <Stack.Screen
        options={{
          title: `Cart (${cartItems.length} items)`,
          headerBackTitleVisible: false,
        }}
      />
      <AuthWrapper>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyContent}>
              <EmptyCart style={styles.emptyImage} />
              <Text style={styles.emptyText}>Your cart is empty!</Text>
            </View>
          </View>
        ) : (
          <>
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.contentContainer}>
                {/* Title Section */}
                <View style={styles.titleContainer}>
                  <View style={styles.titleRow}>
                    <View>
                      <Text style={styles.cartTitle}>Your Shopping Cart</Text>
                    </View>
                    <Text>{formatNumber(totalItems)} items</Text>
                    <Text>{formatNumber(totalItems)} Total Savings</Text>
                  </View>

                  {/* Cart Items */}
                  <View style={styles.itemsContainer}>
                    {cartItems.map(item => (
                      <CartItem item={item} key={item.itemID} />
                    ))}
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                {/* Cart Info */}
                <View>
                  <CartInfo handleRoute={handleRoute} cart />
                </View>
              </View>
            </ScrollView>
            
            {/* Checkout Footer */}
            <View style={styles.footer}>
              <View>
                <Text style={styles.footerText}>Cart Total</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>{formatNumber(totalPriceToPay)}</Text>
                  <Text style={styles.currency}>₹</Text>
                </View>
              </View>
              <Button 
                style={styles.checkoutButton} 
                textStyle={styles.buttonText}
                onPress={handleRoute}
              >
                Continue
              </Button>
            </View>
          </>
        )}
      </AuthWrapper>
    </>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContent: {
    paddingVertical: verticalScale(80),
    alignItems: 'center',
  },
  emptyImage: {
    height: moderateScale(208),
    width: moderateScale(208),
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: verticalScale(12),
  },
  scrollContainer: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(80),
    gap: verticalScale(12),
  },
  titleContainer: {
    minHeight: verticalScale(40),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
  },
  cartTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  itemsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  divider: {
    height: verticalScale(8),
    backgroundColor: '#f3f4f6',
  },
  footer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerText: {
    fontWeight: '300',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: moderateScale(12),
  },
  currency: {
    marginLeft: moderateScale(4),
    backgroundColor: '#f3f4f6',
  },
  checkoutButton: {
    width: '50%',
  },
  buttonText: {
    fontSize: moderateScale(14),
  },
})
