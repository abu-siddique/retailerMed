import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const Skeleton = (props) => {
  const { count, children } = props;
  const arr = Array(count).fill('_');

  return (
    <>
      {arr.map((_, index) =>
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { index });
          }
          return child;
        })
      )}
    </>
  );
};

const Items = (props) => {
  const { index, children, style } = props;
  
  return (
    <View style={[styles.itemsContainer, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { index });
        }
        return child;
      })}
    </View>
  );
};

const Item = ({ index, height = moderateScale(40), width = '100%', animated = false, style }) => {
  const pulseAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const animatedStyle = animated ? {
    opacity: pulseAnim,
  } : {};

  return (
    <Animated.View
      key={index}
      style={[
        styles.itemBase,
        {
          height: typeof height === 'number' ? verticalScale(height) : height,
          width: typeof width === 'number' ? moderateScale(width) : width,
        },
        animated === 'background' && styles.backgroundAnimated,
        animated === 'border' && styles.borderAnimated,
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    marginBottom: verticalScale(10),
  },
  itemBase: {
    backgroundColor: '#e1e1e1',
    borderRadius: moderateScale(4),
    marginBottom: verticalScale(8),
  },
  backgroundAnimated: {
    backgroundColor: '#e1e1e1',
  },
  borderAnimated: {
    borderWidth: moderateScale(2),
    borderColor: '#c1c1c1',
    backgroundColor: 'transparent',
  },
});

Skeleton.Items = Items;
Skeleton.Item = Item;

export default Skeleton;