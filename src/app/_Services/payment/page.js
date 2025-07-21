import { createApiAuction } from "@/redux/createApi"

const paymentApi = createApiAuction.injectEndpoints({
    overrideExisting: true,  
    endpoints: (builder) => ({
      addPayment: builder.mutation({
        query: (data) => ({
          url: 'user/payment/create-checkout-session/',
          method: 'POST',
          body:data
        }),
        invalidatesTags: ['allWon','allAppointment','allPenalizedProduct']

        
      }),
      addCardPayment: builder.mutation({
        query: (data) => ({
          url: 'user/payment/pay-with-card/',
          method: 'POST',
          body:data
        }),
        invalidatesTags: ['allWon','allAppointment','allPenalizedProduct']

      }),
      addPaypalPayment: builder.mutation({
        query: (data) => ({
          url: 'user/payment/pay-with-paypal/',
          method: 'POST',
          body:data
        }),
        invalidatesTags: ['allWon','allAppointment','allPenalizedProduct']

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

export const {useAddPaymentMutation,usePaymentSuccessMutation,usePaymentfaildMutation,useAddCardPaymentMutation,useAddPaypalPaymentMutation} = paymentApi