import { createApiAuction } from "@/redux/createApi"

const boxProductApi = createApiAuction.injectEndpoints({
    endpoints: (builder) => ({

        addBoxProduct:builder.mutation({
            query: (formData) => {
              return {
                url: "user/product-box/add",
                method: "POST",
                body: formData,
              }
            },
            invalidatesTags: ["allBoxProduct"],
        }),
        updateProductBox: builder.mutation({
            query: (formData) => ({
                url: `user/product-box/${formData.id}`,
                method: 'PATCH',
                body: {
                    products:formData.products,
                    notes:formData.notes},
            }),
            invalidatesTags: ['allBoxProduct']
        }),
        allBoxProduct: builder.query({
            query: () => `user/product-box`,
            providesTags: ['allBoxProduct'],
            keepUnusedDataFor: 180,
            refetchOnMountOrArgChange: false,
        }),
        allFilterBoxProduct: builder.query({
            query: () => `user/pickup-appointment/filter-product-box`,
            providesTags: ['allFilterBoxProduct'],
            keepUnusedDataFor: 180,
            refetchOnMountOrArgChange: false,
        }),
    }),
})

export const {useAddBoxProductMutation,useAllBoxProductQuery,useAllFilterBoxProductQuery,useUpdateProductBoxMutation } = boxProductApi