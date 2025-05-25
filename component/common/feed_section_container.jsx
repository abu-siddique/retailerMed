import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const FeedSectionContainer = (props) => {
  // Props
  const { 
    title, 
    showMore = false, 
    onJumptoMore, 
    children, 
    style = {} 
  } = props;

  // Handlers
  const handleJumpMore = () => {
    onJumptoMore?.();
  };

  // Render
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {showMore && (
          <TouchableOpacity
            onPress={handleJumpMore}
            style={styles.moreButton}
            activeOpacity={0.7}
          >
            <Text style={styles.moreText}>View All</Text>
            <AntDesign 
              name="arrowright" 
              size={scale(14)} 
              color="#2D7BC6" // Pharmacy blue color
            />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(24),
    width: '100%',
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    shadowColor: '#1A56DB20', // Soft blue shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAccent: {
    width: moderateScale(4),
    height: moderateScale(20),
    backgroundColor: '#1A56DB', // Pharmacy accent blue
    borderRadius: moderateScale(2),
    marginRight: scale(8),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#1A3E72', // Dark pharmacy blue
    marginRight: 'auto',
    fontFamily: 'System', // Consider using a professional font like 'SFProDisplay-Semibold'
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    borderRadius: moderateScale(20),
    backgroundColor: '#F0F7FF', // Very light blue background
  },
  moreText: {
    color: '#2D7BC6', // Pharmacy blue
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});

export default FeedSectionContainer;