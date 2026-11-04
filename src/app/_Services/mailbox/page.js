import { createApiAuction } from "@/redux/createApi";

/**
 * Mailbox module RTK endpoints (Phase 1 — mapping).
 * No custom tagTypes (avoids editing createApi.js); pages call refetch().
 */
const MailboxApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    getMailboxServerDefaults: builder.query({
      query: () => ({ url: "mailbox/server-defaults" }),
    }),
    upsertMailboxServerDefaults: builder.mutation({
      query: (body) => ({
        url: "mailbox/server-defaults",
        method: "PUT",
        body,
      }),
    }),
    deleteMailboxServerDefaults: builder.mutation({
      query: (id) => ({
        url: `mailbox/server-defaults/id/${id}`,
        method: "DELETE",
      }),
    }),
    getMailboxMapping: builder.query({
      query: () => ({ url: "mailbox/mailboxes" }),
    }),
    getMailboxBrandEmails: builder.query({
      query: () => ({ url: "mailbox/brand-emails" }),
    }),
    getMailboxBrands: builder.query({
      query: () => ({ url: "mailbox/brands" }),
    }),
    getMailboxDepartments: builder.query({
      query: () => ({ url: "mailbox/departments" }),
    }),
    getMailboxAssignableUsers: builder.query({
      query: (params = {}) => ({
        url: "mailbox/users",
        params,
      }),
    }),
    testMailboxConnection: builder.mutation({
      query: (body) => ({
        url: "mailbox/test-connection",
        method: "POST",
        body,
      }),
    }),
    createMailbox: builder.mutation({
      query: (body) => ({
        url: "mailbox/mailboxes",
        method: "POST",
        body,
      }),
    }),
    deleteMailbox: builder.mutation({
      query: (id) => ({
        url: `mailbox/mailboxes/${id}`,
        method: "DELETE",
      }),
    }),
    updateMailbox: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `mailbox/mailboxes/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    getMailboxAssignments: builder.query({
      query: (mailboxId) => ({
        url: `mailbox/mailboxes/${mailboxId}/assignments`,
      }),
    }),
    assignMailboxUsers: builder.mutation({
      query: ({ mailboxId, assignments }) => ({
        url: `mailbox/mailboxes/${mailboxId}/assignments`,
        method: "POST",
        body: { assignments },
      }),
    }),
    updateMailboxAssignment: builder.mutation({
      query: ({ mailboxId, userId, permission }) => ({
        url: `mailbox/mailboxes/${mailboxId}/assignments/${userId}`,
        method: "PATCH",
        body: { permission },
      }),
    }),
    removeMailboxAssignment: builder.mutation({
      query: ({ mailboxId, userId }) => ({
        url: `mailbox/mailboxes/${mailboxId}/assignments/${userId}`,
        method: "DELETE",
      }),
    }),
    getMailboxAssignmentsByUser: builder.query({
      query: (userId) => ({
        url: `mailbox/users/${userId}/assignments`,
      }),
    }),
    setMailboxAssignmentsByUser: builder.mutation({
      query: ({ userId, assignments }) => ({
        url: `mailbox/users/${userId}/assignments`,
        method: "POST",
        body: { assignments },
      }),
    }),

    // Personal / company email (admin creates for users)
    getPersonalMailboxes: builder.query({
      query: () => ({ url: "mailbox/personal/all" }),
    }),
    getMyPersonalMailbox: builder.query({
      query: () => ({ url: "mailbox/personal" }),
    }),
    upsertMyPersonalMailbox: builder.mutation({
      query: (body) => ({
        url: "mailbox/personal",
        method: "PUT",
        body,
      }),
    }),
    deleteMyPersonalMailbox: builder.mutation({
      query: ({ id, userId } = {}) => ({
        url: "mailbox/personal",
        method: "DELETE",
        params: {
          ...(id ? { id } : {}),
          ...(userId ? { userId } : {}),
        },
      }),
    }),

    // ── Phase 2: mail content ──
    getMyMailboxes: builder.query({
      query: () => ({ url: "mailbox/my-mailboxes" }),
    }),
    getMailboxFolders: builder.query({
      query: (mailboxId) => ({
        url: `mailbox/mail/${mailboxId}/folders`,
      }),
    }),
    getMailboxMessages: builder.query({
      query: ({ mailboxId, folder, page = 1, pageSize = 25, search = "" }) => ({
        url: `mailbox/mail/${mailboxId}/messages`,
        params: {
          folder,
          page,
          pageSize,
          ...(search ? { search } : {}),
        },
      }),
    }),
    getMailboxMessage: builder.query({
      query: ({ mailboxId, uid, folder, loadImages = true }) => ({
        url: `mailbox/mail/${mailboxId}/messages/${uid}`,
        params: {
          folder,
          loadImages: loadImages === false ? "0" : "1",
        },
      }),
    }),
    patchMailboxMessageFlags: builder.mutation({
      query: ({ mailboxId, uid, folder, seen, flagged }) => ({
        url: `mailbox/mail/${mailboxId}/messages/${uid}/flags`,
        method: "PATCH",
        body: { folder, seen, flagged },
      }),
    }),

    // ── Phase 3 ──
    sendMailboxMail: builder.mutation({
      query: ({ mailboxId, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/send`,
        method: "POST",
        body,
      }),
    }),
    saveMailboxDraft: builder.mutation({
      query: ({ mailboxId, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/draft`,
        method: "POST",
        body,
      }),
    }),
    moveMailboxMail: builder.mutation({
      query: ({ mailboxId, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/move`,
        method: "POST",
        body,
      }),
    }),
    deleteMailboxMail: builder.mutation({
      query: ({ mailboxId, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/delete`,
        method: "POST",
        body,
      }),
    }),
    spamMailboxMail: builder.mutation({
      query: ({ mailboxId, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/spam`,
        method: "POST",
        body,
      }),
    }),
    bulkMailboxFlags: builder.mutation({
      query: ({ mailboxId, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/flags`,
        method: "POST",
        body,
      }),
    }),

    // ── Phase 4: scheduled + CRM ──
    getMailboxScheduled: builder.query({
      query: ({ mailboxId, status } = {}) => ({
        url: `mailbox/mail/${mailboxId}/scheduled`,
        params: status ? { status } : {},
      }),
    }),
    createMailboxScheduled: builder.mutation({
      query: ({ mailboxId, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/scheduled`,
        method: "POST",
        body,
      }),
    }),
    updateMailboxScheduled: builder.mutation({
      query: ({ mailboxId, id, ...body }) => ({
        url: `mailbox/mail/${mailboxId}/scheduled/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    cancelMailboxScheduled: builder.mutation({
      query: ({ mailboxId, id }) => ({
        url: `mailbox/mail/${mailboxId}/scheduled/${id}/cancel`,
        method: "POST",
      }),
    }),
    sendMailboxScheduledNow: builder.mutation({
      query: ({ mailboxId, id }) => ({
        url: `mailbox/mail/${mailboxId}/scheduled/${id}/send-now`,
        method: "POST",
      }),
    }),
    getMailboxCrmLink: builder.query({
      query: ({ mailboxId, email, messageId, subject, date, direction }) => ({
        url: `mailbox/mail/${mailboxId}/crm-link`,
        params: {
          email,
          ...(messageId ? { messageId } : {}),
          ...(subject ? { subject } : {}),
          ...(date ? { date } : {}),
          ...(direction ? { direction } : {}),
        },
      }),
    }),
  }),
});

export const {
  useGetMailboxServerDefaultsQuery,
  useUpsertMailboxServerDefaultsMutation,
  useDeleteMailboxServerDefaultsMutation,
  useGetMailboxMappingQuery,
  useGetMailboxBrandEmailsQuery,
  useGetMailboxBrandsQuery,
  useGetMailboxDepartmentsQuery,
  useGetMailboxAssignableUsersQuery,
  useLazyGetMailboxAssignableUsersQuery,
  useTestMailboxConnectionMutation,
  useCreateMailboxMutation,
  useUpdateMailboxMutation,
  useDeleteMailboxMutation,
  useGetMailboxAssignmentsQuery,
  useLazyGetMailboxAssignmentsQuery,
  useAssignMailboxUsersMutation,
  useUpdateMailboxAssignmentMutation,
  useRemoveMailboxAssignmentMutation,
  useGetMailboxAssignmentsByUserQuery,
  useLazyGetMailboxAssignmentsByUserQuery,
  useSetMailboxAssignmentsByUserMutation,
  useGetPersonalMailboxesQuery,
  useGetMyPersonalMailboxQuery,
  useUpsertMyPersonalMailboxMutation,
  useDeleteMyPersonalMailboxMutation,
  useGetMyMailboxesQuery,
  useGetMailboxFoldersQuery,
  useGetMailboxMessagesQuery,
  useGetMailboxMessageQuery,
  useLazyGetMailboxMessageQuery,
  usePatchMailboxMessageFlagsMutation,
  useSendMailboxMailMutation,
  useSaveMailboxDraftMutation,
  useMoveMailboxMailMutation,
  useDeleteMailboxMailMutation,
  useSpamMailboxMailMutation,
  useBulkMailboxFlagsMutation,
  useGetMailboxScheduledQuery,
  useCreateMailboxScheduledMutation,
  useUpdateMailboxScheduledMutation,
  useCancelMailboxScheduledMutation,
  useSendMailboxScheduledNowMutation,
  useGetMailboxCrmLinkQuery,
} = MailboxApi;
