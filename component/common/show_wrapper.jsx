import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import EmptyCustomList from '../emptylist/empty_custom_list';
import PageLoading from '../loading/page_loading';

export default function ShowWrapper(props) {
  // Props
  const {
    isError,
    error,
    refetch,
    isFetching,
    dataLength,
    type = 'list',
    originalArgs = null,
    isSuccess,
    emptyComponent,
    loadingComponent,
    children,
  } = props;

  // Render
  return (
    <View style={styles.container}>
      {isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error?.error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refetch}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : isFetching ? (
        type === 'list' && originalArgs && originalArgs?.page > 1 ? (
          children
        ) : (
          <View style={styles.loadingContainer}>
            {loadingComponent || <PageLoading />}
          </View>
        )
      ) : isSuccess && type === 'list' && dataLength > 0 ? (
        children
      ) : isSuccess && type === 'list' && dataLength === 0 ? (
        emptyComponent || <EmptyCustomList />
      ) : isSuccess && type === 'detail' ? (
        children
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    paddingVertical: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: moderateScale(16),
    color: '#2c3e50',
    marginBottom: verticalScale(8),
    fontWeight: '500',
  },
  errorMessage: {
    fontSize: moderateScale(14),
    color: '#e74c3c',
    marginBottom: verticalScale(16),
    textAlign: 'center',
    paddingHorizontal: scale(20),
  },
  retryButton: {
    backgroundColor: '#3498db', // Pharmacy blue color
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(32),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});