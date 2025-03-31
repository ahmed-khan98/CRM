import { createApiAuction } from "@/redux/createApi"

const faqApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getFaq: builder.query({
      query: () => 'user/faq',
    }),
  }),
})

export const { useGetFaqQuery } = faqApi