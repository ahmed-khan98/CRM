import { createApiAuction } from "@/redux/createApi"

const dashboardCountApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCount: builder.query({
      query: () => "dashboard/count",
    }),
    getDashboardAttendanceSummary: builder.query({
      query: () => "dashboard/attendance-summary",
    }),
    getDashboardMonthlySales: builder.query({
      query: () => "dashboard/monthly-sales",
    }),
  }),
});

export const {
  useGetDashboardCountQuery,
  useGetDashboardAttendanceSummaryQuery,
  useGetDashboardMonthlySalesQuery,
} = dashboardCountApi;