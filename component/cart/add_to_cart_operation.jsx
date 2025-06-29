import { existItem } from '@/utils';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../common/button';
import QuantityModal from '../common/quantity_modal';
import useUserInfo from '../hooks/use_user_info';
import useVerify from '../hooks/use_verify';
import { addToCart } from '../store';
import CartButtons from './cart_buttons';

const AddToCartOperation = ({ product }) => {
  // Redux state
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  
  // Local state
  const [currentItemInCart, setCurrentItemInCart] = useState(undefined);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  // User authentication
  const { mustAuthAction } = useUserInfo();

  const isVerify = useVerify();

  // Track item in cart
  useEffect(() => {
    // Debug logging to identify inconsistencies
  console.log('Product ID:', product._id);
  console.log('Cart Items:', cartItems);
    const item = existItem(cartItems, product._id);
    console.log('Found in cart:', !!item);
    setCurrentItemInCart(item);
  }, [cartItems, product._id]);

  // Handle opening the quantity modal
  const handleAddItemClick = () => {
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200); // Reset button state after animation
    
    // Remove authentication check, allow direct adding to cart
    if (product.inStock === 0) {
      return Toast.show({
        type: 'error',
        text1: 'Out of Stock',
        text2: 'This product is currently unavailable',
      });
    }
    
    // Open the quantity modal
    setSelectedQuantity(1);
    setModalVisible(true);
  };
  
  // Handle adding item to cart with selected quantity
  const handleAddToCart = (quantity) => {
    dispatch(
      addToCart({
        productID: product._id,
        name: product.title,
        ptr: product.ptr,
        mrp: product.mrp,
        discount: product.discount,
        buy: product.buy,
        get: product.get,
        gst: product.gst,
        inStock: product.inStock,
        sold: product.sold,
        img: product.images[0],
        quantity: quantity,
      })
    );
    
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${quantity} ${quantity > 1 ? 'units' : 'unit'} of ${product.title} added to your cart`,
      visibilityTime: 2000,
    });
  };

  return (
    <View style={styles.container}>
      {currentItemInCart ? (
        <View style={styles.cartButtonsContainer}>
          <CartButtons item={currentItemInCart} />
        </View>
      ) : (
        <Button 
          onPress={handleAddItemClick} 
          style={[
            styles.addButton,
            isButtonPressed && styles.addButtonPressed
          ]}
          textStyle={styles.addButtonText}
        >
          Add
        </Button>
      )}
      {/* Quantity Selection Modal */}
      <QuantityModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddToCart}
        initialQuantity={selectedQuantity}
        productName={product.title}
        maxQuantity={product.inStock}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(4),
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
    // Pharmacy-themed shadow
    ...Platform.select({
      ios: {
        shadowColor: '#2E7D32',
        shadowOffset: { 
          width: 0, 
          height: -2 
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  
  addButton: {
    paddingVertical: verticalScale(2),
    paddingHorizontal: moderateScale(8),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(4),
    marginVertical: verticalScale(2),
    gap: moderateScale(14),
    ...Platform.select({
      ios: {
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
    }),
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  addButtonPressed: {
    backgroundColor: '#F8F8F8', // Very light grey background when pressed
    borderColor: '#d0d0d0', // Lighter grey border
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    color: '#4CAF50', // same light green as border
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
});

export default AddToCartOperation;