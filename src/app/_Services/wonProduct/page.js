import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
  wonItems: builder.query({
      query: () => 'user/won',
      keepUnusedDataFor: 180, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useWonItemsQuery } = productApi