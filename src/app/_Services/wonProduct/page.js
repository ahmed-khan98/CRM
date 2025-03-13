import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
  wonItems: builder.query({
      query: () => 'user/won',
    }),
  
  }),
})

export const { useWonItemsQuery } = productApi