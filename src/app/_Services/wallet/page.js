import { createApiAuction } from "@/redux/createApi"

const walletApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query({
      query: () => 'user/wallet',
      providesTags: ['wallet'],
    //   keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),

    getTransactions: builder.query({
      query: () => `user/wallet/transactions`,
      providesTags: ['transactions'],
    //   keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),
    getConnectAccount: builder.query({
      query: () => `user/payout/connect-account`,
      providesTags: ['connectAccount'],
    //   keepUnusedDataFor: 1800, 
      refetchOnMountOrArgChange: false,
    }),

    getCards: builder.query({
      query: (id) => `user/wallet/cards`,
      providesTags: ['cards'],
      refetchOnMountOrArgChange: false,
    }),

    addCard: builder.mutation({
      query: (formData) => {
        return {
          url: 'user/wallet/cards',
          method: 'POST',
          body: formData ,
        }
      },
      invalidatesTags: ['cards']
    }
    ),
    createConnectAccount: builder.mutation({
      query: (formData) => {
        return {
          url: 'user/payout/connect-account',
          method: 'POST',
          body: '' ,
        }
      },
      invalidatesTags: ['cards']
    }
    ),

    setDefaultCard: builder.mutation({
      query: (cardId) => {
        return {
          url: `user/wallet/cards/${cardId}/set-default`,
          method: 'POST',
        }
      },
      invalidatesTags: ['cards']
    }
    ),

    deleteCard: builder.mutation({
      query: (cardId) => {
        return {
          url: `user/wallet/cards/${cardId}`,
          method: "DELETE",
        }
      },
      invalidatesTags: ['cards']
    }
    ),

    deposit: builder.mutation({
        query: (formData) => {
          return {
            url: 'user/wallet/deposit',
            method: 'POST',
            body: formData ,
          }
        },
        invalidatesTags: ['transactions']
    }),
    
    withdraw: builder.mutation({
        query: (formData) => {
          return {
            url: 'user/wallet/withdraw',
            method: 'POST',
            body: formData ,
          }
        },
        invalidatesTags: ['transactions']
    }),

  }),
})

export const {useGetConnectAccountQuery,useCreateConnectAccountMutation,useGetWalletQuery,useGetTransactionsQuery,useGetCardsQuery,useAddCardMutation,useDeleteCardMutation,useSetDefaultCardMutation,useDepositMutation,useWithdrawMutation } = walletApi