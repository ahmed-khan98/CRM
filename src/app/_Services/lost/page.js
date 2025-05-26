import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
  lostItems: builder.query({
      query: () => 'user/auction/lost-products',
      keepUnusedDataFor: 180, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useLostItemsQuery } = productApi