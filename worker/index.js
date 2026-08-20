// Custom service-worker code, bundled by @ducanh2912/next-pwa into the
// generated sw.js (see next.config.mjs — no config needed, this is the
// default `customWorkerSrc` location). This is what lets an "incoming call"
// reach the user as a real OS notification even when the PWA tab/app isn't
// in the foreground (backgrounded, another app open, or fully closed) —
// something a plain in-page popup can never do, since JS in the page only
// runs while it's the active/foreground context.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  if (data.kind === "call_ended") {
    // Answered elsewhere / cancelled / timed out — clear the stale
    // "incoming call" notification on this device instead of leaving it
    // sitting in the tray forever.
    event.waitUntil(
      self.registration
        .getNotifications({ tag: `call-${data.callId}` })
        .then((list) => list.forEach((n) => n.close()))
    );
    return;
  }

  const isCall = data.kind === "incoming_call";
  const title = data.title || "New notification";
  const options = {
    body: data.body || data.message || "",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: isCall && data.callId ? `call-${data.callId}` : undefined,
    renotify: Boolean(isCall),
    requireInteraction: Boolean(isCall),
    vibrate: isCall ? [300, 150, 300, 150, 300] : [200],
    data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const targetPath = data.conversationId
    ? `/dashboard/chat?conversation=${data.conversationId}`
    : "/dashboard/chat";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        const existing = clientsArr.find((c) => "focus" in c);
        if (existing) {
          existing.postMessage({ type: "PUSH_NOTIFICATION_CLICK", data });
          return existing.focus();
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetPath);
        }
        return null;
      })
  );
});
