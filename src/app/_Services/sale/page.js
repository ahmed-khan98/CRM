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
            departmentId: formData?.departmentId,
            agent: formData?.agent,
            fronter: formData?.fronter,
            name: formData?.name,
            email: formData?.email,
            phoneNo: formData?.phoneNo,
            serialNo: formData?.serialNo,
            brandMark: formData?.brandMark,
            brandName: formData?.brandName,
            amount: formData?.amount,
            currency: formData?.currency,
            type: formData?.type,
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
