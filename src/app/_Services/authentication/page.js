import { createApiAuction } from "@/redux/createApi";

const authenticationsApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: "register",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    checkUsername: builder.mutation({
      query: (formData) => ({
        url: "check-username",
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation({
      query: (formData) => ({
        url: "userLogin",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["todayUserAttendence",'loggedUser'],
    }),
    logout: builder.mutation({
      query: (formData) => ({
        url: "logout",
        method: "POST",
        body: formData,
      }),
    }),
    sendVerificationCode: builder.mutation({
      query: (formData) => ({
        url: "send-verification-code",
        method: "POST",
        body: formData,
      }),
    }),
    verifyCode: builder.mutation({
      query: (formData) => ({
        url: "verify-code",
        method: "POST",
        body: formData,
      }),
    }),
    resend: builder.mutation({
      query: (formData) => ({
        url: "resend-code",
        method: "POST",
        body: formData,
      }),
    }),
    forget: builder.mutation({
      query: (formData) => ({
        url: "forget-password",
        method: "POST",
        body: formData,
      }),
    }),
    reset: builder.mutation({
      query: (formData) => ({
        url: "reset-password",
        method: "POST",
        body: formData,
      }),
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/update-profile",
        method: "POST",
        body: formData,
      }),
    }),
    changePassword: builder.mutation({
      query: (formData) => ({
        url: "/change-password",
        method: "POST",
        body: formData,
      }),
    }),
    referralLink: builder.query({
      query: () => `/referral-link`,
    }),
    getLoggedUser: builder.query({
      query: () => {
        return {
          url: `/current-user`,
          method: "GET",
        };
      },
       providesTags: ["loggedUser"],
    }),
  }),
});

export const {
  useLogoutMutation,
  useCheckUsernameMutation,
  useReferralLinkQuery,
  useRegisterMutation,
  useSendVerificationCodeMutation,
  useLoginMutation,
  useVerifyCodeMutation,
  useResendMutation,
  useForgetMutation,
  useResetMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetLoggedUserQuery,
} = authenticationsApi;
