import {
    AuthWrapper,
    Button,
    CartInfo,
    HandleResponse,
    Icons,
    ResponsiveImage,
    useUserInfo
} from '@/component'
import { formatNumber } from '@/utils'
import { Link, Stack, router } from 'expo-router'
import { useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { RadioButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import Toast from 'react-native-toast-message'
import { useDispatch, useSelector } from 'react-redux'
import { useCreateOrderMutation } from '../component/services'
import { clearCart } from '../component/store'

export default function PaymentScreen() {
  // Assets
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()

  // Get User Data
  const { userInfo } = useUserInfo()

  // States
  const [paymentMethod, setPaymentMethod] = useState('Online Payment')

  // Store
  const { cartItems, totalItems, totalDiscount, totalPrice } = useSelector(state => state.cart)

  // Create Order Query
  const [postData, { data, isSuccess, isError, isLoading, error }] = useCreateOrderMutation()

  // Handlers
  const handleCreateOrder = () => {
    if (
      !userInfo?.address?.city &&
      !userInfo?.address?.province &&
      !userInfo?.address?.area &&
      !userInfo?.address?.street &&
      !userInfo?.address?.postalCode
    )
      return Toast.show({
        type: 'error',
        text2: 'Please fill in your address',
      })
    else
      postData({
        body: {
          address: {
            city: userInfo.address.city.name,
            area: userInfo.address.area.name,
            postalCode: userInfo.address.postalCode,
            provinces: userInfo.address.province.name,
            street: userInfo.address.street,
          },
          mobile: userInfo.mobile,
          cart: cartItems,
          totalItems,
          totalPrice,
          totalDiscount,
          paymentMethod,
        },
      })
  }

  // Local Components
  const ChangeAddress = ({ addressModalProps }) => {
    const BasicChangeAddress = ({ addressModalProps }) => {
      const { openAddressModal } = addressModalProps || {}
      return (
        <Pressable onPress={openAddressModal} style={styles.changeAddressButton}>
          <Icons.AntDesign name="right" size={scale(16)} style={styles.changeAddressIcon} />
        </Pressable>
      )
    }

    return (
      <View>
        <BasicChangeAddress />
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Checkout',
          headerBackTitleVisible: false,
        }}
      />
      {/* Handle Create Order Response */}
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error?.data?.message}
          message={data?.message}
          onSuccess={() => {
            dispatch(clearCart())
            router.push('/profile')
          }}
        />
      )}
      <AuthWrapper>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.contentContainer}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <View style={styles.headerSteps}>
                  <Link href="/cart" asChild>
                    <Pressable style={styles.step}>
                      <Icons.AntDesign
                        name="shoppingcart"
                        size={scale(18)}
                        style={styles.cartIcon}
                      />
                      <Text style={styles.stepText}>Cart</Text>
                    </Pressable>
                  </Link>

                  <View style={styles.stepDivider} />
                  <View style={styles.step}>
                    <Icons.AntDesign
                      name="wallet"
                      size={scale(16)}
                      style={styles.paymentIcon}
                    />
                    <Text style={styles.activeStepText}>Payment</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Address */}
              <View style={styles.addressContainer}>
                <Icons.Entypo name="location" size={scale(16)} style={styles.locationIcon} />
                {userInfo?.address ? (
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressText}>{userInfo?.address?.street}</Text>
                    <Text style={styles.nameText}>{userInfo?.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.addressText}>Add Address</Text>
                )}
                <ChangeAddress />
              </View>
              <View style={styles.divider} />

              {/* Products */}
              <View style={styles.productsContainer}>
                <View style={styles.shippingInfo}>
                  <Image
                    source={require('@/assets/images/car.png')}
                    style={styles.shippingIcon}
                    alt="shipping icon"
                  />
                  <View>
                    <Text style={styles.shippingTitle}>Standard Shipping</Text>
                    <Text style={styles.shippingSubtitle}>In Stock</Text>
                  </View>
                  <View style={styles.itemCount}>
                    <Text style={styles.itemCountText}>{formatNumber(totalItems)} items</Text>
                  </View>
                </View>
                <View style={styles.productsGrid}>
                    {console.log('cartitesm: ',cartItems)}
                  {cartItems.map(item => (
                    <View key={item.itemID} style={styles.productItem}>
                      <ResponsiveImage
                        dimensions="w-28 h-28"
                        imageStyles={styles.productImage}
                        source={item.img.url}
                        alt={item.name}
                      />

                      {item.color && (
                        <View style={styles.colorInfo}>
                          <View
                            style={[styles.colorSwatch, { backgroundColor: item.color.hashCode }]}
                          />
                          <Text style={styles.colorText}>{item.color.name}</Text>
                        </View>
                      )}

                      {item.size && (
                        <View style={styles.sizeInfo}>
                          <Icons.MaterialIcons name="rule" size={scale(20)} style={styles.sizeIcon} />
                          <Text style={styles.sizeText}>{item.size.size}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <Link href="/checkout/cart" style={styles.backToCart}>
                  <Text style={styles.backToCartText}>Back to Cart</Text>
                </Link>
              </View>

              <View style={styles.divider} />

              {/* Cart Info */}
              <View style={styles.cartInfoContainer}>
                <CartInfo />
                <View style={styles.paymentMethods}>
                  <RadioButton.Group
                    onValueChange={value => setPaymentMethod(value)}
                    value={paymentMethod}
                  >
                    <RadioButton.Item label="Online Payment" value="Online Payment" />
                    <RadioButton.Item label="Bank Card" value="Bank Card" />
                  </RadioButton.Group>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={[styles.footer, { bottom: insets.bottom }]}>
            <Button
              onPress={handleCreateOrder}
              isLoading={isLoading}
              style={styles.checkoutButton}
            >
              Complete Purchase
            </Button>
          </View>
        </View>
      </AuthWrapper>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: verticalScale(8),
    gap: verticalScale(12),
  },
  headerContainer: {
    paddingVertical: verticalScale(8),
  },
  headerSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  step: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: verticalScale(8),
  },
  stepText: {
    fontFamily: 'normal',
    color: '#fca5a5',
  },
  activeStepText: {
    fontSize: moderateScale(16),
    fontFamily: 'normal',
    color: '#ef4444',
  },
  stepDivider: {
    height: 1,
    width: scale(32),
    backgroundColor: '#fca5a5',
  },
  cartIcon: {
    color: '#fca5a5',
  },
  paymentIcon: {
    width: scale(24),
    height: scale(24),
    color: '#ef4444',
  },
  divider: {
    height: verticalScale(8),
    backgroundColor: '#f3f4f6',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(16),
    gap: scale(12),
  },
  locationIcon: {
    color: '#000',
  },
  addressDetails: {
    gap: verticalScale(4),
  },
  addressText: {
    color: '#000',
  },
  nameText: {
    fontSize: moderateScale(14),
    color: '#525252',
  },
  changeAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  changeAddressIcon: {
    color: '#0ea5e9',
  },
  productsContainer: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(16),
    marginHorizontal: scale(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: moderateScale(8),
  },
  shippingInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  shippingIcon: {
    width: scale(40),
    height: scale(40),
    marginRight: scale(16),
  },
  shippingTitle: {
    fontSize: moderateScale(16),
    color: '#000',
  },
  shippingSubtitle: {
    color: '#525252',
  },
  itemCount: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    marginLeft: scale(12),
    backgroundColor: '#f3f4f6',
    borderRadius: moderateScale(8),
    alignSelf: 'center',
  },
  itemCountText: {
    color: '#525252',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gapHorizontal: scale(32),
    gapVertical: verticalScale(20),
  },
  productItem: {
    // Styles for product item container
  },
  productImage: {
    width: scale(112),
    height: scale(112),
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginLeft: scale(12),
    marginTop: verticalScale(6),
  },
  colorSwatch: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  colorText: {
    // Add text styles if needed
  },
  sizeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  sizeIcon: {
    color: '#000',
  },
  sizeText: {
    // Add text styles if needed
  },
  backToCart: {
    marginTop: verticalScale(24),
  },
  backToCartText: {
    fontSize: moderateScale(14),
    color: '#0ea5e9',
  },
  cartInfoContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: moderateScale(8),
  },
  paymentMethods: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    gap: verticalScale(12),
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButton: {
    width: '100%',
    maxWidth: scale(640),
    marginHorizontal: 'auto',
  },
})