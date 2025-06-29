import { StyleSheet, Text, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import formatNumber from '../../utils/format_number';

const ProductPrice = ({ 
  singleProduct = false, 
  inStock = 0, 
  mrp = 0,   // MRP price
  ptr = 0    // PTR price
}) => {
  // Dynamic styles based on singleProduct
  const containerStyle = [
    styles.container,
    singleProduct && {
      flexDirection: 'column-reverse',
      alignItems: 'flex-start',
      gap: moderateScale(2)
      
    }
  ];

  const mrpContainerStyle = [
    styles.mrpContainer,
    singleProduct && { marginTop: moderateScale(2), marginLeft: 0 }
  ];

  if (inStock === 0) {
    return (
      // <Text style={styles.outOfStock}>Out of stock</Text>
      undefined
    );
  }

  return (
    <View style={containerStyle}>
      {/* PTR Price */}
      <View style={styles.ptrContainer}>
        <Text style={styles.priceLabel}>PTR: </Text>
        <Text style={styles.ptrPrice}>
          {formatNumber(ptr, true)}
        </Text>
      </View>

      {/* MRP Price */}
      <View style={mrpContainerStyle}>
        <Text style={styles.priceLabel}>MRP: </Text>
        <Text style={styles.mrpPrice}>
          {formatNumber(mrp, true)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(20)
  },
  ptrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(2),
  },
  ptrPrice: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1e40af', // Blue color for PTR
  },
  mrpPrice: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  priceLabel: {
    fontSize: moderateScale(10),
    color: '#64748b',
    marginRight: moderateScale(2),
  },
  outOfStock: {
    color: '#ef4444',
    fontSize: moderateScale(12),
  },
});

export default ProductPrice;