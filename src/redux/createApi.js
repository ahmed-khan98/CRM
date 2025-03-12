import { BaseUrl } from '@/app/_Services/baseUrl';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const header = () => { return Cookies.get("token") }
console.log(header(),"head------------>>");


export const createApiAuction = createApi({
  reducerPath: 'auctions',
  baseQuery: fetchBaseQuery({ baseUrl:BaseUrl , 
    headers: {
    Authorization: `Bearer ${header()}`
  }}),
  endpoints: () => ({}),
});

