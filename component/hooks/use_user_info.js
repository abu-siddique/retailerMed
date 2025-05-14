import { userLogout } from '@/store';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetUserInfoQuery } from '../services';
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

  const isLoginVerify = Boolean(isVerify && !isLoading && data?.data);

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
    userInfo: data?.data,
    isVerify,
    isLoginVerify,
    mustAuthAction,
    isLoading,
    error,
    isError,
  };
}
