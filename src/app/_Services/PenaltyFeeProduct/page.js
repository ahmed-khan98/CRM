import { createApiAuction } from "@/redux/createApi"

const productApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    penalizedProductItems: builder.query({
      query: () => 'user/penalizedProduct',
      providesTags: ['allPenalizedProduct'],
      keepUnusedDataFor: 180, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { usePenalizedProductItemsQuery } = productApi