import { createApiAuction } from "@/redux/createApi"

const useUserNotificationsQueryApi = createApiAuction.injectEndpoints({
    endpoints: (builder) => ({
        userNotifications: builder.query({
            query: (formData) => `user/notification/${formData?.userId}/${formData?.role}`,
        }),

        markAsRead: builder.mutation({
            query: (id) => ({
                url: `user/notification/${id}`,
                method: 'POST',
            }),
        }),
    }),
})

export const { useMarkAsReadMutation, useUserNotificationsQuery } = useUserNotificationsQueryApi