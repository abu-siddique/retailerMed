import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import ResponsiveImage from '../common/resonsive_image';

const ImageGallery = (props) => {
  const { images, productName } = props;
  const width = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={moderateVerticalScale(250)} // Adjust height as needed
        autoPlay={true}
        autoPlayInterval={3000} // 3 seconds between slides
        data={images}
        scrollAnimationDuration={1000} // Animation duration
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10], // Better touch responsiveness
        }}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <ResponsiveImage
              key={index}
              style={styles.image}
              imageStyles={styles.image}
              source={{ uri: item.url }}
              alt={productName}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: moderateVerticalScale(16),
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: moderateScale(300),
    height: moderateVerticalScale(200),
    borderRadius: moderateScale(8),
    marginVertical: moderateVerticalScale(2),
    alignSelf: 'center',
  },
});

export default ImageGallery;