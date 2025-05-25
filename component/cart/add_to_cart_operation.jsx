import { exsitItem } from '@/utils';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../common/button';
import QuantityModal from '../common/quantity_modal';
import useUserInfo from '../hooks/use_user_info';
import useVerify from '../hooks/use_verify';
import ProductPrice from '../product/product_price';
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
    const item = exsitItem(cartItems, product._id);
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
        price: product.price,
        discount: product.discount,
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
        >
          Add to Cart
        </Button>
      )}

      <View style={styles.priceContainer}>
        <ProductPrice
          inStock={product.inStock}
          discount={product.discount}
          price={product.price}
          singleProduct
        />
      </View>

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
    justifyContent: 'space-between',
    padding: moderateScale(16),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
        elevation: 5,
      },
    }),
  },
  cartButtonsContainer: {
    width: scale(180),
    minWidth: scale(180),
  },
  addButton: {
    paddingHorizontal: moderateScale(24),
    backgroundColor: '#2E7D32', // Pharmacy green
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    minWidth: scale(150),
    ...Platform.select({
      ios: {
        shadowColor: '#1B5E20',
        shadowOffset: { 
          width: 0, 
          height: 2 
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonPressed: {
    backgroundColor: '#1B5E20', // Darker green when pressed
    transform: [{ scale: 0.98 }],
  },
  priceContainer: {
    minWidth: scale(120),
    alignItems: 'flex-end',
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },
});

export default AddToCartOperation;