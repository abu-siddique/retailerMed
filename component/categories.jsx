import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import FeedSectionContainer from './common/feed_section_container';


const imageImports = {
    'surgical.png': require('../assets/images/surgical.png'),
    'medicine.png': require('../assets/images/medicine.png'),
    'household.png': require('../assets/images/household.png'),
    'baby.jpg': require('../assets/images/baby.jpg'),
    'wellness.jpg': require('../assets/images/wellness.jpg'),
};



const Categories = ({ categories }) => {
    // Import all images from assets/images
   

    const getImageSource = (imageName) => {
        return imageImports[imageName] || require('../assets/images/surgical.png');
      };
    




  return (
    <FeedSectionContainer title="Shop Categories">
      <View style={styles.gridContainer}>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={{
              pathname: '/products',
              params: { category: category.slug },
            }}
            asChild
          >
            <TouchableOpacity style={styles.categoryCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={getImageSource(category.image)}
                  style={[styles.image]}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.categoryName}>
                {category.name}
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </FeedSectionContainer>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: moderateScale(12),
    gap: moderateScale(12),
  },
  categoryCard: {
    width: '30%', // Roughly 3 columns
    alignItems: 'center',
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(12),
  },
  imageContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    marginBottom: moderateScale(8),
 
  },
  image: {
    width: '100%',
    height: '100%',

  },
  categoryName: {
    fontSize: moderateScale(12),
    color: '#1F2937',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Categories;