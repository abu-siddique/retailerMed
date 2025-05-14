import { FontAwesome } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

export default function OutOfStock({ phoneNumber = '1-800-123-4567' }) {
  const handleCallPress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.divider} />
        <FontAwesome 
          name="exclamation-circle" 
          size={moderateScale(18)} 
          style={styles.icon} 
        />
        <View style={styles.divider} />
      </View>
      
      <Text style={styles.unavailableText}>
        This item is temporarily unavailable
      </Text>
      
      <View style={styles.callToAction}>
        <Text style={styles.instructionText}>
          Call us to be notified when restocked:
        </Text>
        <TouchableOpacity onPress={handleCallPress}>
          <Text style={styles.phoneNumber}>
            {phoneNumber}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: moderateScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginVertical: moderateVerticalScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateVerticalScale(12),
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    flex: 1,
  },
  icon: {
    color: '#94a3b8',
    marginHorizontal: moderateScale(8),
  },
  unavailableText: {
    fontSize: moderateScale(14),
    color: '#475569',
    textAlign: 'center',
    marginBottom: moderateVerticalScale(8),
    fontWeight: '500',
  },
  callToAction: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: moderateScale(13),
    color: '#64748b',
    textAlign: 'center',
    marginBottom: moderateVerticalScale(4),
  },
  phoneNumber: {
    fontSize: moderateScale(15),
    color: '#2563eb',
    fontWeight: '600',
    textDecorationLine: 'underline',
    paddingVertical: moderateVerticalScale(4),
  },
});