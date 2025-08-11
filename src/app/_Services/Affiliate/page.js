import { createApiAuction } from "@/redux/createApi"

const affiliateApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getAffiliate: builder.query({
      query: () => 'user/affiliate',
    }),
    getBecomeAffiliate: builder.query({
      query: () => 'user/affiliate-page',
    }),
  }),
})

export const { useGetAffiliateQuery,useGetBecomeAffiliateQuery } = affiliateApi