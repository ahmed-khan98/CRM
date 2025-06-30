import { createApiAuction } from "@/redux/createApi"

const storeApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
  myStoreItems: builder.query({
      query: () => 'user/product/myItems',
      keepUnusedDataFor: 180, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useMyStoreItemsQuery } = storeApi