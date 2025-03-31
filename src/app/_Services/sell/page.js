import { createApiAuction } from "@/redux/createApi"

const sellApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getSell: builder.query({
      query: () => 'user/sell',
    }),
  }),
})

export const { useGetSellQuery } = sellApi