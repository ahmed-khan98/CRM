import { createApiAuction } from "@/redux/createApi"

const affiliateApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getAffiliate: builder.query({
      query: () => 'user/affiliate',
    }),
  }),
})

export const { useGetAffiliateQuery } = affiliateApi