import { createApiAuction } from "@/redux/createApi";

const attendenceApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    timeIn: builder.mutation({
      query: (formData) => {
        return {
          url: "attendence/time-in",
          method: "POST",
        };
      },
      invalidatesTags: ["todayUserAttendence",'allAttendance'],
    }),

    timeOut: builder.mutation({
      query: (formData) => {
        return {
          url: "attendence/time-out",
          method: "POST",
        };
      },
      invalidatesTags: ["todayUserAttendence",'allAttendance'],
    }),

    updateTeamAttendence: builder.mutation({
      query: (formData) => {
        return {
          url: "attendence/update-team-attendance",
          method: "POST",
           body: formData,
        };
      },
      invalidatesTags: ["allDepartAttendance"],
    }),

    todayUserAttendence: builder.query({
      query: (data) => `attendence/todayUserAttendence`,
      providesTags: ["todayUserAttendence"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),

    getAttendance: builder.query({
      query: (params) => ({
        url: "attendence/my-attendance",
        params: params, 
      }),
      providesTags: ["allAttendance"],
    }),

    getDepartEmployeeAttendance: builder.query({
      query: (params) => ({
        url: "attendence/employee-attendance",
        params: params, 
      }),
      providesTags: ["allDepartAttendance"],
    }),
  }),
});

export const { useTimeInMutation,useUpdateTeamAttendenceMutation, useTimeOutMutation,useTodayUserAttendenceQuery,useGetAttendanceQuery,useGetDepartEmployeeAttendanceQuery } = attendenceApi;
