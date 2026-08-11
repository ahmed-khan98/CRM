import { createApiAuction } from "@/redux/createApi";

const employeeParams = (employeeId, extra = {}) => ({
  employeeId,
  ...extra,
});

const employeeHrmsApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeById: builder.query({
      query: (id) => `employee/${id}`,
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),

    // Documents
    getEmployeeDocuments: builder.query({
      query: (params) => ({
        url: "employee-documents/",
        params: employeeParams(params.employeeId, params),
      }),
      providesTags: ["EmployeeDocuments"],
    }),
    createEmployeeDocument: builder.mutation({
      query: (formData) => ({
        url: "employee-documents/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["EmployeeDocuments"],
    }),
    updateEmployeeDocument: builder.mutation({
      query: ({ id, body }) => ({
        url: `employee-documents/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["EmployeeDocuments"],
    }),
    deleteEmployeeDocument: builder.mutation({
      query: (id) => ({
        url: `employee-documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployeeDocuments"],
    }),

    // Allowances
    getEmployeeAllowances: builder.query({
      query: (params) => ({
        url: "employee-allowances/",
        params: employeeParams(params.employeeId, params),
      }),
      providesTags: ["EmployeeAllowances"],
    }),
    createEmployeeAllowance: builder.mutation({
      query: (body) => ({
        url: "employee-allowances/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmployeeAllowances", "EmployeeCarHistory", "vehicles"],
    }),
    updateEmployeeAllowance: builder.mutation({
      query: ({ id, body }) => ({
        url: `employee-allowances/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["EmployeeAllowances", "EmployeeCarHistory", "vehicles"],
    }),
    deleteEmployeeAllowance: builder.mutation({
      query: (id) => ({
        url: `employee-allowances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployeeAllowances", "EmployeeCarHistory", "vehicles"],
    }),

    getAvailableVehicles: builder.query({
      query: () => "vehicle/available",
      providesTags: ["vehicles"],
    }),

    // Salary history
    getEmployeeSalaryHistory: builder.query({
      query: (params) => ({
        url: "employee-salary-history/",
        params: employeeParams(params.employeeId, params),
      }),
      providesTags: ["EmployeeSalaryHistory"],
    }),
    createEmployeeSalaryHistory: builder.mutation({
      query: (body) => ({
        url: "employee-salary-history/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmployeeSalaryHistory", "Employee", "allEmployees"],
    }),

    // Car history
    getEmployeeCarHistory: builder.query({
      query: (params) => ({
        url: "employee-car-history/",
        params: employeeParams(params.employeeId, params),
      }),
      providesTags: ["EmployeeCarHistory"],
    }),
    createEmployeeCarHistory: builder.mutation({
      query: (body) => ({
        url: "employee-car-history/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmployeeCarHistory"],
    }),

    // Fuel history
    getEmployeeFuelHistory: builder.query({
      query: (params) => ({
        url: "employee-fuel-history/",
        params: employeeParams(params.employeeId, params),
      }),
      providesTags: ["EmployeeFuelHistory"],
    }),
    createEmployeeFuelHistory: builder.mutation({
      query: (body) => ({
        url: "employee-fuel-history/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmployeeFuelHistory"],
    }),

    // Insurance history
    getEmployeeInsuranceHistory: builder.query({
      query: (params) => ({
        url: "employee-insurance-history/",
        params: employeeParams(params.employeeId, params),
      }),
      providesTags: ["EmployeeInsuranceHistory"],
    }),
    createEmployeeInsuranceHistory: builder.mutation({
      query: (body) => ({
        url: "employee-insurance-history/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmployeeInsuranceHistory"],
    }),

    // Previous employment
    getEmployeePreviousEmployment: builder.query({
      query: (params) => ({
        url: "employee-previous-employment/",
        params: employeeParams(params.employeeId, params),
      }),
      providesTags: ["EmployeePreviousEmployment"],
    }),
    createEmployeePreviousEmployment: builder.mutation({
      query: (body) => ({
        url: "employee-previous-employment/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmployeePreviousEmployment"],
    }),
    updateEmployeePreviousEmployment: builder.mutation({
      query: ({ id, body }) => ({
        url: `employee-previous-employment/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["EmployeePreviousEmployment"],
    }),
    deleteEmployeePreviousEmployment: builder.mutation({
      query: (id) => ({
        url: `employee-previous-employment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmployeePreviousEmployment"],
    }),

    // Family
    getEmployeeFamily: builder.query({
      query: (employeeId) => `employee-family/by-employee/${employeeId}`,
      providesTags: ["EmployeeFamily"],
    }),
    upsertEmployeeFamily: builder.mutation({
      query: ({ employeeId, body }) => ({
        url: `employee-family/by-employee/${employeeId}`,
        method: "PUT",
        body: { ...body, employeeId },
      }),
      invalidatesTags: ["EmployeeFamily"],
    }),
  }),
});

export const {
  useGetEmployeeByIdQuery,
  useGetEmployeeDocumentsQuery,
  useCreateEmployeeDocumentMutation,
  useUpdateEmployeeDocumentMutation,
  useDeleteEmployeeDocumentMutation,
  useGetEmployeeAllowancesQuery,
  useCreateEmployeeAllowanceMutation,
  useUpdateEmployeeAllowanceMutation,
  useDeleteEmployeeAllowanceMutation,
  useGetEmployeeSalaryHistoryQuery,
  useCreateEmployeeSalaryHistoryMutation,
  useGetEmployeeCarHistoryQuery,
  useCreateEmployeeCarHistoryMutation,
  useGetEmployeeFuelHistoryQuery,
  useCreateEmployeeFuelHistoryMutation,
  useGetEmployeeInsuranceHistoryQuery,
  useCreateEmployeeInsuranceHistoryMutation,
  useGetEmployeePreviousEmploymentQuery,
  useCreateEmployeePreviousEmploymentMutation,
  useUpdateEmployeePreviousEmploymentMutation,
  useDeleteEmployeePreviousEmploymentMutation,
  useGetEmployeeFamilyQuery,
  useUpsertEmployeeFamilyMutation,
  useGetAvailableVehiclesQuery,
} = employeeHrmsApi;
