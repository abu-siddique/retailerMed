import { Icons } from '@/component'
import { router, Stack } from 'expo-router'
import { useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'

import { AuthWrapper, Button, CartInfo, CartItem, useUserInfo } from '@/component'
import { clearCart } from '@/component/store/slices/cart_slice'
import { formatNumber } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import EmptyCart from '../../svgs/empty-cart.svg'

export default function CartScreen() {
  // Get User Data
  const { userInfo, mustAuthAction } = useUserInfo()
  
  // Redux
  const dispatch = useDispatch()
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isClearCartModalVisible, setIsClearCartModalVisible] = useState(false)

  // Store
  const { cartItems, totalItems, totalPriceToPay, totalMRP } = useSelector(state => state.cart)
  const shippingCharges = totalPriceToPay < 2000 ? 50 : 0
  const amountSaved = totalMRP - totalPriceToPay

  // Handlers
  const handleRoute = () => {
    mustAuthAction(() => {
      router.push({ pathname: `/payment`, params: {} })
    })
  }
  
  const handleAddItems = () => {
    router.push('/') // Navigate to home or products page
  }
  
  const handleClearCart = () => {
    // Show confirmation modal instead of clearing immediately
    setIsClearCartModalVisible(true)
  }
  
  const confirmClearCart = () => {
    dispatch(clearCart())
    setIsClearCartModalVisible(false)
  }

  // Render
  return (
    <>
      <Stack.Screen
        options={{
          title: `My Cart(${totalItems})`,
          headerTitleStyle: {
            fontSize: Math.round(moderateScale(14)),
          },
          headerBackTitleVisible: false,
          headerShadowVisible:false,
          headerRight: () => (
            cartItems.length > 0 && amountSaved > 0 ? (
              <View style={styles.headerSavingsContainer}>
                <Icons.Ionicons name="pricetag" size={16} color="#22c55e" />
                <Text style={styles.headerSavingsText}>
                  ₹{formatNumber(amountSaved)} saved
                </Text>
              </View>
            ) : null
          ),
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
                  {/* Action buttons row */}
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity 
                      style={styles.addItemsButton}
                      onPress={handleAddItems}
                    >
                      <Icons.AntDesign name="pluscircleo" size={16} color="#4f46e5" />
                      <Text style={styles.addItemsText}>Add Items</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.clearCartButton}
                      onPress={handleClearCart}
                    >
                      <Icons.Ionicons name="trash-outline" size={16} color="#ef4444" />
                      <Text style={styles.clearCartText}>Clear Cart</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Thin separator line */}
                  <View style={styles.thinSeparator} />
                  
                 
                  {/* Cart Items */}
                  <View style={styles.itemsContainer}>
                    {cartItems.map(item => (
                      <CartItem item={item} key={item.itemID} />
                    ))}
                  </View>

                  {/* Cart info row */}
                  {/* <View style={styles.cartInfoRow}>
                    <Text style={styles.itemCountText}>{totalItems} items in cart</Text>
                    <View style={styles.savingsContainer}>
                      <Icons.Ionicons name="pricetag" size={16} color="#22c55e" />
                      <Text style={styles.savingsText}>
                        ₹{formatNumber(amountSaved)} saved
                      </Text>
                    </View>
                  </View> */}

                </View>
                
                {/* Cart Info section moved to modal */}
              </View>

            </ScrollView>
            
            {/* Checkout Footer */}
            <View style={styles.footer}>
              <View style={styles.footerPriceContainer}>
                <View style={styles.priceContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={styles.priceText}>{formatNumber(Math.round(totalPriceToPay + shippingCharges))}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <Text style={styles.viewDetailsText}>View Detailed Price</Text>
                </TouchableOpacity>
              </View>
              <Button 
                style={styles.checkoutButton} 
                textStyle={styles.buttonText}
                onPress={handleRoute}
              >
                Continue
              </Button>
            </View>
            
            {/* Cart Info Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}
              statusBarTranslucent={true}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Price Details</Text>
                    <TouchableOpacity 
                      onPress={() => setIsModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Icons.Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalScrollView}>
                    <CartInfo handleRoute={handleRoute} cart />
                  </ScrollView>
                </View>
              </View>
            </Modal>
            
            {/* Clear Cart Confirmation Modal */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={isClearCartModalVisible}
              onRequestClose={() => setIsClearCartModalVisible(false)}
            >
              <View style={styles.confirmModalOverlay}>
                <View style={styles.confirmModalContainer}>
                  <View style={styles.confirmModalContent}>
                    <Text style={styles.confirmModalTitle}>
                      Are you sure you want to clear your cart?
                    </Text>
                    <Text style={styles.confirmModalSubtitle}>
                      All items will be removed and this action cannot be undone.
                    </Text>
                  </View>
                  
                  <View style={styles.confirmModalButtons}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setIsClearCartModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={confirmClearCart}
                    >
                      <Text style={styles.confirmButtonText}>Clear Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </AuthWrapper>
    </>
  )
}

const styles = StyleSheet.create({
  // Header savings styles
  headerSavingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(10),
  },
  headerSavingsText: {
    fontSize: moderateScale(14),
    color: '#22c55e',
    marginLeft: moderateScale(4),
    fontWeight: '500',
  },
  
  // Confirmation Modal styles
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContainer: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    width: '80%',
    maxWidth: 400,
  },
  confirmModalContent: {
    marginBottom: verticalScale(20),
  },
  confirmModalTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  confirmModalSubtitle: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    textAlign: 'center',
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: '#d1d5db',
    flex: 1,
    marginRight: moderateScale(8),
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  confirmButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(6),
    backgroundColor: '#ef4444',
    flex: 1,
    marginLeft: moderateScale(8),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  
  // Styles for Title Section
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
  },
  addItemsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemsText: {
    fontSize: moderateScale(14),
    color: '#4f46e5',
    fontWeight: '500',
    marginLeft: moderateScale(6),
  },
  clearCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearCartText: {
    fontSize: moderateScale(14),
    color: '#ef4444',
    marginLeft: moderateScale(6),
  },
  thinSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
    marginVertical: verticalScale(8),
  },
  cartInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(10),
  },
  itemCountText: {
    fontSize: moderateScale(14),
    color: '#4b5563',
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
  },
  savingsText: {
    fontSize: moderateScale(14),
    color: '#22c55e',
    marginLeft: moderateScale(4),
    fontWeight: '500',
  },
  
  // Keep all existing styles
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
    gap: verticalScale(2),
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
    // borderTopWidth: StyleSheet.hairlineWidth,
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
  footerPriceContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontWeight: '500',
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(2),
  },
  priceText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  currency: {
    marginRight: moderateScale(2),
    fontSize: moderateScale(14),
  },
  checkoutButton: {
    width: '50%',
  },
  buttonText: {
    fontSize: moderateScale(14),
  },
  viewDetailsText: {
    color: '#4b5563',
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    padding: 0,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5', // Indigo color
    paddingVertical: verticalScale(14),
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    position: 'relative',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    position: 'absolute',
    right: moderateScale(12),
    padding: moderateScale(4),
  },
  modalScrollView: {
    maxHeight: '100%',
    padding: moderateScale(16),
  }
})