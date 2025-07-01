import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

import EmptySearch from '../../svgs/empty-search'

export default function EmptySearchList() {
  return (
    <View style={styles.container}>
      <EmptySearch style={styles.emptyIcon} />
      <View style={styles.messageContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>No results found</Text>
        </View>
        <Text style={styles.subtitle}>Try using more variable words or check your input parameters</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(20)
  },
  emptyIcon: {
    width: scale(60),
    height: scale(60),
    alignSelf: 'center'
  },
  messageContainer: {
    maxWidth: scale(300),
    padding: moderateScale(8),
    marginHorizontal: 'auto',
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: moderateScale(6),
    rowGap: verticalScale(8)
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(8)
  },
  title: {
    fontSize: moderateScale(14),
    fontWeight: '500'
  },
  subtitle: {
    fontSize: moderateScale(12),
    color: '#6b7280'
  }
})
