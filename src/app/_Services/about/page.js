import { createApiAuction } from "@/redux/createApi"

const dashboardCountApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getDashboardCount: builder.query({
      query: () => 'dashboard/count',
    }),
  
  }),
})

export const { useGetDashboardCountQuery } = dashboardCountApi