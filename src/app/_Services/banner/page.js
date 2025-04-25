import { createApiAuction } from "@/redux/createApi"

const bannerApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getBanner: builder.query({
      query: () => 'user/banner',
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useGetBannerQuery } = bannerApi