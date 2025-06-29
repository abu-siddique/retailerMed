import { router } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';

export default function SigninPromoRenderer({ tips = 'Sign in to unlock more features' }) {
  const { width } = Dimensions.get('window');
  
  const handleJumpLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/sign-in-promo.png')} 
        style={[styles.image, { width, height: width * 0.18 }]} 
        resizeMode="contain"
      />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>You are not signed in</Text>
        <Text style={styles.tipText}>{tips}</Text>
      </View>
      
      <TouchableOpacity
        onPress={handleJumpLogin}
        style={styles.loginButton}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(16),
  },
  image: {
    marginBottom: moderateVerticalScale(16),
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: moderateVerticalScale(16),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: moderateVerticalScale(8),
  },
  tipText: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#ef4444',
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(100),
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});