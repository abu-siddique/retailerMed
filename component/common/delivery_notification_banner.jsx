import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const DeliveryNotificationBanner = () => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const screenWidth = Dimensions.get('window').width;

  React.useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    return () => pulseAnim.stopAnimation(); // Cleanup animation
  }, []);

  // Adjust text size based on screen width
  const fontSize = screenWidth < 350 ? moderateScale(12) : moderateScale(14);

  return (
    <View style={styles.banner}>
      <View style={styles.contentContainer}>
        <View style={styles.iconTextContainer}>
          <MaterialCommunityIcons 
            name="truck-delivery-outline" 
            size={moderateScale(20)} 
            color="#3b82f6" 
            style={styles.icon} 
          />
          <Text style={[styles.text, { fontSize }]} numberOfLines={2}>
            <Text style={styles.boldText}>Next Day Delivery</Text> for orders placed before 11 PM today!
          </Text>
        </View>
        <Animated.View style={[styles.notificationIcon, { transform: [{ scale: pulseAnim }] }]}>
          <FontAwesome name="bell" size={moderateScale(16)} color="#3b82f6" />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
    backgroundColor: '#f0f9ff', // Light blue background
    borderWidth: 1,
    borderColor: '#93c5fd', // Light blue border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexShrink: 1,
    maxWidth: '90%',
  },
  icon: {
    marginRight: scale(8),
    marginTop: verticalScale(2),
  },
  text: {
    color: '#1e40af', // Dark blue text
    fontWeight: '500',
    flexShrink: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  notificationIcon: {
    marginLeft: scale(8),
  }
});

export default DeliveryNotificationBanner;