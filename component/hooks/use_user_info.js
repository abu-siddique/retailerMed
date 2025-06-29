import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetUserInfoQuery } from '../services';
import { userLogout } from '../store';
import useVerify from './use_verify';

export default function useUserInfo() {
  const dispatch = useDispatch();
  const isVerify = useVerify();

  const { data, isLoading, error, isError } = useGetUserInfoQuery(undefined, {
    skip: !isVerify,
  });

  // Logout on token/profile fetch error
  useEffect(() => {
    if (isError) {
      dispatch(userLogout());
      // Optionally show a message: “Session expired, please log in again.”
    }
  }, [isError, dispatch]);

  console.log('useUserInfo', data, isLoading, error, isError);

  const isLoginVerify = Boolean(isVerify && !isLoading && data?._id);

  const mustAuthAction = useCallback(
    (nextAction, redirectPath) => {
      if (!isLoginVerify) {
        router.push({
          pathname: '/login',
          params: { redirectTo: redirectPath },
        });
      } else {
        nextAction();
      }
    },
    [isLoginVerify]
  );

  return {
    userInfo: data,
    isVerify,
    isLoginVerify,
    mustAuthAction,
    isLoading,
    error,
    isError,
  };
}
