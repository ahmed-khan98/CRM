import { createApiAuction } from "@/redux/createApi"

const biddingProductApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
  biddingItems: builder.query({
      query: () => 'user/auction/bidding-products',
      keepUnusedDataFor: 180, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useBiddingItemsQuery } = biddingProductApi