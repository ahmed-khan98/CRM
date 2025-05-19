import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getSortTitle: builder.query({
      query: () => 'user/sortTitle/',
      providesTags: ['sortTitle'],
      keepUnusedDataFor: 3800, 
      refetchOnMountOrArgChange: false,
    }),
    getTodayyAuctionsProduct: builder.query({
      query: () => 'user/product/allProducts',
      providesTags: ['auction'],
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getMissedProduct: builder.query({
      query: () => 'user/product/missedProducts',
      providesTags: ['auction'],
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    productDetail: builder.query({
      query: (id) => `user/product/${id}`,
      providesTags:['detailproduct'],
      invalidatesTags: ['watch'],
    }),
    relatedProducts: builder.query({
      query: (id) => `user/product/${id}/relatedProducts`,
    }),
    addListing: builder.mutation({
      query: (formData) => {
        return {
          url: 'user/product/add/user',
          method: 'POST',
          body: formData ,
        }
      },
      invalidatesTags: ['auction','detailproduct']
    }
    ),
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

export const { useGetSortTitleQuery,useAddListingMutation,useGetTodayyAuctionsProductQuery,useAddWatchQuery, useProductDetailQuery,useAddBidMutation ,useGetMissedProductQuery,useRelatedProductsQuery} = productApi