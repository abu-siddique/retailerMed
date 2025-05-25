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
import { moderateScale, verticalScale } from 'react-native-size-matters';

export default function BigLogoLoading({ style, logoSize = 50, color = 'lightgrey' }) {
  // Logo animation values
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const opacity = useSharedValue(0.85);

  // Dots animation values
  const onePoint = useSharedValue(0);
  const twoPoint = useSharedValue(0);
  const threePoint = useSharedValue(0);
  const fourPoint = useSharedValue(1);

  // Animated styles for logo
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

  // Animated styles for dots
  const animatedOnePointStyles = useAnimatedStyle(() => ({
    transform: [{ scaleX: onePoint.value }, { scaleY: onePoint.value }],
  }));

  const animatedTwoPointStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: twoPoint.value }, { translateY: 0 }],
  }));

  const animatedThreePointStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: threePoint.value }, { translateY: 0 }],
  }));

  const animatedFourPointStyles = useAnimatedStyle(() => ({
    transform: [{ scaleX: fourPoint.value }, { scaleY: fourPoint.value }],
  }));

  // Start animations
  React.useEffect(() => {
    // Dots animation
    onePoint.value = withRepeat(withTiming(1, { duration: 600 }), -1, false);
    twoPoint.value = withRepeat(withTiming(moderateScale(24), { duration: 600 }), -1, false);
    threePoint.value = withRepeat(withTiming(moderateScale(24), { duration: 600 }), -1, false);
    fourPoint.value = withRepeat(withTiming(0, { duration: 600 }), -1, false);

    // Logo bouncing animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.bounce })
      ),
      -1,
      true
    );

    // Logo squeeze effect animation (horizontal stretch followed by vertical stretch)
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
      {/* Dots loading animation above logo */}
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, styles.dot1, animatedOnePointStyles, { backgroundColor: color }]} />
        <Animated.View style={[styles.dot, styles.dot2, animatedTwoPointStyles, { backgroundColor: color }]} />
        <Animated.View style={[styles.dot, styles.dot3, animatedThreePointStyles, { backgroundColor: color }]} />
        <Animated.View style={[styles.dot, styles.dot4, animatedFourPointStyles, { backgroundColor: color }]} />
      </View>
      
      {/* Logo animation */}
      <Animated.View style={[
        styles.logoContainer, 
        { width: moderateScale(logoSize), height: moderateScale(logoSize) }, 
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
    marginTop: verticalScale(12), // Add some space below the dots
  },
  logo: {
    width: '95%',
    height: '95%',
  },
  // Dots styles
  dotsContainer: {
    width: moderateScale(80),
    height: verticalScale(24),
    position: 'relative',
    display: 'flex',
    marginBottom: verticalScale(5),
  },
  dot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    position: 'absolute',
    top: '15%',
  },
  dot1: {
    left: moderateScale(8),
  },
  dot2: {
    left: moderateScale(8),
  },
  dot3: {
    left: moderateScale(32),
  },
  dot4: {
    left: moderateScale(56),
  },
});