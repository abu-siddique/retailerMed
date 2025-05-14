import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

import Icons from './common/icons'

export default function Search(props) {
  //? Handlers
  const handleSearch = () => {
    router.push('/search')
  }

  //? Render(s)
  return (
    <TouchableOpacity
      onPress={handleSearch}
      style={styles.container}
    >
      <Text style={styles.text}>
        Make the most of tools — use search...
      </Text>
      <Icons.EvilIcons 
        name="search" 
        size={moderateScale(24)} 
        color="#1F2937" 
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(228, 228, 231, 0.8)',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(4),
  },
  text: {
    flex: 1,
    paddingVertical: moderateVerticalScale(4),
    paddingHorizontal: moderateScale(12),
    textAlign: 'left',
    color: '#9ca3af',
    fontSize: moderateScale(14),
    includeFontPadding: false,  // For better text alignment
  }
})