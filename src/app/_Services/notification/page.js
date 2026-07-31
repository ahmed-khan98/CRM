import { createApiAuction } from "@/redux/createApi";

const notificationApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: (limit = 30) => `notification?limit=${limit}`,
      providesTags: ["notifications"],
      keepUnusedDataFor: 60,
    }),
    getUnreadNotificationCount: builder.query({
      query: () => "notification/unread-count",
      providesTags: ["notifications"],
      keepUnusedDataFor: 30,
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "notification/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
