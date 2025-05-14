import React from 'react'
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'

export const Button = ({
  isLoading = false,
  children,
  style,
  isRounded = false,
  onPress,
  disabled = false,
  ...props
}) => {
  const animatedValue = new Animated.Value(1)

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
      <TouchableOpacity
        disabled={disabled || isLoading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.button,
          isRounded && styles.rounded,
          style,
          (disabled || isLoading) && styles.disabled,
        ]}
        activeOpacity={0.8}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size={moderateScale(24)} />
        ) : (
          <Text style={styles.buttonText}>{children}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export const LoginBtn = (props) => (
  <Button
    style={styles.loginButton}
    isRounded
    {...props}
  />
)

export const SubmitModalBtn = (props) => (
  <Button
    style={styles.modalButton}
    {...props}
  />
)

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2A86FF', // Pharmacy primary color
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(24),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: moderateScale(140),
    maxWidth: moderateScale(300),
    marginVertical: verticalScale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  rounded: {
    borderRadius: moderateScale(30),
  },
  disabled: {
    opacity: 0.6,
  },
  loginButton: {
    width: moderateScale(240),
    borderRadius: moderateScale(30),
    paddingVertical: verticalScale(16),
  },
  modalButton: {
    width: moderateScale(280),
    paddingVertical: verticalScale(14),
  },
})

export default Button