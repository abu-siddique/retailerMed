import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { verticalScale } from 'react-native-size-matters';

// Import local images
const medicine = require('../../assets/images/0.png');
const surgical = require('../../assets/images/1.png');

const mockSliderData = [
  {
    id: 1,
    isPublic: true,
    image: {
      source: medicine,
      alt: 'Medicine '
    }
  },
  {
    id: 2,
    isPublic: true,
    image: {
      source: surgical,
      alt: 'Suricals'
    }
  }
];

export default function PharmacyImageSlider({ data = mockSliderData }) {
  const publicItems = data.filter(item => item.isPublic);
  // Use full width but account for gap
  const screenWidth = Dimensions.get('window').width;
  const itemGap = 0; // Gap between slides
  const width = screenWidth - itemGap; // Adjust width to create gap effect
  
  // Calculate height based on 1800:500 ratio (500/1800 = 0.2778) without using aspectRatio property
  const heightRatio = 800 / 1600;
  const height = width * heightRatio;

  if (publicItems.length === 0) return null;

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={height}
        autoPlay={true}
        data={publicItems}
        scrollAnimationDuration={1000}
        style={{ width: screenWidth }} // Full screen width container
        defaultIndex={0}
        loop={true}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.95,
          parallaxScrollingOffset: 0,
        }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={item.image.source}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={item.image.alt}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(8),
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
    marginHorizontal: 0, // Add some horizontal margin
    backgroundColor: '#fff', // Optional: add background to make gap more visible
    shadowColor: '#000', // Optional: add shadow for better separation
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
});