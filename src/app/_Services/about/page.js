import { createApiAuction } from "@/redux/createApi"

const aboutApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getAbout: builder.query({
      query: () => 'user/about',
    }),
  
  }),
})

export const { useGetAboutQuery } = aboutApi