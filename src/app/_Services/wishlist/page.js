import { createApiAuction } from "@/redux/createApi"

const wishlistApi = createApiAuction.injectEndpoints({
    overrideExisting: true,  
    endpoints: (builder) => ({
      addWishlist: builder.mutation({
        query: (id) => ({
          url: `user/wishlist/${id}`,
          method: 'POST',
          // body: {id}  
        }),
      }),
      getAllWishlist: builder.query({
        query: () => 'user/wishlist',
      }),
    }),
  });

export const {useAddWishlistMutation,useGetAllWishlistQuery} = wishlistApi