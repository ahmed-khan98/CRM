import { createApiAuction } from "@/redux/createApi";

const payrollApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollSettings: builder.query({
      query: () => "payroll/settings",
      providesTags: ["PayrollSettings"],
    }),
    updatePayrollSettings: builder.mutation({
      query: (body) => ({ url: "payroll/settings", method: "PATCH", body }),
      invalidatesTags: ["PayrollSettings"],
    }),
    createDeductionType: builder.mutation({
      query: (body) => ({ url: "payroll/deduction-types", method: "POST", body }),
      invalidatesTags: ["PayrollSettings"],
    }),
    updateDeductionType: builder.mutation({
      query: ({ id, body }) => ({
        url: `payroll/deduction-types/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PayrollSettings"],
    }),
    deleteDeductionType: builder.mutation({
      query: (id) => ({ url: `payroll/deduction-types/${id}`, method: "DELETE" }),
      invalidatesTags: ["PayrollSettings"],
    }),
    getPayrollRun: builder.query({
      query: (params) => ({ url: "payroll/run", params }),
      providesTags: ["PayrollRun"],
    }),
    generatePayroll: builder.mutation({
      query: (body) => ({ url: "payroll/generate", method: "POST", body }),
      invalidatesTags: ["PayrollRun", "PayrollPayslips"],
    }),
    finalizePayroll: builder.mutation({
      query: ({ id, entryIds }) => ({
        url: `payroll/runs/${id}/finalize`,
        method: "POST",
        body: { entryIds },
      }),
      invalidatesTags: ["PayrollRun", "PayrollPayslips"],
    }),
    markPayrollPaid: builder.mutation({
      query: (id) => ({ url: `payroll/runs/${id}/pay`, method: "POST" }),
      invalidatesTags: ["PayrollRun", "PayrollPayslips"],
    }),
    unlockPayroll: builder.mutation({
      query: (id) => ({ url: `payroll/runs/${id}/unlock`, method: "POST" }),
      invalidatesTags: ["PayrollRun", "PayrollPayslips"],
    }),
    addPayrollDeduction: builder.mutation({
      query: ({ id, body }) => ({
        url: `payroll/entries/${id}/deduction`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PayrollRun"],
    }),
    updatePayrollEntryAmounts: builder.mutation({
      query: ({ id, body }) => ({
        url: `payroll/entries/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PayrollRun"],
    }),
    getPayrollEntry: builder.query({
      query: (id) => `payroll/entries/${id}`,
      providesTags: (r, e, id) => [{ type: "PayrollRun", id }],
    }),
    getMyPayslips: builder.query({
      query: () => "payroll/payslips/me",
      providesTags: ["PayrollPayslips"],
    }),
    getTeamPayslips: builder.query({
      query: (params) => ({ url: "payroll/payslips", params }),
      providesTags: ["PayrollPayslips"],
    }),
    emailPayslips: builder.mutation({
      query: (entryIds) => ({
        url: "payroll/payslips/email",
        method: "POST",
        body: { entryIds },
      }),
    }),
  }),
});

export const {
  useGetPayrollSettingsQuery,
  useUpdatePayrollSettingsMutation,
  useCreateDeductionTypeMutation,
  useUpdateDeductionTypeMutation,
  useDeleteDeductionTypeMutation,
  useGetPayrollRunQuery,
  useGeneratePayrollMutation,
  useFinalizePayrollMutation,
  useMarkPayrollPaidMutation,
  useUnlockPayrollMutation,
  useAddPayrollDeductionMutation,
  useUpdatePayrollEntryAmountsMutation,
  useGetPayrollEntryQuery,
  useGetMyPayslipsQuery,
  useGetTeamPayslipsQuery,
  useEmailPayslipsMutation,
} = payrollApi;
