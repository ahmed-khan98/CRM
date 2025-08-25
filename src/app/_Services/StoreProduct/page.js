import { createApiAuction } from "@/redux/createApi"

const storeProductApi = createApiAuction.injectEndpoints({
    endpoints: (builder) => ({
        addStoreProduct:builder.mutation({
            query: (formData) => {
              return {
                url: "user/store-product/add",
                method: "POST",
                body: formData,
              }
            },
            invalidatesTags: ["allStoreProduct"],
          }),
        // updateShippingRequest: builder.mutation({
        //     query: (formData) => ({
        //         url: `/user/shippingRequest/${formData.id}`,
        //         method: 'PATCH',
        //         body: {appointmentDate:formData.appointmentDate,
        //             appointmentTime:formData.appointmentTime,
        //             notes:formData.notes},
        //     }),
        //     invalidatesTags: ['allShippingRequest','allWon']

        // }),
        allStoreProduct: builder.query({
            query: () => `user/store-product`,
            providesTags: ['allStoreProduct'],
            keepUnusedDataFor: 180,
            refetchOnMountOrArgChange: false,
        }),
        allFilterProduct: builder.query({
            query: () => `user/store-product/filter-for-box`,
            providesTags: ['allFilterProduct'],
            keepUnusedDataFor: 180,
            refetchOnMountOrArgChange: false,
        }),
    }),
})

export const { useAddStoreProductMutation,useAllStoreProductQuery,useAllFilterProductQuery } = storeProductApi