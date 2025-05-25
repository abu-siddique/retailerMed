import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Only add token for certain endpoints
      console.log(`Base URL: ${process.env.EXPO_PUBLIC_BASE_URL}`)
      const protectedEndpoints = ['checkout', 'placeOrder', 'userProfile']
      console.log(' Endpoints:', endpoint)
      if (protectedEndpoints.includes(endpoint)) {
        const token = getState().user.token
        if (token) headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Category'],
  endpoints: builder => ({})
})

export default apiSlice


