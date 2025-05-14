import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'

export default function DisplayError({ errors, style }) {
  return (
    <View style={[styles.container, style]}>
      {errors?.message && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors.message}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: verticalScale(29), // Responsive minimum height
    justifyContent: 'center',
    paddingHorizontal: moderateScale(4), // Small horizontal padding
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(2),
  },
  errorText: {
    color: '#DC2626', // Red-600 equivalent
    fontSize: moderateScale(14), // Responsive font size
    fontWeight: '500',
    includeFontPadding: false, // Better text alignment
    textAlignVertical: 'center',
  },
})