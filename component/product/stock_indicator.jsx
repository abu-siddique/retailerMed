import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import formatNumber from '../../utils/format_number';

const StockIndicator = ({ 
  inStock, 
  lowStockThreshold = 10 
}) => {
  // Determine stock status
  const isOutOfStock = inStock === 0;
  const isLowStock = inStock > 0 && inStock < lowStockThreshold;

  return (
    <View style={styles.container}>
      {isOutOfStock ? (
        <View style={styles.statusRow}>
          <FontAwesome
            name="times-circle"
            size={moderateScale(14)}
            style={styles.outOfStockIcon}
          />
          <Text style={[styles.text, styles.outOfStockText]}>Out of stock</Text>
        </View>
      ) : isLowStock ? (
        <View style={styles.statusRow}>
          <FontAwesome
            name="exclamation-circle"
            size={moderateScale(14)}
            style={styles.lowStockIcon}
          />
          <Text style={[styles.text, styles.lowStockText]}>
            Only {formatNumber(inStock)} left
          </Text>
        </View>
      ) : (
        <View style={styles.statusRow}>
          <FontAwesome
            name="check-circle"
            size={moderateScale(14)}
            style={styles.inStockIcon}
          />
          <Text style={[styles.text, styles.inStockText]}>In stock</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: moderateVerticalScale(2),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Medium',
    includeFontPadding: false,
    marginLeft: moderateScale(4),
  },
  outOfStockIcon: {
    color: '#F87171', // red-400
  },
  outOfStockText: {
    color: '#EF4444', // red-500
  },
  lowStockIcon: {
    color: '#F87171', // red-400
  },
  lowStockText: {
    color: '#EF4444', // red-500
  },
  inStockIcon: {
    color: '#4ADE80', // green-400
  },
  inStockText: {
    color: '#15803D', // green-700
  },
});

export default StockIndicator;