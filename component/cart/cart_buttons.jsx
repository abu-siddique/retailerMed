import { formatNumber } from '@/utils';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import Icons from '../common/icons';
import QuantityModal from '../common/quantity_modal';
import { decreaseQuantity, increaseQuantity, removeFromCart, updateCartQuantity } from '../store';

// This is now just a fallback and won't be used if real item is provided
const mockCartItem = {
    itemID: 'prod_123',
    productID: 'paracetamol_500mg',
    name: 'Paracetamol 500mg',
    brand: 'HealthPlus',
    quantity: 2,
    price: 5.99,
    discount: 0.50,
    image: 'https://img.freepik.com/free-photo/medicine-capsules-global-health-with-geometric-pattern-digital-remix_53876-126742.jpg',
    description: 'Effective pain relief and fever reducer',
    category: 'Pain Relief'
};

const MAX_QUANTITY = 1000;

const CartButtons = ({ item = mockCartItem }) => {
  const dispatch = useDispatch();
  const [previousQuantity, setPreviousQuantity] = useState(item.quantity);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  
  // Update local state whenever the item.quantity changes from props
  useEffect(() => {
    // Only show toast if this isn't the initial render and quantity has changed
    if (previousQuantity !== item.quantity) {
      if (previousQuantity < item.quantity) {
        // Quantity increased
        Toast.show({
          type: 'success',
          text1: 'Quantity Updated',
          text2: `${item.name} quantity increased to ${item.quantity}`,
          visibilityTime: 1500,
          position: 'bottom',
        });
      } else if (previousQuantity > item.quantity) {
        // Quantity decreased
        Toast.show({
          type: 'info',
          text1: 'Quantity Updated',
          text2: `${item.name} quantity decreased to ${item.quantity}`,
          visibilityTime: 1500,
          position: 'bottom',
        });
      }
    }
    
    // Update the previous quantity to current quantity for next comparison
    setPreviousQuantity(item.quantity);
  }, [item.quantity, item.name]);
  
  // Use the actual item passed from parent component
  const handleIncrease = () => {
    if (item.quantity < MAX_QUANTITY) {
      console.log('Increasing quantity for item:', item.itemID);
      dispatch(increaseQuantity(item.itemID));
    }
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      console.log('Decreasing quantity for item:', item.itemID);
      dispatch(decreaseQuantity(item.itemID));
    }
  };
  
  const handleRemove = () => {
    Toast.show({
      type: 'success',
      text1: 'Item Removed',
      text2: `${item.name} removed from cart`,
      visibilityTime: 2000,
      position: 'bottom',
    });
    dispatch(removeFromCart(item.itemID));
  };

  const handleEditQuantity = () => {
    setQuantityModalVisible(true);
  };

  const handleSaveQuantity = (newQuantity) => {
    if (newQuantity !== item.quantity) {
      dispatch(updateCartQuantity({ id: item.itemID, quantity: newQuantity }));
      
      Toast.show({
        type: 'success',
        text1: 'Quantity Updated',
        text2: `${item.name} quantity set to ${newQuantity}`,
        visibilityTime: 2000,
        position: 'bottom',
      });
    }
  };

  // Regular view with reordered buttons (delete on left, quantity in middle, edit on right)
  return (
    <View style={styles.container}>
      {/* Delete Button (Left) */}
      <TouchableOpacity
        onPress={handleRemove}
        style={styles.deleteButton}
      >
        <Icons.AntDesign 
          name="delete" 
          size={moderateScale(16)} 
          style={styles.deleteIcon} 
        />
      </TouchableOpacity>

      {/* Quantity Display (Middle) */}
      <TouchableOpacity 
        style={styles.quantityDisplayContainer}
        onPress={handleEditQuantity}
      >
        <Text style={styles.quantityText}>
          {formatNumber(item.quantity)}
        </Text>
      </TouchableOpacity>

      {/* Edit Button (Right) */}
      <TouchableOpacity 
        onPress={handleEditQuantity}
        style={styles.actionButton}
      >
        <Icons.Feather
          name="edit-2" 
          size={moderateScale(16)} 
          style={styles.editIcon} 
        />
      </TouchableOpacity>

      {/* Quantity Modal */}
      <QuantityModal
        visible={quantityModalVisible}
        onClose={() => setQuantityModalVisible(false)}
        onSave={handleSaveQuantity}
        initialQuantity={item.quantity}
        productName={item.name}
        maxQuantity={MAX_QUANTITY}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(14),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(4),
    // Pharmacy-themed shadow
    ...Platform.select({
      ios: {
        shadowColor: '#2E7D32',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  quantityDisplayContainer: {
    borderRadius: moderateScale(8),
    minWidth: moderateScale(50),
    alignItems: 'center', // Center the text
    padding: moderateScale(8),
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    marginHorizontal: moderateScale(4),
  },
  deleteButton: {
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    marginHorizontal: moderateScale(4),
  },
  deleteIcon: {
    color: '#C62828',
  },
  editIcon: {
    color: '#1565C0',
  },
  quantityText: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: '#1B5E20',
    fontWeight: '600',
  },
});

export default CartButtons;