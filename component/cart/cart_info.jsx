import { formatNumber } from '@/utils'
import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'
import { useSelector } from 'react-redux'

const CartInfo = props => {
  // Props
  const { handleRoute, cart } = props

  // Store
  const { totalItems, totalPriceToPay, totalMRP } = useSelector(state => state.cart)
  
  // Calculate values for invoice
  const discount = totalMRP - totalPriceToPay
  const shippingCharges = totalPriceToPay < 2000 ? 50 : 0
  const subtotalAmount = totalPriceToPay + shippingCharges
  
  // Add rounding calculation
  const roundingValue = Math.round(subtotalAmount) - subtotalAmount
  const finalAmount = subtotalAmount + roundingValue

  // Render
  return (
    <View style={styles.container}>
      
      {/* Total MRP */}
      <View style={styles.priceContainer}>
        <Text style={styles.standardText}>Total (MRP)</Text>
        <View style={styles.flexRowCenter}>
          <Text style={styles.standardText}>{formatNumber(totalMRP)}</Text>
          <Text style={[styles.currency, styles.standardText]}>₹</Text>
        </View>
      </View>

      {/* Discount */}
      <View style={styles.rowBetween}>
        <Text style={styles.standardText}>Discount</Text>
        <View style={styles.flexRowCenter}>
          <Text style={styles.discountText}>- {formatNumber(discount)}</Text>
          <Text style={[styles.currency, styles.discountText]}>₹</Text>
        </View>
      </View>

      {/* Shipping charges */}
      <View style={styles.rowBetween}>
        <Text style={styles.standardText}>Shipping Charges</Text>
        <View style={styles.flexRowCenter}>
          <Text style={styles.standardText}>{formatNumber(shippingCharges)}</Text>
          <Text style={[styles.currency, styles.standardText]}>₹</Text>
        </View>
      </View>
      
      {/* Rounding */}
      <View style={styles.rowBetween}>
        <Text style={styles.standardText}>Rounded</Text>
        <View style={styles.flexRowCenter}>
          <Text style={styles.standardText}>{formatNumber(roundingValue.toFixed(2))}</Text>
          <Text style={[styles.currency, styles.standardText]}>₹</Text>
        </View>
      </View>

      {/* Dashed Divider */}
      <View style={styles.dashedDivider}></View>

      {/* Total to be paid */}
      <View style={styles.rowBetween}>
        <Text style={styles.totalText}>Total to be paid</Text>
        <View style={styles.flexRowCenter}>
          <Text style={styles.totalText}>{formatNumber(finalAmount)}</Text>
          <Text style={[styles.currency, styles.totalText]}>₹</Text>
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
  summaryTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
  },
  priceContainer: {
    paddingBottom: verticalScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standardText: {
    fontSize: moderateScale(14),
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
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    width: '100%',
  },
  dashedDivider: {
    height: 1,
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 1,
  },
  totalText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: moderateScale(14),
    color: '#22c55e',  // Green color for discount
  }
})

export default CartInfo