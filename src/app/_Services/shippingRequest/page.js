import { createApiAuction } from "@/redux/createApi"

const shippingRequestApi = createApiAuction.injectEndpoints({
    endpoints: (builder) => ({
        createShippingRequest: builder.mutation({
            query: (formData) => ({
                url: '/user/shippingRequest/add',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['allShippingRequest']
        }),
        updateShippingRequest: builder.mutation({
            query: (formData) => ({
                url: `/user/shippingRequest/${formData.id}`,
                method: 'PATCH',
                body: {appointmentDate:formData.appointmentDate,
                    appointmentTime:formData.appointmentTime,
                    notes:formData.notes},
            }),
            invalidatesTags: ['allShippingRequest']

        }),
        allShippingRequest: builder.query({
            query: () => `user/shippingRequest`,
            providesTags: ['allShippingRequest'],
            keepUnusedDataFor: 180,
            refetchOnMountOrArgChange: false,
        }),
    }),
})

export const { useAllShippingRequestQuery,useCreateShippingRequestMutation } = shippingRequestApi