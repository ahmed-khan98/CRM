import { createApiAuction } from "@/redux/createApi";

const saleApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation({
      query: (formData) => ({
        url: "sale/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allSales"],
    }),
    updateSale: builder.mutation({
      query: (formData) => {
        return {
          url: `sale/${formData.id}`,
          method: "PATCH",
          body: {
            title: formData?.title,
            departmentId: formData?.departmentId,
            clientId: formData?.clientId,
            agent: formData?.agent,
            amount: formData?.amount,
            currency: formData?.currency,
            description: formData?.description,
          },
        };
      },
      invalidatesTags: ["allSales"],
    }),
    allSales: builder.query({
      query: (data) => `sale/`,
      providesTags: ["allSales"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
    deleteSale: builder.mutation({
      query: (id) => {
        return {
          url: `sale/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["allSales"],
    }),
  }),
});

export const {
  useAllSalesQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = saleApi;
