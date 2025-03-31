import { createApiAuction } from "@/redux/createApi"

const termApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getTerm: builder.query({
      query: () => 'user/term',
    }),
  }),
})

export const { useGetTermQuery } = termApi