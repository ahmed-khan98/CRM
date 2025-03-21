import { createApiAuction } from "@/redux/createApi"

const paymentApi = createApiAuction.injectEndpoints({
    overrideExisting: true,  
    endpoints: (builder) => ({
      addPayment: builder.mutation({
        query: (id) => ({
          url: 'user/payment/create-checkout-session/',
          method: 'POST',
          body:id
        }),
      }),
      paymentSuccess: builder.mutation({
        query: (id) => ({
          url: `user/payment/confirmPayment`,
          method: 'POST',
          body:id
        }),
      }),
      paymentfaild: builder.mutation({
        query: (id) => ({
          url: `user/payment/payment-failed`,
          method: 'POST',
          body:id
        }),
      }),
 
    }),
  });

export const {useAddPaymentMutation,usePaymentSuccessMutation,usePaymentfaildMutation} = paymentApi