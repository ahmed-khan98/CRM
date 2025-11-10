import { createApiAuction } from "@/redux/createApi";

const departApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    
    createBrand: builder.mutation({
      query: (formData) => ({
        url: "brand/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allBrands"],
    }),

    updateBrand: builder.mutation({
      query: ({ id, body }) => {
        console.log(body, "updateData");
        return {
          url: `brand/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["allBrands"],
    }),
    

    allBrands: builder.query({
      query: (data) => `brand/`,
      providesTags: ["allBrands"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),

    deleteBrand: builder.mutation({
      query: (id) => {
        return {
          url: `brand/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["allBrands"],
    }),

    getDepartmentBrand: builder.query({
      query: (id) => {
        return {
          url: `brand/${id}/departmentBrand`,
          method: "GET",
        };
      },
    }),

  }),
});

export const {
  useAllBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetDepartmentBrandQuery,
} = departApi;
