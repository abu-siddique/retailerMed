import { formatNumber } from '@/utils';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import Icons from '../common/icons';
import QuantityModal from '../common/quantity_modal';
import { decreaseQuantity, increaseQuantity, removeFromCart, updateCartQuantity } from '../store';

const MAX_QUANTITY = 1000;

const CartButtons = ({ item, style }) => {
  const dispatch = useDispatch();
  const [previousQuantity, setPreviousQuantity] = useState(item.quantity);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);

  // Near the top of your file
  const DeleteIcon = () => <Icons.AntDesign name="delete" size={moderateScale(12)} style={styles.deleteIcon} />;
  const EditIcon = () => <Icons.Feather name="edit-2" size={moderateScale(12)} style={styles.editIcon} />;

  
  useEffect(() => {
    if (previousQuantity !== item.quantity) {
      if (previousQuantity < item.quantity) {
        Toast.show({
          type: 'success',
          text1: 'Quantity Updated',
          text2: `${item.name} quantity increased to ${item.quantity}`,
          visibilityTime: 1500,
          // position: 'bottom',
        });
      } else if (previousQuantity > item.quantity) {
        Toast.show({
          type: 'info',
          text1: 'Quantity Updated',
          text2: `${item.name} quantity decreased to ${item.quantity}`,
          visibilityTime: 1500,
          // position: 'bottom',
        });
      }
    }
    setPreviousQuantity(item.quantity);
  }, [item.quantity, item.name]);
  
  const handleIncrease = () => {
    if (item.quantity < MAX_QUANTITY) {
      dispatch(increaseQuantity(item.itemID));
    }
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item.itemID));
    }
  };
  
  const handleRemove = () => {
    Toast.show({
      type: 'success',
      text1: 'Item Removed',
      text2: `${item.name} removed from cart`,
      visibilityTime: 2000,
      // position: 'bottom',
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
        // position: 'bottom',
      });
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handleRemove} style={styles.deleteButton}>
        {/* <Icons.AntDesign name="delete" size={moderateScale(12)} style={styles.deleteIcon} /> */}
        <DeleteIcon />

      </TouchableOpacity>

      <TouchableOpacity style={styles.quantityDisplayContainer} onPress={handleEditQuantity}>
        <Text style={styles.quantityText}>{formatNumber(item.quantity)}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleEditQuantity} style={styles.actionButton}>
        {/* <Icons.AntDesign name="edit" size={moderateScale(12)} style={styles.editIcon} /> */}
        <EditIcon />
      </TouchableOpacity>

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
    justifyContent: 'center',
    paddingVertical: verticalScale(2),

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
  quantityDisplayContainer: {
    borderRadius: moderateScale(4),
    minWidth: moderateScale(36),
    alignItems: 'center',
    paddingVertical: moderateScale(1),
    paddingHorizontal: moderateScale(4),
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  actionButton: {
    paddingVertical: moderateScale(1),
    paddingHorizontal: moderateScale(4),
    borderRadius: moderateScale(8),
    marginHorizontal: moderateScale(4),
  },
  deleteButton: {
    paddingVertical: moderateScale(1),
    paddingHorizontal: moderateScale(4),
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
    fontSize: moderateScale(12),
    textAlign: 'center',
    color: '#1B5E20',
    fontWeight: '600',
  },
});

export default CartButtons;