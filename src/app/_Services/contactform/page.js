import { createApiAuction } from "@/redux/createApi"

const contactFormApi = createApiAuction.injectEndpoints({
    endpoints: (builder) => ({
        createContactForm: builder.mutation({
            query: (formData) => ({
                url: '/user/contactform/add',
                method: 'POST',
                body: formData,
            }),

        }),
        response: builder.query({
            query: () => 'user/contactform/response',
            keepUnusedDataFor: 180, 
            refetchOnMountOrArgChange: false,
          }),
    }),
})

export const { useCreateContactFormMutation,useResponseQuery } = contactFormApi