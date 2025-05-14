import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

export default function DiscountProduct({ discount }) {
  return (
    <View style={styles.container}>
      <Text style={styles.discountText}>{discount}% OFF</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25b374', // bg-red-500
    paddingTop: moderateVerticalScale(2), // pt-0.5 → ~2px
    paddingHorizontal: moderateScale(8), // px-2 → ~8px
    alignSelf: 'flex-start', // w-fit equivalent
    borderRadius: moderateScale(100), // rounded-full
    overflow: 'hidden',
  },
  discountText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    lineHeight: moderateScale(16), // Better vertical alignment
    paddingBottom: moderateVerticalScale(2), // Balance the top padding
  },
});