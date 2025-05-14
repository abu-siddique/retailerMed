import { useEffect } from 'react';
import { moderateScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';

export default function HandleResponse({
  isSuccess,
  isError,
  error = 'An error occurred',
  message = 'Operation successful',
  onSuccess,
  onError,
}) {
  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: message,
        visibilityTime: 4000,
        topOffset: moderateScale(40),
      });
    }

    if (isError) {
      onError?.();
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        visibilityTime: 5000,
        topOffset: moderateScale(40),
      });
    }
  }, [isSuccess, isError, error, message, onSuccess, onError]);

  return null;
}