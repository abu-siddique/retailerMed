import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

// Components
import ResponsiveImage from '../common/resonsive_image';
import DiscountProduct from './discount_product';
import OfferBadge from './offer_badge';
import ProductPrice from './product_price';
import StockIndicator from './stock_indicator';

// Utils
import truncate from '../../utils/truncate';

const ProductCard = ({ product, vertical = false }) => {
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

  const containerStyle = StyleSheet.flatten([
    styles.container,
    vertical && { padding: moderateScale(4),
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(4),
      paddingHorizontal: moderateScale(0)

    }
  ]);

  const contentContainerStyle = StyleSheet.flatten([
    styles.contentContainer,
    vertical && styles.verticalLayout
  ]);

  const imageContainerStyle = StyleSheet.flatten([
    styles.imageContainer,
    vertical && { alignSelf: 'center' }
  ]);

  const imageStyle = vertical ? styles.verticalImage : styles.image;

  return (
    <Link href={`/products/${product._id}`} asChild>
      <Pressable style={containerStyle}>
        <View style={contentContainerStyle}>
          {/* Medicine Image */}
          <View style={imageContainerStyle}>
            <ResponsiveImage
              style={imageStyle}
              source={{ uri: product.images[0]?.url }}
              alt={product.name}
            />
            {/* Only show badge if there's an offer */}
            {(product.buy && product.get) && (
              <OfferBadge 
                buy={product.buy} 
                get={product.get}
                containerStyle={styles.fullWidthBadge}
              />
            )}
          </View>

          {/* Medicine Info - below if vertical */}
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {truncate(product.name, 30)}
            </Text>

            {!vertical && product.quantity && (
              <Text style={styles.quantity}>
                {formatQuantity()}
              </Text>
            )}

          {!vertical && (
            <View style={styles.metaContainer}>
              <StockIndicator inStock={product.inStock} />
              {product.dosageForm && (
                <Text style={styles.dosageForm}>{product.dosageForm}</Text>
              )}
            </View>
          )}  

            <View style={styles.metaContainer}>
              {product.manufacturer && (
                <Text style={styles.manufacturer}>{product.manufacturer}</Text>
              )}
            </View>

            <View style={styles.priceContainer}>
              <ProductPrice
                mrp={product.mrp}
                ptr={product.ptr}
                singleProduct={vertical}
                inStock={product.inStock}
              />
              {!vertical && <DiscountProduct discount={product.discount} />}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateVerticalScale(8),
    backgroundColor: '#f8fafc',

  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(12),
    gap: moderateScale(8),
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    
  },
  verticalLayout: {
    flexDirection: 'column',
    gap: moderateScale(0),
  },
  // Update the imageContainer style
imageContainer: {
  width: moderateScale(100),
  height: moderateVerticalScale(70) + moderateVerticalScale(20), // Image height + space for badge
  alignItems: 'center',
  borderColor: '#CEC9C8',
  borderRadius: moderateScale(2),
  marginBottom: moderateVerticalScale(2),
  overflow: 'hidden',
  borderWidth: StyleSheet.hairlineWidth,
  position: 'relative', // Add this for absolute positioning of the badge
},

// Update the image style to maintain aspect ratio
image: {
  width: moderateScale(100),
  height: moderateVerticalScale(100),
  borderColor: '#e2e8f0',
  resizeMode: 'contain',
},

// Update the verticalImage style similarly
verticalImage: {
  width: moderateScale(100),
  height: moderateVerticalScale(70),
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderColor: '#e2e8f0',
  resizeMode: 'contain',
},

// Update the fullWidthBadge style to position it absolutely at the bottom
fullWidthBadge: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
},
  
  
  infoContainer: {
    flex: 1,
    marginTop: moderateVerticalScale(1),
  },
  title: {
    fontSize: moderateScale(11),
    color: '#1e3a8a',
    fontWeight: '500',
    marginBottom: moderateVerticalScale(2),
    lineHeight: moderateVerticalScale(14),
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(0),
  },
  dosageForm: {
    fontSize: moderateScale(10),
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
    fontSize: moderateScale(10),
    color: '#334155',
  },
  quantity: {
    fontSize: moderateScale(10),
    color: '#475569',
    marginBottom: moderateVerticalScale(4),
    fontWeight: '500'
  }
});

export default ProductCard;