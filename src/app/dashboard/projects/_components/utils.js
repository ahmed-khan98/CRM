export function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelativeTime(d) {
  if (!d) return null;
  const date = new Date(d);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

export function hasProjectClient(project) {
  const client = project?.clientId;
  if (!client) return false;
  if (typeof client === "string") return true;
  return Boolean(client._id || client.name || client.companyName);
}

export function getProjectDepartmentName(project) {
  if (!project) return null;
  if (project.clientId?.departmentId?.name) {
    return project.clientId.departmentId.name;
  }
  return project.createdBy?.departmentId?.name || null;
}

export function getTaskProjectInfo(task, project) {
  const resolvedProject = task?.projectId || project;
  return {
    projectId: resolvedProject?._id || resolvedProject || null,
    projectName: resolvedProject?.name || null,
    departmentName: getProjectDepartmentName(resolvedProject),
  };
}

export function getClientDisplayName(client) {
  if (!client) return "No client";
  return client.companyName || client.name || "No client";
}

export function formatDue(date) {
  if (!date) return null;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(d);
  dueDay.setHours(0, 0, 0, 0);
  const isOverdue = dueDay < today;
  const str = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { str, isOverdue };
}

export function groupTasksIntoColumns(tasks, search = "") {
  const cols = { todo: [], "in-progress": [], "in-review": [], done: [] };
  const q = search.trim().toLowerCase();

  tasks.forEach((task) => {
    if (q) {
      const matches =
        task.title?.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q) ||
        task.projectId?.name?.toLowerCase().includes(q) ||
        task.projectId?.clientId?.companyName?.toLowerCase().includes(q) ||
        task.projectId?.clientId?.name?.toLowerCase().includes(q) ||
        task.assignees?.some((a) => a.fullName?.toLowerCase().includes(q)) ||
        task.createdBy?.fullName?.toLowerCase().includes(q) ||
        task.projectId?.clientId?.departmentId?.name?.toLowerCase().includes(q) ||
        getProjectDepartmentName(task.projectId)?.toLowerCase().includes(q) ||
        task.createdBy?.departmentId?.name?.toLowerCase().includes(q);
      if (!matches) return;
    }
    if (cols[task.status]) cols[task.status].push(task);
  });

  return cols;
}
