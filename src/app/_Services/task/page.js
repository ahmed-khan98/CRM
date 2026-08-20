import { createApiAuction } from "@/redux/createApi";

const getProjectId = (projectId) => projectId?._id || projectId;

const taskMutationTags = (projectId, { includeAllProjects = true } = {}) => {
  const id = getProjectId(projectId);
  return [
    ...(id ? [{ type: "tasks", id }] : []),
    "allTasks",
    ...(includeAllProjects ? ["allProjects"] : []),
    ...(id ? [{ type: "project", id }] : []),
  ];
};

const groupTasksIntoColumns = (tasks) => {
  const columns = { todo: [], "in-progress": [], "in-review": [], done: [] };
  (tasks || []).forEach((t) => {
    if (columns[t.status]) columns[t.status].push(t);
  });
  return columns;
};

/**
 * Patches a single updated task directly into the already-cached
 * getAllTasks / getTasksByProject results instead of invalidating those
 * tags — comment/attachment mutations only ever change one task's fields,
 * so refetching (and re-rendering) the *entire* board/list for that was
 * pure waste. Falls back to nothing if a cache entry isn't populated yet
 * (nothing to patch), letting the next natural fetch pick it up.
 */
function patchTaskInCaches(dispatch, projectId, updatedTask) {
  if (!updatedTask?._id) return;
  const pid = getProjectId(projectId);

  dispatch(
    TaskApi.util.updateQueryData("getAllTasks", undefined, (draft) => {
      if (!Array.isArray(draft?.data)) return;
      const idx = draft.data.findIndex((t) => t._id === updatedTask._id);
      if (idx !== -1) draft.data[idx] = updatedTask;
    })
  );

  if (pid) {
    dispatch(
      TaskApi.util.updateQueryData("getTasksByProject", pid, (draft) => {
        const list = draft?.data?.tasks;
        if (!Array.isArray(list)) return;
        const idx = list.findIndex((t) => t._id === updatedTask._id);
        if (idx !== -1) {
          list[idx] = updatedTask;
          draft.data.columns = groupTasksIntoColumns(list);
        }
      })
    );
  }
}

const TaskApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({

    // ── All tasks (across all projects) ──────────────────────────
    getAllTasks: builder.query({
      query: () => "task/all",
      providesTags: ["allTasks"],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: true,
    }),

    // ── Tasks for a specific project ──────────────────────────────
    getTasksByProject: builder.query({
      query: (projectId) => `task/project/${projectId}`,
      providesTags: (result, error, projectId) => [{ type: "tasks", id: projectId }],
      keepUnusedDataFor: 180,
      refetchOnMountOrArgChange: true,
    }),

    // ── Create task (supports optional file attachments — multiple) ───
    createTask: builder.mutation({
      query: (body) => {
        const { projectId, title, description, priority, assignees, dueDate, status, attachments } = body;
        const files = (attachments || []).filter(Boolean);
        if (files.length) {
          const fd = new FormData();
          fd.append("projectId", projectId);
          fd.append("title", title);
          if (description) fd.append("description", description);
          if (priority) fd.append("priority", priority);
          if (status) fd.append("status", status);
          if (dueDate) fd.append("dueDate", dueDate);
          // Send assignees as JSON string — multer can't handle repeated keys reliably
          fd.append("assignees", JSON.stringify(assignees || []));
          files.forEach((f) => fd.append("attachment", f));
          return { url: "task/", method: "POST", body: fd };
        }
        return { url: "task/", method: "POST", body: { projectId, title, description, priority, assignees, dueDate, status } };
      },
      invalidatesTags: (result, error, body) => taskMutationTags(body.projectId),
    }),

    // ── Update task (supports optional files — appended to creatorAttachment) ──
    updateTask: builder.mutation({
      query: ({ id, projectId, attachments, assignees, ...rest }) => {
        const files = (attachments || []).filter(Boolean);
        if (files.length) {
          const fd = new FormData();
          Object.entries(rest).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
          fd.append("assignees", JSON.stringify(assignees || []));
          files.forEach((f) => fd.append("attachment", f));
          return { url: `task/${id}`, method: "PATCH", body: fd };
        }
        return { url: `task/${id}`, method: "PATCH", body: { ...rest, assignees } };
      },
      invalidatesTags: (result, error, { projectId }) => taskMutationTags(projectId),
    }),

    // ── Drag-and-drop status update ───────────────────────────────
    // Status/order changes do not affect project list counts — skip allProjects.
    updateTaskStatus: builder.mutation({
      query: ({ id, status, order }) => ({
        url: `task/${id}/status`,
        method: "PATCH",
        body: { status, order },
      }),
      invalidatesTags: (result, error, { projectId }) =>
        taskMutationTags(projectId, { includeAllProjects: false }),
    }),

    // ── Delete task ───────────────────────────────────────────────
    deleteTask: builder.mutation({
      query: ({ id }) => ({ url: `task/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, { projectId }) => [
        ...taskMutationTags(projectId),
        "notifications",
      ],
    }),

    // ── Comments ──────────────────────────────────────────────────
    // These four only ever mutate a single task's fields — patch that task
    // directly into the cached lists (via the mutation's own response,
    // once confirmed) instead of invalidating the whole project board /
    // global list and forcing every card to refetch and re-render.
    addComment: builder.mutation({
      query: ({ id, text }) => ({ url: `task/${id}/comment`, method: "POST", body: { text } }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchTaskInCaches(dispatch, projectId, data?.data);
        } catch {}
      },
    }),

    deleteComment: builder.mutation({
      query: ({ taskId, commentId }) => ({ url: `task/${taskId}/comment/${commentId}`, method: "DELETE" }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchTaskInCaches(dispatch, projectId, data?.data);
        } catch {}
      },
    }),

    // ── Attachments (multiple files per upload allowed) ────────────
    uploadCreatorAttachment: builder.mutation({
      query: ({ id, files }) => {
        const fd = new FormData();
        (Array.isArray(files) ? files : [files]).filter(Boolean).forEach((f) => fd.append("attachment", f));
        return { url: `task/${id}/creator-attachment`, method: "PATCH", body: fd };
      },
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchTaskInCaches(dispatch, projectId, data?.data);
        } catch {}
      },
    }),

    uploadAssigneeAttachment: builder.mutation({
      query: ({ id, files }) => {
        const fd = new FormData();
        (Array.isArray(files) ? files : [files]).filter(Boolean).forEach((f) => fd.append("attachment", f));
        return { url: `task/${id}/assignee-attachment`, method: "PATCH", body: fd };
      },
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchTaskInCaches(dispatch, projectId, data?.data);
        } catch {}
      },
    }),

    deleteCreatorAttachment: builder.mutation({
      query: ({ id, publicId }) => ({
        url: `task/${id}/creator-attachment`,
        method: "DELETE",
        body: { publicId },
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchTaskInCaches(dispatch, projectId, data?.data);
        } catch {}
      },
    }),

    deleteAssigneeAttachment: builder.mutation({
      query: ({ id, publicId }) => ({
        url: `task/${id}/assignee-attachment`,
        method: "DELETE",
        body: { publicId },
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchTaskInCaches(dispatch, projectId, data?.data);
        } catch {}
      },
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetTasksByProjectQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useUploadCreatorAttachmentMutation,
  useUploadAssigneeAttachmentMutation,
  useDeleteCreatorAttachmentMutation,
  useDeleteAssigneeAttachmentMutation,
} = TaskApi;
