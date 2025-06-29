import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Info = (props) => {
  // Destructure props
  const { 
    pack_of, 
    quantity, 
    ideal_for, 
    package_type 
  } = props;

  // Check if we have any additional info to show
  const hasAdditionalInfo = pack_of || quantity || ideal_for || package_type;

  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Details</Text>
      
      {/* Additional Info Section */}
      {hasAdditionalInfo && (
        <View style={styles.infoContainer}>
          {pack_of && (
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Pack of:</Text>
              <Text style={styles.infoValue}>{pack_of}</Text>
            </View>
          )}
          {quantity && (
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Quantity:</Text>
              <Text style={styles.infoValue}>{quantity}</Text>
            </View>
          )}
          {ideal_for && (
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Ideal for:</Text>
              <Text style={styles.infoValue}>{ideal_for}</Text>
            </View>
          )}
          {package_type && (
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Package type:</Text>
              <Text style={styles.infoValue}>{package_type}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};



// ...existing code...

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
  },
  title: {
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(16, 0.8),
    fontWeight: '600',
    color: '#111827',
    textDecorationLine: 'underline'
  },
  infoContainer: {
    marginBottom: verticalScale(8),
    gap: scale(2),
  },
  infoItem: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(10),
    alignItems: 'center',
  },
  infoTitle: {
    width: scale(90),
    lineHeight: verticalScale(18),
    fontWeight: '500',
    color: '#6b7280',
    fontSize: moderateScale(14, 0.8),
  },
  infoValue: {
    color: '#111827',
    flex: 1,
    lineHeight: verticalScale(18),
    fontSize: moderateScale(14, 0.8),
  }
});


export default Info;