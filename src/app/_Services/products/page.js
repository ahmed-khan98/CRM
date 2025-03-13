import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getTodayyAuctionsProduct: builder.query({
      query: () => 'user/product/auctionProducts',
      providesTags: ['auction'],
      
    }),
    productDetail: builder.query({
      query: (id) => `user/product/${id}`,
    }),
    addBid: builder.mutation({
      query: (formData) => {
        return {
          url: `user/product/${formData?.id}/PlaceBid`,
          method: 'POST',
          body: { bidAmount: formData?.bidAmount },
        }
      },
      invalidatesTags: ['auction']
    }
    ),
    addWatch: builder.query({
      query: (id) => `user/product/${id}/watch`,
    }),
  }),
})

export const { useGetTodayyAuctionsProductQuery,useAddWatchQuery, useProductDetailQuery,useAddBidMutation } = productApi