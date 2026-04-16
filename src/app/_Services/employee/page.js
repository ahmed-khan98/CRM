import { createApiAuction } from "@/redux/createApi";

const employeeApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation({
      query: (formData) => {
        return {
          url: "employee/add",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["allEmployees"],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, body }) => {
        console.log(body, "updateData");
        return {
          url: `employee/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["allEmployees"],
    }),
    updateStatus: builder.mutation({
      query: ({ id }) => {
        console.log(id, "updateStatusID");
        return {
          url: `employee/change-status/${id}`,
          method: "PATCH",
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          employeeApi.util.updateQueryData(
            "getEmployees",
            undefined,
            (draft) => {
              const emp = draft.find((e) => e._id === id);
              if (emp) {
                emp.status = emp.status === "active" ? "inactive" : "active";
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ["allEmployees"],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => {
        return {
          url: `employee/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["allEmployees"],
    }),
    getdepartmentsEmployee: builder.query({
      query: (id) => {
        return {
          url: `employee/${id}/departmentEmployee`,
          method: "GET",
        };
      },
      invalidatesTags: ["allEmployees"],
    }),
    allEmployees: builder.query({
      query: (data) => `employee/`,
      providesTags: ["allEmployees"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: false,
    }),
    breakIn: builder.mutation({
      query: (formData) => {
        return {
          url: "employee/breakIn",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ['loggedUser'],
    }),
    breakOut: builder.mutation({
      query: (formData) => {
        return {
          url: "employee/breakOut",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["todayUserAttendence", 'loggedUser'],
    }),
  }),
});

export const {
  useAllEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetdepartmentsEmployeeQuery,
  useUpdateStatusMutation,
  useBreakInMutation,
  useBreakOutMutation,
} = employeeApi;
