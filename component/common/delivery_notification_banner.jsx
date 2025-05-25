import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const DeliveryNotificationBanner = () => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

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

  return (
    <LinearGradient
      colors={['#2563eb', '#3b82f6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.banner}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconTextContainer}>
          <MaterialCommunityIcons 
            name="truck-outline" 
            size={24} 
            color="white" 
            style={styles.icon} 
          />
          <Text style={styles.text}>
            <Text style={styles.boldText}>Next Day Delivery</Text> for orders placed before 11 PM today!
          </Text>
        </View>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <FontAwesome name="bell" size={20} color="white" />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '700',
  },
});

export default DeliveryNotificationBanner;