import { createApiAuction } from "@/redux/createApi"

const appointmentApi = createApiAuction.injectEndpoints({
    endpoints: (builder) => ({
        createAppointment: builder.mutation({
            query: (formData) => ({
                url: '/user/appointment/add',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['allAppointment','allWon']
        }),
        updateAppointment: builder.mutation({
            query: (formData) => ({
                url: `/user/appointment/${formData.id}`,
                method: 'PATCH',
                body: {appointmentDate:formData.appointmentDate,
                    appointmentTime:formData.appointmentTime,
                    notes:formData.notes},
            }),
            invalidatesTags: ['allAppointment','allWon']

        }),
        allAppointment: builder.query({
            query: () => `user/appointment`,
            providesTags: ['allAppointment'],
            keepUnusedDataFor: 180,
            refetchOnMountOrArgChange: false,
        }),
    }),
})

export const { useAllAppointmentQuery, useCreateAppointmentMutation, useUpdateAppointmentMutation } = appointmentApi