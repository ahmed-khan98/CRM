import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({

    getTodayyAuctionsProduct: builder.query({
      query: () => 'user/product/auctionProducts',
      providesTags: ['auction']
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
      invalidatesTags: ["auction"]
    }
    ),

    addProduct: builder.mutation({
      query: (formData) => ({
        url: 'user/product/add',
        method: 'POST',
        body: formData,
        formData: true
      }),
    }),
    getCategories: builder.query({
      query: () => 'user/category',
    }),
    getSubCategories: builder.query({
      query: (categoryId) => `user/subcategory/getAllSubCategoriesByCategoryId/${categoryId}`,
    }),

    addWatch: builder.query({
      query: (id) => `user/product/${id}/watch`,
    }),

    wonItems: builder.query({
      query: () => 'user/won',
    }),
    getMyProduct: builder.query({
      query: () => 'user/product/allProducts',
    }),
  }),
})

export const { useAddProductMutation,useGetMyProductQuery, useGetTodayyAuctionsProductQuery, useWonItemsQuery,useAddWatchQuery, useProductDetailQuery, useGetCategoriesQuery, useGetSubCategoriesQuery, useAddBidMutation } = productApi