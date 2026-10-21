import { createApiAuction } from "@/redux/createApi";

const publicCareersRoot = () =>
  String(process.env.NEXT_PUBLIC_API_URL || "")
    .replace(/\/user\/?$/, "")
    .replace(/\/$/, "") + "/public/careers";

const recruitmentApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getRecruitmentDashboard: builder.query({
      query: () => ({ url: "recruitment/dashboard" }),
      providesTags: ["RecruitmentDashboard"],
    }),
    getRecruitmentReports: builder.query({
      query: (params) => ({ url: "recruitment/reports", params }),
      providesTags: ["RecruitmentDashboard"],
    }),

    getRecruitmentJobs: builder.query({
      query: (params) => ({ url: "recruitment/jobs", params }),
      providesTags: ["RecruitmentJobs"],
    }),
    getRecruitmentJob: builder.query({
      query: (id) => ({ url: `recruitment/jobs/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "RecruitmentJobs", id }],
    }),
    createRecruitmentJob: builder.mutation({
      query: (body) => ({ url: "recruitment/jobs", method: "POST", body }),
      invalidatesTags: ["RecruitmentJobs", "RecruitmentDashboard"],
    }),
    updateRecruitmentJob: builder.mutation({
      query: ({ id, body }) => ({
        url: `recruitment/jobs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RecruitmentJobs", "RecruitmentDashboard"],
    }),
    setRecruitmentJobStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `recruitment/jobs/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["RecruitmentJobs", "RecruitmentDashboard", "PublicCareers"],
    }),
    duplicateRecruitmentJob: builder.mutation({
      query: (id) => ({
        url: `recruitment/jobs/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["RecruitmentJobs"],
    }),
    deleteRecruitmentJob: builder.mutation({
      query: (id) => ({ url: `recruitment/jobs/${id}`, method: "DELETE" }),
      invalidatesTags: ["RecruitmentJobs", "RecruitmentDashboard"],
    }),

    getJobApplications: builder.query({
      query: ({ jobId, ...params }) => ({
        url: `recruitment/jobs/${jobId}/applications`,
        params,
      }),
      providesTags: ["RecruitmentApplications"],
    }),
    getRecruitmentApplications: builder.query({
      query: (params) => ({ url: "recruitment/applications", params }),
      providesTags: ["RecruitmentApplications"],
    }),
    getApplication: builder.query({
      query: (id) => ({ url: `recruitment/applications/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "RecruitmentApplications", id }],
    }),
    moveApplicationStage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `recruitment/applications/${id}/stage`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        "RecruitmentApplications",
        "RecruitmentDashboard",
        "RecruitmentCandidates",
      ],
    }),
    bulkMoveApplications: builder.mutation({
      query: (body) => ({
        url: "recruitment/applications/bulk-move",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RecruitmentApplications", "RecruitmentDashboard"],
    }),
    recomputeApplicationMatch: builder.mutation({
      query: (id) => ({
        url: `recruitment/applications/${id}/recompute-match`,
        method: "POST",
      }),
      // Do not invalidate RecruitmentApplications here — the page does one
      // explicit refetch, then polls. Tag invalidation + refetch was 2–4x spam.
      invalidatesTags: ["RecruitmentCandidates"],
    }),
    recomputeJobMatches: builder.mutation({
      query: (jobId) => ({
        url: `recruitment/jobs/${jobId}/recompute-matches`,
        method: "POST",
      }),
      invalidatesTags: ["RecruitmentCandidates"],
    }),
    getRematchBatchProgress: builder.query({
      query: ({ jobId, batchId }) => ({
        url: `recruitment/jobs/${jobId}/recompute-matches/${batchId}`,
      }),
    }),

    searchRecruitmentCandidates: builder.query({
      query: (params) => ({ url: "recruitment/candidates", params }),
      providesTags: ["RecruitmentCandidates"],
    }),
    getRecruitmentCandidate: builder.query({
      query: (id) => ({ url: `recruitment/candidates/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "RecruitmentCandidates", id }],
    }),
    updateRecruitmentCandidate: builder.mutation({
      query: ({ id, body }) => ({
        url: `recruitment/candidates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RecruitmentCandidates", "RecruitmentApplications"],
    }),
    addCandidateNote: builder.mutation({
      query: ({ id, body }) => ({
        url: `recruitment/candidates/${id}/notes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["RecruitmentCandidates", "RecruitmentApplications"],
    }),

    getRecruitmentInterviews: builder.query({
      query: (params) => ({ url: "recruitment/interviews", params }),
      providesTags: ["RecruitmentInterviews"],
    }),
    createRecruitmentInterview: builder.mutation({
      query: (body) => ({ url: "recruitment/interviews", method: "POST", body }),
      invalidatesTags: [
        "RecruitmentInterviews",
        "RecruitmentApplications",
        "RecruitmentDashboard",
      ],
    }),
    updateRecruitmentInterview: builder.mutation({
      query: ({ id, body }) => ({
        url: `recruitment/interviews/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RecruitmentInterviews"],
    }),
    cancelRecruitmentInterview: builder.mutation({
      query: (id) => ({
        url: `recruitment/interviews/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["RecruitmentInterviews", "RecruitmentDashboard"],
    }),
    submitInterviewFeedback: builder.mutation({
      query: ({ id, body }) => ({
        url: `recruitment/interviews/${id}/feedback`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["RecruitmentInterviews"],
    }),
    getInterviewFeedback: builder.query({
      query: (id) => ({ url: `recruitment/interviews/${id}/feedback` }),
      providesTags: ["RecruitmentInterviews"],
    }),

    getOfferTemplates: builder.query({
      query: () => ({ url: "recruitment/offer-templates" }),
      providesTags: ["RecruitmentOffers"],
    }),
    saveOfferTemplate: builder.mutation({
      query: (body) => ({
        url: "recruitment/offer-templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RecruitmentOffers"],
    }),
    getRecruitmentOffers: builder.query({
      query: (params) => ({ url: "recruitment/offers", params }),
      providesTags: ["RecruitmentOffers"],
    }),
    createRecruitmentOffer: builder.mutation({
      query: (body) => ({ url: "recruitment/offers", method: "POST", body }),
      invalidatesTags: ["RecruitmentOffers", "RecruitmentApplications"],
    }),
    updateRecruitmentOffer: builder.mutation({
      query: ({ id, body }) => ({
        url: `recruitment/offers/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RecruitmentOffers"],
    }),
    sendRecruitmentOffer: builder.mutation({
      query: (id) => ({
        url: `recruitment/offers/${id}/send`,
        method: "POST",
      }),
      invalidatesTags: [
        "RecruitmentOffers",
        "RecruitmentApplications",
        "RecruitmentDashboard",
      ],
    }),
    respondRecruitmentOffer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `recruitment/offers/${id}/respond`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "RecruitmentOffers",
        "RecruitmentApplications",
        "RecruitmentDashboard",
      ],
    }),
    resendJoiningLink: builder.mutation({
      query: (id) => ({
        url: `recruitment/offers/${id}/resend-joining`,
        method: "POST",
      }),
      invalidatesTags: ["RecruitmentOffers", "RecruitmentJoining"],
    }),
    getHirePrefill: builder.query({
      query: (offerId) => ({
        url: `recruitment/offers/${offerId}/hire-prefill`,
      }),
    }),

    getJoiningByOffer: builder.query({
      query: (offerId) => ({
        url: `recruitment/joining/by-offer/${offerId}`,
      }),
      providesTags: (_r, _e, offerId) => [
        { type: "RecruitmentJoining", id: `offer-${offerId}` },
      ],
    }),
    getJoiningById: builder.query({
      query: (id) => ({ url: `recruitment/joining/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "RecruitmentJoining", id }],
    }),
    updateJoiningByHr: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `recruitment/joining/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        "RecruitmentJoining",
        "RecruitmentOffers",
        "RecruitmentCandidates",
      ],
    }),
    approveJoining: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `recruitment/joining/${id}/approve`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "RecruitmentJoining",
        "RecruitmentOffers",
        "RecruitmentCandidates",
      ],
    }),
    requestJoiningChanges: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `recruitment/joining/${id}/request-changes`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "RecruitmentJoining",
        "RecruitmentOffers",
        "RecruitmentCandidates",
      ],
    }),
    resendJoiningById: builder.mutation({
      query: (id) => ({
        url: `recruitment/joining/${id}/resend`,
        method: "POST",
      }),
      invalidatesTags: ["RecruitmentJoining", "RecruitmentOffers"],
    }),

    getRecruitmentSettings: builder.query({
      query: () => ({ url: "recruitment/settings" }),
      providesTags: ["RecruitmentSettings"],
    }),
    updateRecruitmentSettings: builder.mutation({
      query: (body) => ({
        url: "recruitment/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RecruitmentSettings", "PublicCareers"],
    }),
    getRecruitmentEmailTemplates: builder.query({
      query: () => ({ url: "recruitment/email-templates" }),
      providesTags: ["RecruitmentEmailTemplates"],
    }),
    updateRecruitmentEmailTemplate: builder.mutation({
      query: ({ key, body }) => ({
        url: `recruitment/email-templates/${key}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RecruitmentEmailTemplates"],
    }),

    // Public careers (no auth required)
    getPublicCareersJobs: builder.query({
      query: (params) => ({
        url: `${publicCareersRoot()}/jobs`,
        params,
      }),
      providesTags: ["PublicCareers"],
    }),
    getPublicCareersJob: builder.query({
      query: (slug) => ({
        url: `${publicCareersRoot()}/jobs/${slug}`,
      }),
      providesTags: ["PublicCareers"],
    }),
    applyPublicCareersJob: builder.mutation({
      query: ({ slug, formData }) => ({
        url: `${publicCareersRoot()}/jobs/${slug}/apply`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PublicCareers", "RecruitmentApplications", "RecruitmentDashboard"],
    }),
    getPublicApplicationStatus: builder.query({
      query: (params) => ({
        url: `${publicCareersRoot()}/applications/status`,
        params,
      }),
    }),

    getPublicOfferRespond: builder.query({
      query: (token) => ({
        url: `${publicCareersRoot()}/offers/respond/${token}`,
      }),
    }),
    publicRespondOffer: builder.mutation({
      query: ({ token, action }) => ({
        url: `${publicCareersRoot()}/offers/respond/${token}`,
        method: "POST",
        body: { action },
      }),
    }),
    getPublicJoining: builder.query({
      query: (token) => ({
        url: `${publicCareersRoot()}/joining/${token}`,
      }),
      providesTags: (_r, _e, token) => [{ type: "PublicJoining", id: token }],
    }),
    savePublicJoiningDraft: builder.mutation({
      query: ({ token, data }) => ({
        url: `${publicCareersRoot()}/joining/${token}`,
        method: "PATCH",
        body: { data },
      }),
      invalidatesTags: (_r, _e, { token }) => [{ type: "PublicJoining", id: token }],
    }),
    submitPublicJoining: builder.mutation({
      query: ({ token, data }) => ({
        url: `${publicCareersRoot()}/joining/${token}/submit`,
        method: "POST",
        body: { data },
      }),
      invalidatesTags: (_r, _e, { token }) => [{ type: "PublicJoining", id: token }],
    }),
    uploadPublicJoiningFile: builder.mutation({
      query: ({ token, formData }) => ({
        url: `${publicCareersRoot()}/joining/${token}/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_r, _e, { token }) => [{ type: "PublicJoining", id: token }],
    }),
  }),
});

export const {
  useGetRecruitmentDashboardQuery,
  useGetRecruitmentReportsQuery,
  useGetRecruitmentJobsQuery,
  useGetRecruitmentJobQuery,
  useCreateRecruitmentJobMutation,
  useUpdateRecruitmentJobMutation,
  useSetRecruitmentJobStatusMutation,
  useDuplicateRecruitmentJobMutation,
  useDeleteRecruitmentJobMutation,
  useGetJobApplicationsQuery,
  useGetRecruitmentApplicationsQuery,
  useGetApplicationQuery,
  useMoveApplicationStageMutation,
  useBulkMoveApplicationsMutation,
  useSearchRecruitmentCandidatesQuery,
  useGetRecruitmentCandidateQuery,
  useUpdateRecruitmentCandidateMutation,
  useAddCandidateNoteMutation,
  useGetRecruitmentInterviewsQuery,
  useCreateRecruitmentInterviewMutation,
  useUpdateRecruitmentInterviewMutation,
  useCancelRecruitmentInterviewMutation,
  useSubmitInterviewFeedbackMutation,
  useGetInterviewFeedbackQuery,
  useGetOfferTemplatesQuery,
  useSaveOfferTemplateMutation,
  useGetRecruitmentOffersQuery,
  useCreateRecruitmentOfferMutation,
  useUpdateRecruitmentOfferMutation,
  useSendRecruitmentOfferMutation,
  useRespondRecruitmentOfferMutation,
  useResendJoiningLinkMutation,
  useLazyGetHirePrefillQuery,
  useGetJoiningByOfferQuery,
  useLazyGetJoiningByOfferQuery,
  useGetJoiningByIdQuery,
  useUpdateJoiningByHrMutation,
  useApproveJoiningMutation,
  useRequestJoiningChangesMutation,
  useResendJoiningByIdMutation,
  useRecomputeApplicationMatchMutation,
  useRecomputeJobMatchesMutation,
  useGetRematchBatchProgressQuery,
  useLazyGetRematchBatchProgressQuery,
  useGetRecruitmentSettingsQuery,
  useUpdateRecruitmentSettingsMutation,
  useGetRecruitmentEmailTemplatesQuery,
  useUpdateRecruitmentEmailTemplateMutation,
  useGetPublicCareersJobsQuery,
  useGetPublicCareersJobQuery,
  useApplyPublicCareersJobMutation,
  useGetPublicApplicationStatusQuery,
  useLazyGetPublicApplicationStatusQuery,
  useGetPublicOfferRespondQuery,
  usePublicRespondOfferMutation,
  useGetPublicJoiningQuery,
  useSavePublicJoiningDraftMutation,
  useSubmitPublicJoiningMutation,
  useUploadPublicJoiningFileMutation,
} = recruitmentApi;

export default recruitmentApi;
