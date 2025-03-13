import { BaseUrl } from '@/app/_Services/baseUrl';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const createApiAuction = createApi({
  reducerPath: 'auctions',
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token"); 
      console.log("Token inside prepareHeaders:", token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: () => ({}),
});
