import { createApiAuction } from "@/redux/createApi"

const aboutApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getService: builder.query({
      query: () => 'user/service/', 
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useGetServiceQuery } = aboutApi