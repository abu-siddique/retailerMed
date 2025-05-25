import { useSelector } from 'react-redux'
import { selectAuthToken } from '../store'

export default function useVerify() {
  const token = useSelector(selectAuthToken)
  console.log('useVerify', token)
  return Boolean(token)
}
