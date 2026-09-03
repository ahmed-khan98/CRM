/**
 * OS / browser native notification helpers (Windows Action Center style).
 */

export function getNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function ensureNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

function getId(value) {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  const id = value._id ?? value.id;
  return id ? String(id) : null;
}

/** Build in-app path from a notification payload. */
export function pathFromNotificationPayload(payload = {}) {
  const type = payload?.type || payload?.kind || "";
  const leadId = getId(payload.leadId);
  const conversationId = getId(payload.conversationId);
  const projectId = getId(payload.projectId);
  const taskId = getId(payload.taskId);

  if (
    type === "LEAD_SCHEDULE" ||
    String(payload?.title || "")
      .toLowerCase()
      .includes("lead follow-up")
  ) {
    if (leadId) return `/dashboard/lead/detail/${leadId}`;
  }

  if (
    ["CHAT_MESSAGE", "CHAT_MENTION", "CHAT_GROUP", "MISSED_CALL", "INCOMING_CALL"].includes(
      type,
    ) ||
    payload?.kind === "incoming_call" ||
    conversationId
  ) {
    if (conversationId) {
      return `/dashboard/chat?conversation=${conversationId}`;
    }
    return "/dashboard/chat";
  }

  if (
    ["TASK_ASSIGNED", "TASK_STATUS", "TASK_COMMENT"].includes(type) ||
    projectId
  ) {
    if (projectId && taskId && type !== "TASK_STATUS") {
      return `/dashboard/projects/${projectId}?task=${taskId}`;
    }
    if (projectId) return `/dashboard/projects/${projectId}`;
  }

  return null;
}

/**
 * Show a native browser/OS notification.
 * Returns the Notification instance or null.
 */
export function showBrowserNotification(payload = {}, { onClick } = {}) {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  if (Notification.permission !== "granted") return null;

  const title = payload?.title || "Notification";
  const body = payload?.message || payload?.body || "";
  const tag =
    payload?.tag ||
    getId(payload?._id) ||
    getId(payload?.conversationId) ||
    getId(payload?.leadId) ||
    getId(payload?.taskId) ||
    undefined;

  try {
    const n = new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag,
      renotify: Boolean(tag),
      data: payload,
    });

    n.onclick = (event) => {
      event?.preventDefault?.();
      try {
        window.focus();
      } catch {
        /* ignore */
      }
      n.close();
      if (typeof onClick === "function") onClick(payload);
    };

    // Auto-close after a bit so tray doesn't fill up
    setTimeout(() => {
      try {
        n.close();
      } catch {
        /* ignore */
      }
    }, 12000);

    return n;
  } catch {
    return null;
  }
}
