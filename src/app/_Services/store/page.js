import { createApiAuction } from "@/redux/createApi"

const storeApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
  myStoreItems: builder.query({
      query: () => 'user/product/myItems',
      providesTags: ['myItem'],
      keepUnusedDataFor: 180, 
      refetchOnMountOrArgChange: false,
    }),
  myStore: builder.query({
      query: () => 'user/store/',
      keepUnusedDataFor: 180, 
      refetchOnMountOrArgChange: false,
    }),
    createStore: builder.mutation({
      query: (formData) => ({
          url: '/user/store/create',
          method: 'POST',
          body: formData,
      }),
      invalidatesTags: ['myItem']
  }),
  
  }),
})

export const { useMyStoreItemsQuery,useCreateStoreMutation ,useMyStoreQuery} = storeApi