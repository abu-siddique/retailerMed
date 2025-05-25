import { Image, StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export default function EmptyCustomList() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/list-empty.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Data is not ready yet</Text>
        <Text style={styles.subText}>Please check back later</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa', // Light pharmacy-themed background
    paddingHorizontal: scale(20),
  },
  image: {
    width: scale(200),
    height: verticalScale(200),
    marginBottom: verticalScale(30),
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#2c3e50', // Dark pharmacy-themed text color
    marginBottom: verticalScale(5),
  },
  subText: {
    fontSize: moderateScale(14),
    color: '#7f8c8d', // Secondary text color
    textAlign: 'center',
  },
});