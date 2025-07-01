import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Only add token for certain endpoints
      console.log(`Base URL: ${process.env.EXPO_PUBLIC_BASE_URL}`)
      const protectedEndpoints = ['checkout', 'placeOrder', 'userProfile', 'getUserInfo']
      console.log(' Endpoints:', endpoint)
      if (protectedEndpoints.includes(endpoint)) {
        const token = getState().user.token
        if (token) headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json');
      headers.set('ngrok-skip-browser-warning', 'true'); // Helps with ngrok issues
      headers.set('Access-Control-Allow-Origin', '*'); // CORS header for development
      return headers
    },
  }),
  tagTypes: ['User', 'Category', 'Product'],
  endpoints: builder => ({})
})

export default apiSlice


