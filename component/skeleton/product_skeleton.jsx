import { StyleSheet, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Skeleton from '../common/skeleton';

export default function ProductSkeleton() {
  return (
    <View style={styles.card}>
      {/* Product Image */}
      <Skeleton.Item 
        style={[styles.productImage, styles.animatedBg]} 
      />
      
      {/* Product Details */}
      <View style={styles.detailsContainer}>
        {/* Product Name + Quantity */}
        <Skeleton.Item 
          style={[styles.productTitle, styles.animatedBg]} 
        />
        
        {/* Company Name */}
        <Skeleton.Item 
          style={[styles.companyName, styles.animatedBg]} 
        />
        
        {/* Pricing Row */}
        <View style={styles.pricingContainer}>
          <Skeleton.Item style={[styles.ptr, styles.animatedBg]} />
          <Skeleton.Item style={[styles.mrp, styles.animatedBg]} />
          <Skeleton.Item style={[styles.discount, styles.animatedBg]} />
        </View>
        
        {/* Action Button */}
        <Skeleton.Item 
          style={[styles.actionButton, styles.animatedBg]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
    padding: moderateScale(12),
    elevation: 2,
  },
  productImage: {
    height: verticalScale(120),
    width: '100%',
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(12),
  },
  detailsContainer: {
    paddingHorizontal: moderateScale(4),
  },
  productTitle: {
    height: verticalScale(20),
    width: '70%',
    marginBottom: verticalScale(6),
  },
  companyName: {
    height: verticalScale(16),
    width: '50%',
    marginBottom: verticalScale(12),
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  ptr: {
    height: verticalScale(18),
    width: moderateScale(80),
  },
  mrp: {
    height: verticalScale(18),
    width: moderateScale(60),
  },
  discount: {
    height: verticalScale(18),
    width: moderateScale(40),
  },
  actionButton: {
    height: verticalScale(36),
    width: '100%',
    borderRadius: moderateScale(6),
  },
  animatedBg: {
    backgroundColor: '#f0f0f0',
  },
});