import { createApiAuction } from "@/redux/createApi"

const bannerApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getBanner: builder.query({
      query: () => 'user/banner',
    }),
  
  }),
})

export const { useGetBannerQuery } = bannerApi