import { createApiAuction } from "@/redux/createApi"

const wishlistApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    addWishlist: builder.mutation({
        query: (formData) => ({
          url: 'userLogin',
          method: 'POST',
          body: formData,
        }),
      }),
      getAllWishlist: builder.query({
        query: () => '',
      }),
  }),
})

export const {useAddWishlistMutation,useGetAllWishlistQuery} = wishlistApi