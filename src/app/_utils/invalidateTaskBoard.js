import { createApiAuction } from "@/redux/createApi";

const toId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value._id || null;
};

/** Invalidate task board + notifications so UI refetches without manual refresh */
export const invalidateTaskBoardTags = (dispatch, projectId) => {
  const id = toId(projectId);
  dispatch(
    createApiAuction.util.invalidateTags([
      "notifications",
      "allTasks",
      "allProjects",
      ...(id
        ? [
            { type: "tasks", id },
            { type: "project", id },
          ]
        : []),
    ])
  );

  if (id) {
    dispatch(
      createApiAuction.endpoints.getTasksByProject.initiate(id, {
        forceRefetch: true,
      })
    );
  }

  dispatch(
    createApiAuction.endpoints.getAllTasks.initiate(undefined, {
      forceRefetch: true,
    })
  );
};
