import { createApiAuction } from "@/redux/createApi"

const vendorProductApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (formData) => ({
        url: 'user/product/add',
        method: 'POST',
        body: formData,
        formData: true
      }),
    }),
 
    getMyProduct: builder.query({
      query: () => 'user/product/allProducts',
    }),
  }),
})

export const { useAddProductMutation,useGetMyProductQuery} = vendorProductApi