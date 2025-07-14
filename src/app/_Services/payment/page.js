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
        query: (formData) => ({
          url: `user/payment/confirmPayment`,
          method: 'POST',
          body:{session_id:formData.session_id,status:formData.status,type:formData.type}
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