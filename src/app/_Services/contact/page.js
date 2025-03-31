import { createApiAuction } from "@/redux/createApi"

const contactApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getContact: builder.query({
      query: () => 'user/contact',
    }),
  }),
})

export const { useGetContactQuery } = contactApi