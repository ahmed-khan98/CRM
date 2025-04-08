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
    verify: builder.mutation({
      query: (formData) => ({
        url: 'verify-email',
        method: 'POST',
        body: formData,
      }),
    }),
    resend: builder.mutation({
      query: (formData) => ({
        url: 'resend-code',
        method: 'POST',
        body: formData,
      }),
    }),
    forget: builder.mutation({
      query: (formData) => ({
        url: 'forget-password',
        method: 'POST',
        body: formData,
      }),
    }),
    reset: builder.mutation({
      query: (formData) => ({
        url: 'reset-password',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const { useRegisterMutation,useLoginMutation,useVerifyMutation,useResendMutation,useForgetMutation,useResetMutation } = authenticationsApi