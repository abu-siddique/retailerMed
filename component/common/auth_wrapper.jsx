import SigninPromoRenderer from '../render/sign-in-promo-render'

import useUserInfo from '../hooks/use_user_info'

export default function AuthWrapper({ children }) {
  const { userInfo, isVerify, isLoading } = useUserInfo()
  console.log('AuthWrapper', userInfo, isVerify, isLoading)

  return (
    <>{isLoading ? null : !isVerify || !userInfo ? <SigninPromoRenderer /> : <>{children}</>}</>
  )
}
