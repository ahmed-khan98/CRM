import { createApiAuction } from "@/redux/createApi"

const aboutApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getService: builder.query({
      query: () => 'user/service/', 
      keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getSidebarTitle: builder.query({
      query: () => 'user/sidebar/',
      providesTags: ['sidebar'],
      keepUnusedDataFor: 3800, 
      refetchOnMountOrArgChange: false,
    }),
  
  }),
})

export const { useGetServiceQuery,useGetSidebarTitleQuery } = aboutApi