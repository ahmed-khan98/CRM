import { createApiAuction } from "@/redux/createApi"

const wishlistApi = createApiAuction.injectEndpoints({
    overrideExisting: true,  
    endpoints: (builder) => ({
      addWishlist: builder.mutation({
        query: (id) => ({
          url: `user/wishlist/${id}`,
          method: 'POST',
        }),
      invalidatesTags: ['auction']
      }),
      deleteWishlist: builder.mutation({
        query: (id) => ({
          url: `user/wishlist/${id}`,
          method: 'DELETE',
        }),
      invalidatesTags: ['auction']
      }),
      getAllWishlist: builder.query({
        query: () => 'user/wishlist',
      }),
    }),
  });

export const {useAddWishlistMutation,useGetAllWishlistQuery,useDeleteWishlistMutation} = wishlistApi