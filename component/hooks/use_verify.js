import { useSelector } from 'react-redux'
import { selectAuthToken } from '../store'

export default function useVerify() {
  const token = useSelector(selectAuthToken)
  return Boolean(token)
}
