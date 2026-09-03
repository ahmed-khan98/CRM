// Custom service-worker code, bundled by @ducanh2912/next-pwa into the
// generated sw.js (see next.config.mjs — no config needed, this is the
// default `customWorkerSrc` location). This is what lets notifications
// reach the user as a real OS toast even when the PWA tab/app isn't
// in the foreground.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  if (data.kind === "call_ended") {
    event.waitUntil(
      self.registration
        .getNotifications({ tag: `call-${data.callId}` })
        .then((list) => list.forEach((n) => n.close()))
    );
    return;
  }

  const isCall = data.kind === "incoming_call";
  const title = data.title || "New notification";
  const tag =
    (isCall && data.callId && `call-${data.callId}`) ||
    (data.conversationId && `chat-${data.conversationId}`) ||
    (data.leadId && `lead-${data.leadId}`) ||
    (data.taskId && `task-${data.taskId}`) ||
    undefined;

  const options = {
    body: data.body || data.message || "",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag,
    renotify: Boolean(tag),
    requireInteraction: Boolean(isCall),
    vibrate: isCall ? [300, 150, 300, 150, 300] : [200],
    data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

function pathFromPushData(data = {}) {
  const type = data.type || data.kind || "";
  if (data.leadId) {
    return `/dashboard/lead/detail/${data.leadId}`;
  }
  if (
    data.conversationId ||
    type === "incoming_call" ||
    String(type).startsWith("CHAT") ||
    type === "MISSED_CALL" ||
    type === "INCOMING_CALL"
  ) {
    return data.conversationId
      ? `/dashboard/chat?conversation=${data.conversationId}`
      : "/dashboard/chat";
  }
  if (data.projectId) {
    if (data.taskId && type !== "TASK_STATUS") {
      return `/dashboard/projects/${data.projectId}?task=${data.taskId}`;
    }
    return `/dashboard/projects/${data.projectId}`;
  }
  return "/dashboard";
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const targetPath = pathFromPushData(data);

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        const existing = clientsArr.find((c) => "focus" in c);
        if (existing) {
          existing.postMessage({ type: "PUSH_NOTIFICATION_CLICK", data });
          return existing.focus().then(() => {
            try {
              if ("navigate" in existing && targetPath) {
                return existing.navigate(targetPath);
              }
            } catch {
              /* ignore */
            }
            return null;
          });
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetPath);
        }
        return null;
      })
  );
});
