import { createApiAuction } from "@/redux/createApi"

const authenticationsApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: 'register',
        method: 'POST',
        body: formData,
        formData: true
      }),
    }),
    login: builder.mutation({
      query: (formData) => ({
        url: 'userLogin',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation } = authenticationsApi