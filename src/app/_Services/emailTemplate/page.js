import { createApiAuction } from "@/redux/createApi";


const EmailTemplateApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({

    createEmailTemplate: builder.mutation({
      query: (formData) => ({
        url: "emailTemplate/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["allEmailTemplates"],
    }),

    updateEmailTemplate: builder.mutation({
      query: (formData) => ({
        url: `emailTemplate/${formData?.id}`,
        method: "PATCH",
        body: {
          name: formData?.name,
          subject: formData?.subject,
          content: formData?.content,
        },
      }),
      invalidatesTags: ["allEmailTemplates"],
    }),

    deleteEmailTemplate: builder.mutation({
      query: (id) => ({
        url: `emailTemplate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allEmailTemplates"],
    }),

    getEmailTemplateById: builder.query({
      query: (id) => ({
        url: `emailTemplate/${id}`,
        method: "GET",
      }),
      providesTags: ["departmentLeads"],
    }),

    allEmailTemplates: builder.query({
      query: () => ({
        url: `emailTemplate`,
      }),
      providesTags: ["allEmailTemplates"],
    }),

  }),
});

export const {
  useAllEmailTemplatesQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
  useGetEmailTemplateByIdQuery,
} = EmailTemplateApi;
