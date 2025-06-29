import { useEffect } from 'react'

import { addToLastSeen } from '@/store'
import { useDispatch } from 'react-redux'

const InitialStore = props => {
  const { product } = props

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      addToLastSeen({
        productID: product._id,
        image: product.images[0],
        title: product.title,
      })
    )
  }, [product._id])
  return null
}

export default InitialStore
