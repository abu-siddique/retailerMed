import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

// Components
import ResponsiveImage from '../common/resonsive_image';
import DiscountProduct from './discount_product';
import ProductPrice from './product_price';
import StockIndicator from './stock_indicator';

// Utils
import truncate from '../../utils/truncate';

const ProductCard = ({ product }) => {
  // Format purchase count for medicines
  const formatPurchases = (count) => {
    if (!count) return 'New arrival';
    return count >= 1000 ? '1000+ units sold' : `${count} units sold`;
  };

  const formatQuantity = () => {
    if (!product.quantity) return null;
    return `${product.quantity.value} ${product.quantity.unit}${
      product.quantity.package ? `/${product.quantity.package}` : ''
    }`;
  };
  // Image gallery indicator dots
  const renderImageDot = ({ index }) => (
    <View 
      style={[
        styles.imageDot,
        index === 0 && styles.activeDot
      ]}
    />
  );

  return (
    <Link href={`/products/${product._id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Medicine Image with Gallery Indicator */}
          <View style={styles.imageContainer}>
            <ResponsiveImage
              style={styles.image}
              source={{ uri: product.images[0]?.url }}
              alt={product.name}
            />
            
            {product.images?.length > 1 && (
              <View style={styles.imageIndicator}>
                <FlatList
                  data={product.images}
                  horizontal
                  renderItem={renderImageDot}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={styles.dotsContainer}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
          </View>

          {/* Medicine Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {truncate(product.name, 70)}
            </Text>

            {/* Package Quantity */}
            {product.quantity && (
              <Text style={styles.quantity}>
                {formatQuantity()}
              </Text>
            )}

            {/* Medicine-specific metadata */}
            <View style={styles.metaContainer}>
              <StockIndicator inStock={product.inStock} />
              {product.dosageForm && (
                <Text style={styles.dosageForm}>{product.dosageForm}</Text>
              )}
            </View>

            <View style={styles.metaContainer}>
              <Text style={styles.purchasesText}>
                {formatPurchases(product.purchases)}
              </Text>
              {product.manufacturer && (
                <Text style={styles.manufacturer}>{product.manufacturer}</Text>
              )}
            </View>

            <View style={styles.priceContainer}>
              <DiscountProduct discount={product.discount} />
              <ProductPrice
                price={product.price}
                discount={product.discount}
                inStock={product.inStock}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateVerticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f8fafc' // Light blueish background for medical products
  },
  contentContainer: {
    flexDirection: 'row',
    gap: moderateScale(16),
    paddingHorizontal: moderateScale(12),
  },
  imageContainer: {
    width: moderateScale(100),
    alignItems: 'center',
  },
  image: {
    width: moderateScale(100),
    height: moderateVerticalScale(100),
    borderRadius: moderateScale(4), // Less rounded for medical products
    marginBottom: moderateVerticalScale(4),
    borderWidth: 1,
    borderColor: '#e2e8f0' // Light border for medicine images
  },
  imageIndicator: {
    marginBottom: moderateVerticalScale(4),
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: '#d1d5db',
    marginHorizontal: moderateScale(2),
  },
  activeDot: {
    backgroundColor: '#3b82f6',
  },
  infoContainer: {
    flex: 1,
    gap: moderateVerticalScale(6), // Tighter spacing for medical info
  },
  title: {
    fontSize: moderateScale(14),
    color: '#1e3a8a', // Dark blue for medicine names
    fontWeight: '500',
    lineHeight: moderateVerticalScale(20),
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(4),
  },
  dosageForm: {
    fontSize: moderateScale(11),
    color: '#64748b',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateVerticalScale(2),
    borderRadius: moderateScale(4)
  },
  manufacturer: {
    fontSize: moderateScale(10),
    color: '#64748b',
    fontStyle: 'italic'
  },
  purchasesText: {
    fontSize: moderateScale(11),
    color: '#334155',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: moderateVerticalScale(4),
  },
  quantity: {
    fontSize: moderateScale(12),
    color: '#475569',
    marginBottom: moderateVerticalScale(4),
    fontWeight: '500'
  }
});

export default ProductCard;