import Clipboard from '@react-native-clipboard/clipboard';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import Button from '../../component/common/button';
import { useSendOtpMutation, useVerifyOtpMutation } from '../../component/services';
import { userLogin } from '../../component/store';
import Logo from '../../svgs/logo.svg';

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
        const text = await Clipboard.getString();
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
      const { request, SMS } = require('react-native-sms-retriever');
      
      const listenForSMS = async () => {
        try {
          await request();
          const sms = await SMS.startRetriever();
          const otpMatch = sms.message.match(/\b\d{6}\b/);
          if (otpMatch) {
            setOtp(otpMatch[0] || '') 
            handleVerifyOtp(otpMatch[0] || '')
          }
        } catch (err) {
          console.log('SMS retriever error:', err);
        }
      };

      listenForSMS();
    }
  }, []);

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
        router.back();
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

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Login',
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.container}>
        <Logo style={styles.logo} />

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