import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  PixelRatio, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
  
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const fontScale = PixelRatio.getFontScale();

// Import components from your workspace
import { StatusBar } from 'expo-status-bar';
import AddToCartOperation from '../../../component/cart/add_to_cart_operation';
import ShowWrapper from '../../../component/common/show_wrapper';
import Description from '../../../component/product/description';
import DiscountProduct from '../../../component/product/discount_product';
import ImageGallery from '../../../component/product/image_gallary';
import Info from '../../../component/product/info';
import OutOfStock from '../../../component/product/out_of_stock';
import ProductPrice from '../../../component/product/product_price';
import StockIndicator from '../../../component/product/stock_indicator';

import { formatNumber } from '@/utils';
import { useSelector } from 'react-redux';

export default function ProductDetailScreen() {
  // Get URL params and insets
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
 
  const router = useRouter();

  const { totalItems } = useSelector(state => state.cart)
  
  // In a real implementation, you'd fetch product data
  // This is mocked data for demonstration
  const product = {
    _id: id,
    name: 'Paracetamol 500mg Tablets',
    title: 'Paracetamol 500mg Tablets',
    price: 199.99,
    ptr: 150.50,
    mrp: 220.00,
    discount: 10,
    inStock: 10,
    buy: 10,
    get: 5,
    composition: "Azithromycin 500mg per tablet",
    quantity: {
      value: 16,
      unit: 'tablets',
      package: 'box'
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop', _id: '1-1' },
      { url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400&auto=format&fit=crop', _id: '1-2' }
    ],
    manufacturer: 'HealthCare Pharma',
    bestBefore: '12/05/2027',
    product_info: `<div>
  <h1>Dolo 650 Tablet</h1>

  <p><strong>NPPA Regulated</strong><br>
  <strong>Marketer</strong>: Micro Labs Ltd</p>

  <h2>Salt Composition</h2>
  <ul>
    <li><strong>Active Ingredient</strong>: Paracetamol (650mg)</li>
    <li><strong>Salt Synonyms</strong>: Acetaminophen</li>
  </ul>

  <h2>Storage</h2>
  <p>Store below 25°C</p>

  <h2>Product Introduction</h2>
  <p>Dolo 650 Tablet helps relieve pain and fever by blocking chemical messengers. Used for:</p>
  <ul>
    <li>Headaches, migraine</li>
    <li>Toothaches, sore throat</li>
    <li>Period pains, arthritis</li>
    <li>Common cold</li>
  </ul>
  <p><strong>COVID-19 Note</strong>: Widely prescribed during the pandemic.</p>

  <h2>Dosage</h2>
  <ul>
    <li>Take with food (max 4 doses/24 hours, ≥4 hour gaps)</li>
    <li>Swallow whole; do not crush/chew</li>
  </ul>

  <h2>Uses</h2>
  <ul>
    <li>Pain relief</li>
    <li>Fever treatment</li>
  </ul>

  <h2>Benefits</h2>

  <h3>Pain Relief</h3>
  <p>Blocks brain's pain signals. Effective for:</p>
  <ul>
    <li>✓ Headaches</li>
    <li>✓ Nerve pain</li>
    <li>✓ Arthritis</li>
    <li>✓ Safest for pregnancy/breastfeeding</li>
  </ul>

  <h3>Fever Treatment</h3>
  <p>Reduces high temperature by inhibiting fever-causing chemicals.</p>

  <h2>Side Effects</h2>
  <p><em>Most are temporary</em>:</p>
  <ul>
    <li>Nausea/Vomiting</li>
    <li>Headache</li>
    <li>Constipation</li>
    <li>Insomnia</li>
  </ul>

  <h2>How to Use</h2>
  <ol>
    <li>Swallow whole with food</li>
    <li>Follow prescribed dosage</li>
    <li>Never exceed 4 doses/day</li>
  </ol>

  <h2>Safety Advice</h2>
  <table border="1">
    <tr>
      <th>Category</th>
      <th>Status</th>
      <th>Details</th>
    </tr>
    <tr>
      <td>Alcohol</td>
      <td>❌ UNSAFE</td>
      <td>Causes drowsiness</td>
    </tr>
    <tr>
      <td>Pregnancy</td>
      <td>⚠️ CONSULT MD</td>
      <td>Potential fetal risk</td>
    </tr>
    <tr>
      <td>Kidney</td>
      <td>⚠️ CAUTION</td>
      <td>Dose adjustment may be needed</td>
    </tr>
  </table>

  <h2>Missed Dose</h2>
  <ul>
    <li>Take ASAP if remembered</li>
    <li>Skip if near next dose time</li>
    <li><strong>Never double dose</strong></li>
  </ul>
</div>`
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} hidden={false} />
      <Stack.Screen
        options={{
            title: '',
            headerStyle: {
                height: verticalScale(56), // Adjust this value as needed
              },
            headerShown: true,
            
             headerLeft: () => (
                        <Pressable 
                          onPress={() => router.back()}
                          style={styles.headerLeftButton}
                        >
                          <Ionicons name="arrow-back" size={24} color="#1F2937" />
                        </Pressable>
                      ),
                      headerRight: () => (
                        <View style={styles.headerRightContainer}>
                          <Pressable 
                            onPress={() => router.push('/search')}
                            style={styles.searchButton}
                          >
                            <Ionicons name="search" size={24} color="#1F2937" />
                          </Pressable>
            
                          <Link href="/cart" asChild>
                            <Pressable style={styles.cartButton}>
                              <Icon name="shoppingcart" size={24} color="#1F2937" />
                              {formatNumber(totalItems) && (
                                <View style={styles.cartBadge}>
                                  <Text style={styles.cartBadgeText}>
                                    {formatNumber(totalItems)}
                                  </Text>
                                </View>
                              )}
                            </Pressable>
                          </Link>
            
                         
                        </View>
                      ),
        }}
      />

      <ShowWrapper
        isLoading={false}
        isError={false}
        error={null}
        isFetching={false}
        isSuccess={true}
        type="detail"
      >
        <ScrollView style={styles.container}>
          {/* Product Images */}
          <ImageGallery 
            images={product.images} 
            productName={product.name} 
          />
          
          {/* Product Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{product.title}</Text>

            {/* Composition - only show if exists */}
            {product.composition && (
              <Text style={styles.composition}>{product.composition}</Text>
            )}

            {product.discount > 0 && (
              <View style={styles.discountBadge}>
                <DiscountProduct discount={product.discount} />
              </View>
            )}
          </View>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <StockIndicator inStock={product.inStock} />
          </View>

          {/* Price and Add to Cart */}
          {product.inStock === 0 ? (
            <OutOfStock />
          ) : (
            <View style={styles.priceActionContainer}>
              <View style={styles.priceContainer}>
                <ProductPrice 
                  ptr={product.ptr} 
                  mrp={product.mrp} 
                  inStock={product.inStock} 
                />
              </View>
              <View style={styles.addToCartContainer}>
                <AddToCartOperation product={product} />
              </View>
            </View>
          )}

          {/* Best Before */}
          <View style={styles.expiryContainer}>
            <Text style={styles.expiryLabel}>Expiry: </Text>
            <Text style={styles.expiryValue}>{product.bestBefore}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Product Info */}
          <Info 
            pack_of={`${product.quantity.value} ${product.quantity.unit}`}
            quantity={`${product.quantity.value} ${product.quantity.unit}`}
            package_type={product.quantity.package} 
          />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Product Description */}
          <Description description={product.product_info} />
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      </ShowWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: moderateScale(2)
  },
  headerLeftButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(8)
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: moderateScale(8)
  },
  searchButton: {
    padding: moderateScale(8),
  },
cartButton: {
  padding: moderateScale(4),
  justifyContent: 'center',
  alignItems: 'center',
  width: moderateScale(40),
  height: verticalScale(40),
},
cartBadge: {
  position: 'absolute',
  top: verticalScale(-1),
  right: moderateScale(-1),
  backgroundColor: '#FF3B30',
  borderRadius: moderateScale(10), // Half of height to make it round
  minWidth: moderateScale(20),
  height: moderateScale(20),
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: moderateScale(1.5),
  borderColor: '#fff',
},
cartBadgeText: {
  color: '#fff',
  fontSize: moderateScale(10),
  fontWeight: 'bold',
  includeFontPadding: false,
  textAlignVertical: 'center',
  paddingHorizontal: moderateScale(2), // For multi-digit numbers
},
  titleContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#1e293b',
  },
  composition: {
    fontSize: moderateScale(14),
    color: '#94a3b8',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4),
  },
  discountBadge: {
    marginTop: verticalScale(8),
  },
  stockContainer: {
    paddingHorizontal: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  priceActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(2),
  },
  priceContainer: {
    flex: 1,
  },
  addToCartContainer: {
    width: '40%',
  },
  expiryContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(4),
    alignItems: 'center',
  },
  expiryLabel: {
    fontSize: moderateScale(14),
    color: '#64748b',
    fontWeight: '500',
  },
  expiryValue: {
    fontSize: moderateScale(14),
    color: '#334155',
  },
  divider: {
    height: verticalScale(1),
    backgroundColor: '#f1f5f9',
    marginVertical: verticalScale(12),
  },
});