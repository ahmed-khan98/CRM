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

export function getTaskProjectInfo(task, project) {
  return {
    projectId: task?.projectId?._id || task?.projectId || project?._id,
    projectName: task?.projectId?.name || project?.name || null,
    departmentName:
      task?.projectId?.clientId?.departmentId?.name
      || project?.clientId?.departmentId?.name
      || null,
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
        task.createdBy?.departmentId?.name?.toLowerCase().includes(q);
      if (!matches) return;
    }
    if (cols[task.status]) cols[task.status].push(task);
  });

  return cols;
}
