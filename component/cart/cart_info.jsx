import { formatNumber } from '@/utils'
import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'

const CartInfo = props => {
  // Props
  const { handleRoute, cart } = props

  // Store
  const { totalItems, totalPriceToPay, totalMRP } = useSelector(state => state.cart)

  // Render
  return (
    <View style={styles.container}>
      {/* Total cart price */}
      <View style={styles.priceContainer}>
        <Text style={styles.label}>
          Item Price ({formatNumber(totalItems)} items)
        </Text>
        <View style={styles.flexRowCenter}>
          <Text>{formatNumber(totalMRP)}</Text>
          <Text style={styles.currency}>₹</Text>
        </View>
      </View>

      {/* Total cart amount */}
      <View style={styles.rowBetween}>
        <Text>Cart Total</Text>
        <View style={styles.flexRowCenter}>
          <Text style={styles.amountText}>{formatNumber(totalPriceToPay)}</Text>
          <Text style={styles.currency}>₹</Text>
        </View>
      </View>

      <Text style={styles.shippingText}>
        Shipping is calculated based on your shipment address, delivery time, weight and volume
      </Text>

      {/* Total savings */}
      <View style={styles.rowBetween}>
        <Text style={styles.savingsText}>Your savings</Text>
        <View style={styles.flexRowCenter}>
          <Text style={styles.savingsText}>
            ({(totalPriceToPay > 0 ? (totalMRP - totalPriceToPay) : 0).toFixed(1)})
          </Text>
          <Text style={[styles.currency, styles.savingsText]}>₹</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    marginTop: verticalScale(8),
    rowGap: verticalScale(20),
  },
  priceContainer: {
    paddingBottom: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: moderateScale(12),
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    marginLeft: moderateScale(4),
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: moderateScale(12),
  },
  shippingText: {
    width: '100%',
    paddingBottom: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontSize: moderateScale(12),
    color: '#6b7280',
  },
  savingsText: {
    color: '#ef4444',
    fontSize: moderateScale(12),
  },
})

export default CartInfo