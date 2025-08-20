import { createApiAuction } from "@/redux/createApi"

const pickdropApi = createApiAuction.injectEndpoints({
    endpoints: (builder) => ({
        createPickDropAppointment: builder.mutation({
            query: (formData) => ({
                url: '/user/pickup-appointment/add',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['allPickDropAppointment','allWon']
        }),
        updatePickDropAppointment: builder.mutation({
            query: (formData) => ({
                url: `/user/pickup-appointment/${formData.id}`,
                method: 'PATCH',
                body: {appointmentDate:formData.appointmentDate,
                    appointmentTime:formData.appointmentTime,
                    boxes:formData.boxes,
                    notes:formData.notes},
            }),
            invalidatesTags: ['allPickDropAppointment','allWon']

        }),
        allPickDropAppointment: builder.query({
            query: (data) => `user/pickup-appointment`,
            providesTags: ['allPickDropAppointment'],
            keepUnusedDataFor: 180,
            refetchOnMountOrArgChange: false,
        }),
    }),
})

export const { useAllPickDropAppointmentQuery, useCreatePickDropAppointmentMutation, useUpdatePickDropAppointmentMutation } = pickdropApi