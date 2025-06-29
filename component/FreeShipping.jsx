import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import FreeShippingSvg from '../svgs/freeShipping.svg'; // Adjust the import path as necessary

const FreeShipping = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Free Shipping</Text>
          <Text style={styles.subtitle}>On orders over Rs. 5000</Text>
        </View>
        <View style={styles.svgContainer}>
          <FreeShippingSvg width={scale(128)} height={scale(80)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff', // bg-white
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: moderateScale(8), // rounded-lg
  },
  textContainer: {
    padding: moderateScale(12), // p-3
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  subtitle: {
    marginTop: verticalScale(8), // mt-2
    fontSize: moderateScale(12), // text-xs
    color: '#6b7280', // text-gray-500
  },
  svgContainer: {
    paddingHorizontal: scale(16), // px-4
    justifyContent: 'center',
  },
});

export default FreeShipping;