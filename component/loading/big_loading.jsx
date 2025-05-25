import { Image, StyleSheet, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Loading from './loading';

export default function BigLoading() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../svgs/medclavis_logo_laptop.png')} // Update this path to your actual logo path
        style={styles.logo}
        resizeMode="contain"
      />
      <Loading />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: moderateScale(16),
    marginHorizontal: 'auto',
    rowGap: verticalScale(16),
    textAlign: 'center',
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(254, 254, 254, 0.9)',
    maxWidth: '80%',
    alignSelf: 'center',
  },
  logo: {
    width: moderateScale(128),
    height: moderateScale(40),
    marginHorizontal: 'auto',
  },
});