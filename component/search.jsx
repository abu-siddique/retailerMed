import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

import Icons from './common/icons'

export default function Search({ placeholder }) {
  //? Handlers
  const handleSearch = () => {
    router.push('/search')
  }

  //? Render(s)
  return (
    <TouchableOpacity
      onPress={handleSearch}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icons.EvilIcons 
          name="search" 
          size={moderateScale(24)} 
          color="#5A67D8" 
        />
      </View>
      <Text style={styles.text}>
        {placeholder || "Search medicines, surgicals products..."}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: moderateScale(10),
    backgroundColor: '#F3F4FF',
    alignItems: 'center',
    padding: moderateScale(10),
    paddingVertical: moderateVerticalScale(8),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: moderateScale(6),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(2),
    marginVertical: moderateVerticalScale(2),
  },
  text: {
    flex: 1,
    paddingVertical: moderateVerticalScale(2),
    textAlign: 'left',
    color: '#718096',
    fontSize: moderateScale(14),
    fontWeight: '400',
    includeFontPadding: false,
  }
})