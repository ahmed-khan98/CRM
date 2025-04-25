import { createApiAuction } from "@/redux/createApi"

const wishlistApi = createApiAuction.injectEndpoints({
    overrideExisting: true,  
    endpoints: (builder) => ({
      addWishlist: builder.mutation({
        query: (id) => ({
          url: `user/wishlist/${id}`,
          method: 'POST',
        }),
      invalidatesTags: ['auction','detailproduct','wishlist']
      }),
      deleteWishlist: builder.mutation({
        query: (id) => ({
          url: `user/wishlist/${id}`,
          method: 'DELETE',
        }),
      invalidatesTags: ['auction','detailproduct','wishlist']
      }),
      getAllWishlist: builder.query({
        query: () => 'user/wishlist',
        providesTags: ['wishlist'],
        keepUnusedDataFor: 180, 
        refetchOnMountOrArgChange: false,

      }),
    }),
  });

export const {useAddWishlistMutation,useGetAllWishlistQuery,useDeleteWishlistMutation} = wishlistApi