import { createApiAuction } from "@/redux/createApi";

export const chatApi = createApiAuction.injectEndpoints({
  endpoints: (builder) => ({
    searchChatUsers: builder.query({
      query: (params) => ({
        url: "chat/users/search",
        params,
      }),
    }),
    getChatPresence: builder.query({
      query: (userIds) => ({
        url: "chat/users/presence",
        params: { userIds: Array.isArray(userIds) ? userIds.join(",") : userIds },
      }),
    }),
    getMyChatProfile: builder.query({
      query: () => "chat/me",
    }),
    getConversations: builder.query({
      query: (params = {}) => ({
        url: "chat/conversations",
        params,
      }),
      providesTags: ["ChatConversations"],
    }),
    getConversation: builder.query({
      query: (id) => `chat/conversations/${id}`,
      providesTags: (r, e, id) => [{ type: "ChatConversations", id }],
    }),
    createDirectChat: builder.mutation({
      query: (body) => ({
        url: "chat/conversations/direct",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    createGroupChat: builder.mutation({
      query: (body) => ({
        url: "chat/conversations/group",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    updateConversation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `chat/conversations/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    addGroupMembers: builder.mutation({
      query: ({ id, memberIds }) => ({
        url: `chat/conversations/${id}/members`,
        method: "POST",
        body: { memberIds },
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    removeGroupMember: builder.mutation({
      query: ({ id, userId }) => ({
        url: `chat/conversations/${id}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    setMemberRole: builder.mutation({
      query: ({ id, userId, role }) => ({
        url: `chat/conversations/${id}/members/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `chat/conversations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    deleteChatForMe: builder.mutation({
      query: (id) => ({
        url: `chat/conversations/${id}/for-me`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    getMessages: builder.query({
      query: ({ conversationId, before, after, limit = 40 }) => {
        const params = { limit };
        if (before) params.before = before;
        if (after) params.after = after;
        return {
          url: `chat/conversations/${conversationId}/messages`,
          params,
        };
      },
      providesTags: (r, e, arg) => [
        { type: "ChatMessages", id: arg.conversationId },
      ],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, ...body }) => ({
        url: `chat/conversations/${conversationId}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    markConversationRead: builder.mutation({
      query: (id) => ({
        url: `chat/conversations/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    getSharedMedia: builder.query({
      query: ({ conversationId, kind }) => ({
        url: `chat/conversations/${conversationId}/media`,
        params: { kind },
      }),
    }),
    editMessage: builder.mutation({
      query: ({ messageId, body }) => ({
        url: `chat/messages/${messageId}`,
        method: "PATCH",
        body: { body },
      }),
    }),
    deleteMessage: builder.mutation({
      query: ({ messageId, forEveryone }) => ({
        url: `chat/messages/${messageId}`,
        method: "DELETE",
        body: { forEveryone },
      }),
    }),
    reactMessage: builder.mutation({
      query: ({ messageId, emoji }) => ({
        url: `chat/messages/${messageId}/react`,
        method: "POST",
        body: { emoji },
      }),
    }),
    starMessage: builder.mutation({
      query: (messageId) => ({
        url: `chat/messages/${messageId}/star`,
        method: "POST",
      }),
    }),
    forwardMessage: builder.mutation({
      query: ({ messageId, targetConversationIds }) => ({
        url: `chat/messages/${messageId}/forward`,
        method: "POST",
        body: { targetConversationIds },
      }),
      invalidatesTags: ["ChatConversations"],
    }),
    searchMessages: builder.query({
      query: (params) => ({
        url: "chat/messages/search",
        params,
      }),
    }),
    uploadChatFile: builder.mutation({
      query: (formData) => ({
        url: "chat/upload",
        method: "POST",
        body: formData,
      }),
    }),
    getCallLogs: builder.query({
      query: (params) => ({
        url: "chat/calls",
        params,
      }),
      providesTags: ["ChatCalls"],
    }),
    getIceServers: builder.query({
      query: () => "chat/webrtc/ice",
    }),
    getBlockedUsers: builder.query({
      query: () => "chat/blocks",
      providesTags: ["ChatBlocks"],
    }),
    blockUser: builder.mutation({
      query: (body) => ({
        url: "chat/blocks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ChatBlocks"],
    }),
    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `chat/blocks/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatBlocks"],
    }),
    adminDisableChat: builder.mutation({
      query: (body) => ({
        url: "chat/admin/disable",
        method: "POST",
        body,
      }),
    }),
    adminEnableChat: builder.mutation({
      query: (userId) => ({
        url: `chat/admin/disable/${userId}`,
        method: "DELETE",
      }),
    }),
    adminDeleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `chat/admin/messages/${messageId}`,
        method: "DELETE",
      }),
    }),
    getPushVapidKey: builder.query({
      query: () => "chat/push/vapid-key",
    }),
    subscribePush: builder.mutation({
      query: (body) => ({
        url: "chat/push/subscribe",
        method: "POST",
        body,
      }),
    }),
    unsubscribePush: builder.mutation({
      query: (body) => ({
        url: "chat/push/unsubscribe",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSearchChatUsersQuery,
  useLazySearchChatUsersQuery,
  useGetChatPresenceQuery,
  useLazyGetChatPresenceQuery,
  useGetMyChatProfileQuery,
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateDirectChatMutation,
  useCreateGroupChatMutation,
  useUpdateConversationMutation,
  useAddGroupMembersMutation,
  useRemoveGroupMemberMutation,
  useSetMemberRoleMutation,
  useDeleteGroupMutation,
  useDeleteChatForMeMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useGetSharedMediaQuery,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useReactMessageMutation,
  useStarMessageMutation,
  useForwardMessageMutation,
  useLazySearchMessagesQuery,
  useUploadChatFileMutation,
  useGetCallLogsQuery,
  useGetIceServersQuery,
  useGetBlockedUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useAdminDisableChatMutation,
  useAdminEnableChatMutation,
  useAdminDeleteMessageMutation,
  useLazyGetPushVapidKeyQuery,
  useSubscribePushMutation,
  useUnsubscribePushMutation,
} = chatApi;
