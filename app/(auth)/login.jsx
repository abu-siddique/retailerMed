import { Ionicons } from '@expo/vector-icons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import * as Clipboard from 'expo-clipboard';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import Button from '../../component/common/button';
import { useSendOtpMutation, useVerifyOtpMutation } from '../../component/services';
import { userLogin } from '../../component/store';
import Logo from '../../svgs/medclavis_logo_laptop.png';

const RESEND_TIMEOUT = 30; // Seconds

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [stage, setStage] = useState('phone');
  const [sentPhone, setSentPhone] = useState('');
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState('');
  const [clearInput, setclearInput] = useState(false)

  // API Hooks
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  // Timer Effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Clipboard Check Effect
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const text = await Clipboard.getStringAsync();
        const otpMatch = text.match(/\b\d{6}\b/);
        if (otpMatch && stage === 'otp') {
            setOtp(otpMatch[0] || '') 
            handleVerifyOtp(otpMatch[0] || '')
        }
      } catch (err) {
        console.log('Clipboard error:', err);
      }
    };

    if (stage === 'otp') checkClipboard();
  }, [stage]);

  // SMS Retriever (Android)
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Create a more robust SMS retriever mock
      const mockSmsRetriever = {
        // Direct function properties
        removeAllListeners: () => {},
        requestPhoneNumber: () => Promise.resolve(''),
        startOtpListener: () => Promise.resolve(''),
        stopOtpListener: () => Promise.resolve(''),
        request: () => Promise.resolve(''),
        
        // Nested properties with full structure
        SMS: {
          startRetriever: () => Promise.resolve({ message: null }),
          stopRetriever: () => Promise.resolve('')
        },
        
        // Handle any other potential property access
        get: function() { return () => Promise.resolve('') }
      };
      
      // Make this a global variable
      global.SMS_MODULE = mockSmsRetriever;
      
      // Create a fully non-null mock of the module
      const smsRetrieverProxy = new Proxy(mockSmsRetriever, {
        get: function(target, prop) {
          if (prop in target) {
            return target[prop];
          }
          // Return a function for any missing property
          return typeof prop === 'symbol' 
            ? () => {} 
            : () => Promise.resolve('');
        }
      });
      
      // Override require for the SMS retriever module
      try {
        const originalRequire = global.require || global.__r;
        global.require = function(moduleName) {
          if (moduleName === 'react-native-sms-retriever') {
            return smsRetrieverProxy;
          }
          return originalRequire(moduleName);
        };
      } catch (error) {
        console.log('Failed to override require:', error);
      }
      
      try {
        const listenForSMS = async () => {
          try {
            await global.SMS_MODULE.request();
            const smsResponse = await global.SMS_MODULE.SMS.startRetriever();
            if (smsResponse && smsResponse.message) {
              const otpMatch = smsResponse.message.match(/\b\d{6}\b/);
              if (otpMatch) {
                setOtp(otpMatch[0] || '');
                handleVerifyOtp(otpMatch[0] || '');
              }
            }
          } catch (err) {
            console.log('SMS retriever operation failed:', err);
            // Continue with the app even if SMS retriever fails
          }
        };

        listenForSMS();
        
        // Cleanup function
        return () => {
          try {
            if (global.SMS_MODULE && global.SMS_MODULE.SMS && typeof global.SMS_MODULE.SMS.stopRetriever === 'function') {
              global.SMS_MODULE.SMS.stopRetriever();
            }
          } catch (error) {
            // Silently handle cleanup errors
          }
        };
      } catch (error) {
        console.log('SMS retriever setup failed:', error);
      }
    }
  }, [stage]);

  const handleSendOtp = (phone) => {
    Keyboard.dismiss();
    setOtp(''); // Clear existing OTP input
    setclearInput(true)



    sendOtp(phone)
      .unwrap()
      .then((data) => {
        console.log('OTP sent:', data);
        setSentPhone(phone);
        setStage('otp');
        setTimer(RESEND_TIMEOUT);
        setOtp(''); // Clear existing OTP input
      })
      .catch((err) => {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err.data?.message || 'Failed to send OTP',
            visibilityTime: 3000,
          });
      });
  };

  const handleVerifyOtp = (code) => {
    if (code.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter 6-digit code',
        visibilityTime: 3000,
      });
      setclearInput(true);
      setOtp('');
      return;
    }
  
    verifyOtp({ phone: sentPhone, otp: code })
      .unwrap()
      .then((data) => {
        console.log('OTP verified:', data);
        dispatch(userLogin({ token: data.token, userData: data.user }));
        
        try {
          // Use same navigation logic as handleGoBack
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        } catch (error) {
          console.log('Navigation error:', error);
          router.push('/');
        }
      })
      .catch((err) => {
        console.log('Verification error:', err);
        Toast.show({
          type: 'error',
          text1: 'OTP could not be verified',
          text2: 'Please try after some time',
          visibilityTime: 3000,
        });
        setclearInput(true);
        setOtp('');
      });
  };

  const handleGoBack = () => {
    try {
      // First try to go back, if possible
      if (router.canGoBack()) {
        router.back();
      } else {
        // Only go to home if no back history is available
        router.replace('/');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      // Fallback navigation if everything fails
      router.push('/');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={{ marginLeft: 16, padding: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color="blue" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            color: '#000000',
            fontWeight: '600',
          },
          headerShadowVisible: true,
        }}
      />
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} />

        {stage === 'phone' ? (
          <View style={styles.phoneStage}>
            <Text style={styles.title}>Enter Mobile Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                autoComplete="tel"
                maxLength={10}
                value={sentPhone || ''}
                onChangeText={(text) => setSentPhone(text || '')}
              />
            </View>
            <Button
              loading={isSending}
              onPress={() => handleSendOtp(sentPhone)}
              style={styles.button}
            > Send OTP </Button>
          </View>
        ) : (
          <View style={styles.otpStage}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Sent to {sentPhone}</Text>

            <OTPInputView
              style={styles.otpContainer}
              pinCount={6}
              code={otp || ''} // Ensure `otp` is always a string
              onCodeChanged={(otp) => {setOtp(otp || '') ; setclearInput(false)}}
              clearInputs={clearInput}
              autoFocusOnLoad
              codeInputFieldStyle={styles.otpInput}
              codeInputHighlightStyle={styles.otpInputActive}
              onCodeFilled={(code) => handleVerifyOtp(code)}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.timerText}>
                {timer > 0 ? `Resend OTP in ${timer}s` : ' '}
              </Text>
              <Button
                type="text"
                disabled={timer > 0}
                onPress={() => handleSendOtp(sentPhone)}
                labelStyle={styles.resendButton}
              >Resend OTP </Button>
            </View>

            <Button
              loading={isLoading}
              onPress={() => handleVerifyOtp(otp || '')}
              style={styles.button}
            > Verify </Button>
          </View>
        )}
        <Toast />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: scale(20),
  },
  logo: {
    width: scale(200),
    height: verticalScale(80),
    alignSelf: 'center',
    marginTop: verticalScale(40),
    marginBottom: verticalScale(60),
    resizeMode: 'contain',
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(30),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(20),
  },
  input: {
    fontSize: moderateScale(16),
    padding: verticalScale(14),
    color: '#333',
  },
  button: {
    height: verticalScale(50),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(10),
    minWidth: moderateScale(100),
    paddingVertical: verticalScale(8),
  },
  otpStage: {
    flex: 1,
    justifyContent: 'center',
  },
  otpContainer: {
    height: verticalScale(80),
    marginBottom: verticalScale(20),
  },
  otpInput: {
    width: scale(45),
    height: verticalScale(45),
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: moderateScale(8),
    color: '#333',
    fontSize: moderateScale(20),
  },
  otpInputActive: {
    borderColor: '#007AFF',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(15),
  },
  timerText: {
    fontSize: moderateScale(12),
    color: '#999',
    marginRight: scale(10),
  },
  resendButton: {
    color: '#007AFF',
    fontSize: moderateScale(14),
  },
});