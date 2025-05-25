import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export default function Loading(props) {
  // Props
  const { style } = props;

  // Animation values
  const onePoint = useSharedValue(0);
  const twoPoint = useSharedValue(0);
  const threePoint = useSharedValue(0);
  const fourPoint = useSharedValue(1);

  // Animated styles
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
    onePoint.value = withRepeat(withTiming(1, { duration: 600 }), -1, false);
    twoPoint.value = withRepeat(withTiming(moderateScale(24), { duration: 600 }), -1, false);
    threePoint.value = withRepeat(withTiming(moderateScale(24), { duration: 600 }), -1, false);
    fourPoint.value = withRepeat(withTiming(0, { duration: 600 }), -1, false);
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.dot, styles.dot1, animatedOnePointStyles]} />
      <Animated.View style={[styles.dot, styles.dot2, animatedTwoPointStyles]} />
      <Animated.View style={[styles.dot, styles.dot3, animatedThreePointStyles]} />
      <Animated.View style={[styles.dot, styles.dot4, animatedFourPointStyles]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: moderateScale(80),
    height: verticalScale(24),
    position: 'relative',
    display: 'flex',
  },
  dot: {
    width: moderateScale(13),
    height: moderateScale(13),
    backgroundColor: 'lightgrey',
    borderRadius: moderateScale(13) / 2,
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