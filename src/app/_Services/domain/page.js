import { createApiAuction } from "@/redux/createApi";


const BrandEmailApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({

    createBrandEmail: builder.mutation({
      query: (formData) => ({
        url: "brandEmail/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allBrandEmails"],
    }),

    updateBrandEmail: builder.mutation({
      query: (formData) => ({
        url: `brandEmail/${formData?.id}`,
        method: "PATCH",
        body: {
          name: formData?.name,
          email: formData?.email,
          brandId: formData?.brandId,
        },
      }),
      invalidatesTags: ["allBrandEmails"],
    }),

    deleteBrandEmail: builder.mutation({
      query: (id) => ({
        url: `brandEmail/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allBrandEmails"],
    }),

    getBrandEmailById: builder.query({
      query: (id) => ({
        url: `brandEmail/${id}`,
        method: "GET",
      }),
      providesTags: ["BrandEmailById"],
    }),
    getBrandEmailByBrandId: builder.query({
      query: (id) => ({
        url: `brandEmail/${id}/brandById`,
        method: "GET",
      }),
      providesTags: ["BrandEmailByBrandId"],
    }),

    allBrandEmails: builder.query({
      query: () => ({
        url: `brandEmail`,
      }),
      providesTags: ["allBrandEmails"],
    }),

  }),
});

export const {
  useAllBrandEmailsQuery,
  useCreateBrandEmailMutation,
  useUpdateBrandEmailMutation,
  useDeleteBrandEmailMutation,
  useGetBrandEmailByIdQuery,
  useGetBrandEmailByBrandIdQuery
} = BrandEmailApi;
