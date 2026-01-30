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
  }),
});

export const { useTimeInMutation, useTimeOutMutation,useTodayUserAttendenceQuery,useGetAttendanceQuery } = attendenceApi;
