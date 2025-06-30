import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, moderateVerticalScale, verticalScale } from 'react-native-size-matters'

import Icons from '../common/icons'
import ResponsiveImage from '../common/resonsive_image'
import CartButtons from './cart_buttons'

import { formatNumber } from '@/utils'


const CartItem = props => {
  // Props
  const { item } = props
  
  // Calculate total price with discount, GST and quantity
  const calculateTotalPrice = (item) => {
    const priceAfterDiscount = item.ptr - (item.ptr * (item.discount / 100));
    const priceWithGst = priceAfterDiscount * (1 + (item.gst / 100));
    return priceWithGst * item.quantity;
  };

  // Render
  return (
    <View style={styles.container}>
      {/* Image & CartButtons */}
      <View style={styles.imageSection}>
        <View style={styles.imageContainer}>
          <ResponsiveImage
            style={styles.image}
            source={{uri: item.img.url}}
            alt={item.name}
          />
        </View>

          <CartButtons item={item} />
      </View>

      {/* Product Info */}
      <View style={styles.infoSection}>
        <Text style={styles.productName}>
          <Link href={`/products/${item.productID}`}>{item.name}</Link>
        </Text>

        {/* Details */}
        <View style={styles.detailsContainer}>
          {/* Discount Row and Tag Row */}
          <View style={styles.discountRow}>
            {/* Discount Percentage */}
            {item.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.badgeText}>{item.discount}% OFF</Text>
              </View>
            )}
            
            {/* Ice Pack Tag */}
            {!item.isIcePacked && (
              <View style={styles.icePackBadge}>
                <Icons.FontAwesome name="snowflake-o" size={14} color="#fff" style={styles.iceIcon} />
                <Text style={styles.badgeText}>ICE PACKED</Text>
              </View>
            )}
          </View>
          
          {/* Price Details */}
          <View style={styles.priceDetailsRow}>
            <View style={styles.leftPriceDetails}>
              {/* PTR in bold with color */}
              <View style={styles.priceItemContainer}>
                <Text style={styles.priceLabel}>PTR: </Text>
                <Text style={styles.ptrValue}>₹{formatNumber(item.ptr)}</Text>
                
                {/* MRP in grey and smaller */}
                <Text style={styles.priceSeparator}> | </Text>
                <Text style={styles.priceLabel}>MRP: </Text>
                <Text style={styles.mrpValue}>₹{formatNumber(item.mrp)}</Text>
                
                {/* GST in green and smaller */}
                <Text style={styles.priceSeparator}> | </Text>
                <Text style={styles.priceLabel}>GST: </Text>
                <Text style={styles.gstValue}>{item.gst}%</Text>
              </View>
            </View>
            <View style={styles.rightPriceDetails}>
              <Text style={styles.totalPriceText}>
               = {formatNumber(calculateTotalPrice(item))} ₹
              </Text>
            </View>
          </View>
          
          {/* Free Product Offer */}
          {item.buy && item.get && item.quantity >= item.buy && (
            <View style={styles.offerRow}>
              {/* Use FontAwesome from the Icons object which has a gift icon */}
              <Icons.FontAwesome name="gift" size={16} color="#16a34a" />
              <Text style={styles.offerText}>
                {item.name} x {Math.floor(item.quantity / item.buy) * item.get} FREE
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    gap: moderateScale(12),
  },
  imageSection: {
    gap: verticalScale(4),
    
  },
  imageContainer: {
    width: moderateScale(120),
    height: moderateVerticalScale(110),
    alignItems: 'center',
    borderColor: '#CEC9C8',
    borderRadius: moderateScale(2),
    marginVertical: moderateVerticalScale(4),
    paddingVertical: moderateVerticalScale(4),
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    position: 'relative', 
    },
  image: {
    width: moderateScale(100),
    height: moderateVerticalScale(100),
    borderColor: '#e2e8f0',
    resizeMode: 'contain',
  },
  cartButtonStyle:{
    alignSelf: 'center',
    width: moderateScale(100),
  },
  specialSellContainer: {
   
  },
  infoSection: {
    flex: 1,
  },
  productName: {
    marginBottom: verticalScale(8),
    fontSize: moderateScale(14),
  },
  detailsContainer: {
    gap: verticalScale(4),
  },
  discountRow: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  discountText: {
    color: '#16a34a',
    fontWeight: '500',
    fontSize: moderateScale(12),
  },
  discountBadge: {
    backgroundColor: '#16a34a',
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(2),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(4),
  },
  icePackBadge: {
    backgroundColor: '#0891b2', // Cyan-600 color for ice
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(2),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: moderateScale(12),
  },
  iceIcon: {
    marginRight: moderateScale(2),
  },
  priceDetailsRow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: moderateScale(4),
  },
  leftPriceDetails: {
    flex: 1,
  },
  priceDetailsText: {
    fontSize: moderateScale(12),
    color: '#4b5563',
  },
  rightPriceDetails: {
    alignItems: 'flex-end',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    marginTop: verticalScale(4),
    borderRadius: moderateScale(4),
    borderColor: '#CEC9C8',
    
  },
  totalPriceText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#111827',
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    paddingTop: verticalScale(4),
  },
  offerText: {
    fontSize: moderateScale(12),
    color: '#16a34a',
    fontWeight: '500',
  },
  // Add these new styles
  priceItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  priceLabel: {
    fontSize: moderateScale(12),
    color: '#6b7280',
  },
  ptrValue: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#2563eb',
  },
  mrpValue: {
    fontSize: moderateScale(11),
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  gstValue: {
    fontSize: moderateScale(11),
    color: '#16a34a',
    fontWeight: '500',
  },
  priceSeparator: {
    fontSize: moderateScale(11),
    color: '#9ca3af',
  },
})

export default CartItem


