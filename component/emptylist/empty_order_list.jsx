import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import OrderEmpty from '../../svgs/order-empty.svg';

export default function EmptyOrdersList() {
  return (
    <View style={styles.container}>
      <OrderEmpty 
        width={moderateScale(208)} 
        height={moderateScale(208)}
        style={styles.image}
      />
      <Text style={styles.text}>List is empty</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateVerticalScale(80),
  },
  image: {
    alignSelf: 'center',
    marginBottom: moderateVerticalScale(16),
  },
  text: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    color: '#374151',
  },
});