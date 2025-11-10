import { createApiAuction } from "@/redux/createApi";

const departApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createDepartment: builder.mutation({
      query: (formData) => ({
        url: "department/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allDepartments"],
    }),
    updateDepartment: builder.mutation({
      query: (formData) => {
        return {
          url: `department/${formData.id}`,
          method: "PATCH",
          body: {
            name: formData?.name,
          },
        };
      },
      invalidatesTags: ["allDepartments"],
    }),

    allDepartments: builder.query({
      query: (data) => `department/`,
      providesTags: ["allDepartments"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
    deleteDepartment: builder.mutation({
      query: (id) => {
        return {
          url: `department/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["allDepartments"],
    }),
  }),
});

export const {
  useAllDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departApi;
