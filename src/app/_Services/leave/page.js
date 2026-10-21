import { createApiAuction } from "@/redux/createApi";

const leaveApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveTypes: builder.query({
      query: (params) => ({ url: "leave/types", params }),
      providesTags: ["LeaveTypes"],
    }),
    createLeaveType: builder.mutation({
      query: (body) => ({ url: "leave/types", method: "POST", body }),
      invalidatesTags: ["LeaveTypes", "LeaveBalances"],
    }),
    updateLeaveType: builder.mutation({
      query: ({ id, body }) => ({
        url: `leave/types/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LeaveTypes", "LeaveBalances"],
    }),
    deleteLeaveType: builder.mutation({
      query: (id) => ({ url: `leave/types/${id}`, method: "DELETE" }),
      invalidatesTags: ["LeaveTypes", "LeaveBalances"],
    }),

    getHolidays: builder.query({
      query: (params) => ({ url: "leave/holidays", params }),
      providesTags: ["LeaveHolidays"],
    }),
    createHoliday: builder.mutation({
      query: (body) => ({ url: "leave/holidays", method: "POST", body }),
      invalidatesTags: ["LeaveHolidays"],
    }),
    updateHoliday: builder.mutation({
      query: ({ id, body }) => ({
        url: `leave/holidays/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LeaveHolidays"],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({ url: `leave/holidays/${id}`, method: "DELETE" }),
      invalidatesTags: ["LeaveHolidays"],
    }),

    getMyLeaveBalances: builder.query({
      query: (params) => ({ url: "leave/my-balances", params }),
      providesTags: ["LeaveBalances"],
    }),
    getMyLeaveRequests: builder.query({
      query: (params) => ({ url: "leave/my-requests", params }),
      providesTags: ["LeaveRequests"],
    }),
    applyLeave: builder.mutation({
      query: (formData) => ({
        url: "leave/apply",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances", "TeamLeave"],
    }),

    getTeamLeave: builder.query({
      query: (params) => ({ url: "leave/team", params }),
      providesTags: ["TeamLeave"],
    }),
    getEmployeeLeaveBalances: builder.query({
      query: ({ employeeId, ...params }) => ({
        url: `leave/employee/${employeeId}/balances`,
        params,
      }),
      providesTags: ["LeaveBalances"],
    }),
    getEmployeeLeaveRequests: builder.query({
      query: ({ employeeId, ...params }) => ({
        url: `leave/employee/${employeeId}/requests`,
        params,
      }),
      providesTags: ["LeaveRequests"],
    }),
    getLeaveById: builder.query({
      query: (id) => `leave/${id}`,
      providesTags: (r, e, id) => [{ type: "LeaveRequests", id }],
    }),
    approveLeave: builder.mutation({
      query: ({ id, note }) => ({
        url: `leave/${id}/approve`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances", "TeamLeave"],
    }),
    rejectLeave: builder.mutation({
      query: ({ id, note }) => ({
        url: `leave/${id}/reject`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances", "TeamLeave"],
    }),
  }),
});

export const {
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useGetMyLeaveBalancesQuery,
  useGetMyLeaveRequestsQuery,
  useApplyLeaveMutation,
  useGetTeamLeaveQuery,
  useGetEmployeeLeaveBalancesQuery,
  useGetEmployeeLeaveRequestsQuery,
  useGetLeaveByIdQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
} = leaveApi;
