import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

// Step 1: Original base query
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// Step 2: Wrap it with custom error handling
const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  // console.log('API Result:', result);
  if (
    result?.error?.status === 401 || 
    result?.error?.data?.statusCode === 401 
  ) {
    Cookies.remove("token");
    Cookies.remove("currentuser");
    window.location.href = '/login';
  }
  return result;
};

export const createApiAuction = createApi({
  reducerPath: 'auctions',
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ['watch'],
  endpoints: () => ({}),
});
