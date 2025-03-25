import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getTodayyAuctionsProduct: builder.query({
      query: () => 'user/product',
      providesTags: ['auction'],
      
    }),
    productDetail: builder.query({
      query: (id) => `user/product/${id}`,
      providesTags:['detailproduct'],
      invalidatesTags: ['watch'],
    }),
    addBid: builder.mutation({
      query: (formData) => {
        return {
          url: `user/product/${formData?.id}/PlaceBid`,
          method: 'POST',
          body: { bidAmount: formData?.bidAmount },
        }
      },
      invalidatesTags: ['auction','detailproduct']
    }
    ),
    addWatch: builder.query({
      query: (id) => `user/product/${id}/watch`,
      providesTags:['watch']
    }),
  }),
})

export const { useGetTodayyAuctionsProductQuery,useAddWatchQuery, useProductDetailQuery,useAddBidMutation } = productApi