import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

export default function LogoLoading({ style, size = 50, color = '#007AFF' }) {
  // Animation values
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const opacity = useSharedValue(0.85);

  // Animated styles
  const animatedLogoStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
      opacity: opacity.value,
    };
  });

  // Start animations
  React.useEffect(() => {
    // Bouncing animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.bounce })
      ),
      -1,
      true
    );

    // Squeeze effect animation (horizontal stretch followed by vertical stretch)
    const animateSqueezeEffect = () => {
      // Horizontal squeeze and stretch
      scaleX.value = withSequence(
        withTiming(1.15, { duration: 400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 300, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) }),
        withDelay(600, withTiming(1, { duration: 1 })) // Short delay before next sequence
      );
      
      // Vertical squeeze and stretch (with slight delay)
      scaleY.value = withSequence(
        withDelay(200, withTiming(0.9, { duration: 300, easing: Easing.inOut(Easing.quad) })),
        withTiming(1.1, { duration: 400, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) }),
        withDelay(400, withTiming(1, { duration: 1 })) // Short delay before next sequence
      );
      
      // Pulsing opacity
      opacity.value = withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.quad) })
      );
      
      // Repeat the entire sequence
      setTimeout(animateSqueezeEffect, 2000);
    };
    
    animateSqueezeEffect();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[
        styles.logoContainer, 
        { width: moderateScale(size), height: moderateScale(size) }, 
        animatedLogoStyles
      ]}>
        <Image 
          source={require('../../svgs/medclavis_logo_laptop.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(10),
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '95%',
    height: '95%',
  },
});