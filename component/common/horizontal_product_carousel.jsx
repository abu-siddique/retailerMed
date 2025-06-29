import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

// Components
import AddToCartOperation from '../cart/add_to_cart_operation';
import ProductCard from '../product/product_card';
import FeedSectionContainer from './feed_section_container';

const HorizontalProductCarousel = ({ 
  title, 
  products = [], 
  viewAllLink,
  maxItems = 10
}) => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.productContainer}>
        <View style={styles.cardWrapper}>
          <ProductCard product={item} vertical={true} />
        </View>
        <View >
          <AddToCartOperation 
            product={item} 
          />
        </View>
      </View>
    );
  };

  return (
    <FeedSectionContainer
      title={title}
      showMore={!!viewAllLink}
      onJumptoMore={() => {
        // Handle navigation to view all products
      }}
      style={styles.container}
    >
      <FlashList
        data={products?.slice(0, maxItems)}
        renderItem={renderItem}
        keyExtractor={(item) => item._id?.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        nestedScrollEnabled={true}
        estimatedItemSize={20}
      />
    </FeedSectionContainer>
  );
};

// ...existing code...
const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(4),
  },
  listContent: {
    paddingVertical: verticalScale(4),
  
  },
  productContainer: {
    width: scale(120),
    height: verticalScale(200),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#E0E7FF',
    backgroundColor: '#FFFFFF',
    padding: moderateScale(2),
    flexDirection: 'column',
    position: 'relative',
    gap: scale(4)
  },
  cardWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  separator: {
    width: moderateScale(12),
  },
  // Custom styles for AddToCartOperation used in HorizontalProductCarousel
  customCartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: moderateScale(8),
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  customCartButton: { 
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(6),
    backgroundColor: 'transparent',
    borderRadius: moderateScale(4),
    minWidth: scale(80),
  },
  customCartButtonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
// ...existing code...
export default HorizontalProductCarousel;