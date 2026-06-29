import { createApiAuction } from "@/redux/createApi";

const buildSaleUrl = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "all") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return `sale/${queryString ? `?${queryString}` : ""}`;
};

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
            clientId: formData?.clientId,
            brandId: formData?.brandId,
            seller: formData?.seller,
            agent: formData?.agent,
            amount: formData?.amount,
            currency: formData?.currency,
            type: formData?.type,
            saleDate: formData?.saleDate,
            merchantType: formData?.merchantType,
            description: formData?.description,
          },
        };
      },
      invalidatesTags: ["allSales"],
    }),
    allSales: builder.query({
      query: buildSaleUrl,
      providesTags: ["allSales"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: true,
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
