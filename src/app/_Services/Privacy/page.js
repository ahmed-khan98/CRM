import { createApiAuction } from "@/redux/createApi"

const privacyApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getPrivacy: builder.query({
      query: () => 'user/privacy',
    }),
  }),
})

export const { useGetPrivacyQuery } = privacyApi