import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

const OfferBadge = ({ buy, get, containerStyle, textStyle }) => {
  if (!buy || !get) return null;

  return (
    <View style={[styles.badge, containerStyle]}>
      <Text style={[styles.text, textStyle]}>BUY {buy} GET {get} FREE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#2e9900',
    paddingVertical: moderateVerticalScale(4),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(2),
    alignSelf: 'stretch', // This makes it take full width
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: moderateScale(8),
    fontWeight: '400',
  },
});

export default OfferBadge;