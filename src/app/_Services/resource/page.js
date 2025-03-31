import { createApiAuction } from "@/redux/createApi"

const resourceApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({ 
    getResource: builder.query({
      query: () => 'user/resource',
    }),
  
  }),
})

export const { useGetResourceQuery } = resourceApi