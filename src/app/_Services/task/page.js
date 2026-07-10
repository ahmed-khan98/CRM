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

const TaskApi = createApiAuction.injectEndpoints({
  overrideExisting: process.env.NODE_ENV !== "production",
  endpoints: (builder) => ({

    // ── All tasks (across all projects) ──────────────────────────
    getAllTasks: builder.query({
      query: () => "task/all",
      providesTags: ["allTasks"],
      keepUnusedDataFor: 180,
    }),

    // ── Tasks for a specific project ──────────────────────────────
    getTasksByProject: builder.query({
      query: (projectId) => `task/project/${projectId}`,
      providesTags: (result, error, projectId) => [{ type: "tasks", id: projectId }],
      keepUnusedDataFor: 180,
    }),

    // ── Create task (supports optional file attachment) ───────────
    createTask: builder.mutation({
      query: (body) => {
        const { projectId, title, description, priority, assignees, dueDate, status, attachment } = body;
        if (attachment) {
          const fd = new FormData();
          fd.append("projectId", projectId);
          fd.append("title", title);
          if (description) fd.append("description", description);
          if (priority) fd.append("priority", priority);
          if (status) fd.append("status", status);
          if (dueDate) fd.append("dueDate", dueDate);
          // Send assignees as JSON string — multer can't handle repeated keys reliably
          fd.append("assignees", JSON.stringify(assignees || []));
          fd.append("attachment", attachment);
          return { url: "task/", method: "POST", body: fd };
        }
        return { url: "task/", method: "POST", body: { projectId, title, description, priority, assignees, dueDate, status } };
      },
      invalidatesTags: (result, error, body) => taskMutationTags(body.projectId),
    }),

    // ── Update task (supports optional file — replaces creatorAttachment) ──
    updateTask: builder.mutation({
      query: ({ id, projectId, attachment, assignees, ...rest }) => {
        if (attachment) {
          const fd = new FormData();
          Object.entries(rest).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
          fd.append("assignees", JSON.stringify(assignees || []));
          fd.append("attachment", attachment);
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
      invalidatesTags: (result, error, { projectId }) => taskMutationTags(projectId),
    }),

    // ── Comments ──────────────────────────────────────────────────
    addComment: builder.mutation({
      query: ({ id, text }) => ({ url: `task/${id}/comment`, method: "POST", body: { text } }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "tasks", id: projectId },
        "allTasks",
      ],
    }),

    deleteComment: builder.mutation({
      query: ({ taskId, commentId }) => ({ url: `task/${taskId}/comment/${commentId}`, method: "DELETE" }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "tasks", id: projectId },
        "allTasks",
      ],
    }),

    // ── Attachments ───────────────────────────────────────────────
    uploadCreatorAttachment: builder.mutation({
      query: ({ id, file }) => {
        const fd = new FormData();
        fd.append("attachment", file);
        return { url: `task/${id}/creator-attachment`, method: "PATCH", body: fd };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "tasks", id: projectId },
        "allTasks",
      ],
    }),

    uploadAssigneeAttachment: builder.mutation({
      query: ({ id, file }) => {
        const fd = new FormData();
        fd.append("attachment", file);
        return { url: `task/${id}/assignee-attachment`, method: "PATCH", body: fd };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "tasks", id: projectId },
        "allTasks",
      ],
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
} = TaskApi;
