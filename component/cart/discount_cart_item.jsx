import { formatNumber } from '@/utils'
import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'


const DiscountCartItem = props => {
  // Props
  const { discount, price } = props

  // Calculations
  const discountPercent = discount / 100
  const discountAmount = +(price * discountPercent).toFixed()
  const discountedPrice = price - (discount * price) / 100

  // Render
  return (
    <View style={styles.container}>
      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>{formatNumber(discountAmount)}</Text>
        <Text style={styles.discountText}>₹</Text>
        <Text style={styles.discountText}>OFF</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.discountedPriceText}>
          {formatNumber(discountedPrice)}
        </Text>
        <Text style={styles.currency}>₹</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: verticalScale(4),
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  discountText: {
    color: '#ef4444',
    fontSize: moderateScale(14),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  discountedPriceText: {
    fontSize: moderateScale(12),
    color: '#374151',
  },
  currency: {
    fontSize: moderateScale(14),
  },
})

export default DiscountCartItem