"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  playNotificationSound,
  unlockNotificationAudio,
} from "@/app/_utils/notificationSound";
import {
  ensureNotificationPermission,
  pathFromNotificationPayload,
  showBrowserNotification,
} from "@/app/_utils/browserNotification";
import { invalidateTaskBoardTags } from "@/app/_utils/invalidateTaskBoard";
import {
  chatApi,
  patchConversationsOnMessageDeleted,
  useLazyGetPushVapidKeyQuery,
  useSubscribePushMutation,
} from "@/app/_Services/chat/chatApi";

const SocketContext = createContext(null);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const getSocketBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL.replace(/^['"]|['"]$/g, "").replace(
      /\/$/,
      ""
    );
  }
  const api = (process.env.NEXT_PUBLIC_API_URL || "")
    .replace(/^['"]|['"]$/g, "")
    .trim();
  if (!api) return "";
  try {
    if (/^https?:\/\//i.test(api)) {
      const u = new URL(api);
      u.pathname =
        u.pathname.replace(/\/api\/v1\/user\/?$/i, "").replace(/\/$/, "") || "/";
      u.search = "";
      u.hash = "";
      return u.pathname === "/"
        ? u.origin
        : `${u.origin}${u.pathname}`.replace(/\/$/, "");
    }
  } catch {
    /* ignore */
  }
  return "";
};

export function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [presenceMap, setPresenceMap] = useState({});
  const listenersRef = useRef(new Map());
  const pushSetupRef = useRef(false);
  const [fetchVapidKey] = useLazyGetPushVapidKeyQuery();
  const [subscribePush] = useSubscribePushMutation();

  const navigateFromPayload = useCallback((payload) => {
    const path = pathFromNotificationPayload(payload);
    if (path) routerRef.current.push(path);
  }, []);

  const emit = useCallback((event, payload, ack) => {
    const s = socketRef.current;
    if (!s?.connected) return;
    if (ack) s.emit(event, payload, ack);
    else s.emit(event, payload);
  }, []);

  const on = useCallback((event, handler) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event).add(handler);
    socketRef.current?.on(event, handler);
    return () => {
      listenersRef.current.get(event)?.delete(handler);
      socketRef.current?.off(event, handler);
    };
  }, []);

  useEffect(() => {
    const unlock = () => unlockNotificationAudio();
    const events = ["pointerdown", "click", "keydown", "touchstart"];
    events.forEach((evt) =>
      window.addEventListener(evt, unlock, { capture: true })
    );

    // Ask once for browser notification permission (Allow / Block dialog)
    ensureNotificationPermission().catch(() => {});

    const onSwMessage = (event) => {
      if (event?.data?.type !== "PUSH_NOTIFICATION_CLICK") return;
      navigateFromPayload(event.data.data || {});
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onSwMessage);
    }

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, unlock, { capture: true })
      );
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onSwMessage);
      }
    };
  }, [navigateFromPayload]);

  useEffect(() => {
    const baseUrl = getSocketBaseUrl();
    if (!baseUrl) return;

    let cancelled = false;
    let retryTimer = null;

    // Registers this device for OS-level push notifications (mainly for
    // incoming calls — see worker/index.js) so the user is alerted even
    // when the PWA is backgrounded or another app is in the foreground.
    // Runs once per browser session; safe to call repeatedly since it's a
    // no-op once a subscription already exists.
    const setupPushSubscription = async () => {
      if (pushSetupRef.current) return;
      if (cancelled) return;
      if (typeof window === "undefined" || !("Notification" in window)) {
        return;
      }

      // Permission pehle alag — Incognito mein SW/Push often fail, lekin
      // basic Notification API session ke liye kaam kar sakti hai.
      try {
        if (Notification.permission === "default") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") return;
        }
        if (Notification.permission !== "granted") return;
      } catch {
        return;
      }

      // Push + Service Worker (normal window / PWA). Incognito usually skips this.
      if (
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        return;
      }

      pushSetupRef.current = true;
      try {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          const res = await fetchVapidKey().unwrap();
          const publicKey = res?.data?.publicKey || res?.publicKey;
          if (!publicKey) return;
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });
        }

        const json = subscription.toJSON();
        await subscribePush({
          endpoint: json.endpoint,
          keys: json.keys,
        }).unwrap();
      } catch {
        // Incognito / private: SW & push often unsupported — ignore
        pushSetupRef.current = false;
      }
    };

    const connect = () => {
      if (cancelled) return;
      const token = Cookies.get("token");
      if (!token) {
        retryTimer = setTimeout(connect, 1500);
        return;
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const socket = io(baseUrl, {
        path: "/socket.io",
        transports: ["polling", "websocket"],
        upgrade: true,
        auth: { token },
        query: { token },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
        forceNew: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setConnected(true);
        listenersRef.current.forEach((handlers, event) => {
          handlers.forEach((h) => socket.on(event, h));
        });
        // Ask server who is already online (missed events before this socket joined)
        socket.emit("chat:presence:request");
        setupPushSubscription();
      });

      socket.on("disconnect", () => setConnected(false));

      socket.on("notification:new", (payload) => {
        unlockNotificationAudio();
        playNotificationSound();

        // OS toast only when this tab is in the background.
        // Foreground → in-app toast only (avoids Chrome+Edge+PWA duplicates).
        if (typeof document !== "undefined" && document.hidden) {
          showBrowserNotification(payload, {
            onClick: () => navigateFromPayload(payload),
          });
        }

        const notifCount = Number(payload?.count) || 1;
        const notifTitle =
          notifCount > 1 && payload?.title
            ? `${payload.title} · ${notifCount} new`
            : payload?.title || "New notification";
        const openPath = pathFromNotificationPayload(payload);

        toast.custom(
          (t) => (
            <div
              role={openPath ? "button" : undefined}
              tabIndex={openPath ? 0 : undefined}
              onClick={() => {
                if (!openPath) return;
                toast.dismiss(t.id);
                navigateFromPayload(payload);
              }}
              onKeyDown={(e) => {
                if (!openPath) return;
                if (e.key === "Enter" || e.key === " ") {
                  toast.dismiss(t.id);
                  navigateFromPayload(payload);
                }
              }}
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } relative max-w-sm w-full pointer-events-auto rounded-xl border border-white/10 bg-[#1a1a1e] py-3 pl-4 pr-10 shadow-xl ${
                openPath ? "cursor-pointer hover:border-white/20" : ""
              }`}
            >
              <button
                type="button"
                aria-label="Close notification"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.dismiss(t.id);
                }}
                className="absolute right-2 top-2 rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold text-white">{notifTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {payload?.message || ""}
              </p>
              {openPath && (
                <p className="mt-1.5 text-[10px] font-medium text-blue-400">
                  Click to open
                </p>
              )}
            </div>
          ),
          { duration: 4500, position: "bottom-center" }
        );
        invalidateTaskBoardTags(dispatch, payload?.projectId);
        if (payload?.type?.startsWith("CHAT") || payload?.conversationId) {
          dispatch(chatApi.util.invalidateTags(["ChatConversations"]));
        }
      });

      socket.on("task:deleted", (payload) => {
        invalidateTaskBoardTags(dispatch, payload?.projectId);
      });

      const applyPresence = (payload) => {
        if (!payload?.userId) return;
        const id = String(payload.userId);
        setPresenceMap((prev) => ({
          ...prev,
          [id]: {
            ...payload,
            userId: id,
            isOnline:
              payload.isOnline === true ||
              payload.status === "online" ||
              payload.status === "in_call" ||
              payload.status === "busy" ||
              payload.status === "recording",
          },
        }));
      };

      socket.on("chat:presence", applyPresence);

      socket.on("chat:presence:snapshot", (payload) => {
        const users = payload?.users || [];
        if (!users.length) return;
        setPresenceMap((prev) => {
          const next = { ...prev };
          users.forEach((u) => {
            if (!u?.userId) return;
            const id = String(u.userId);
            next[id] = {
              ...u,
              userId: id,
              isOnline: u.isOnline !== false,
              status: u.status || "online",
            };
          });
          return next;
        });
      });

      socket.on("chat:message:new", () => {
        dispatch(chatApi.util.invalidateTags(["ChatConversations"]));
      });

      socket.on("chat:conversation:new", () => {
        dispatch(chatApi.util.invalidateTags(["ChatConversations"]));
      });

      socket.on("chat:conversation:updated", () => {
        dispatch(chatApi.util.invalidateTags(["ChatConversations"]));
      });

      socket.on("chat:message:seen", () => {
        dispatch(chatApi.util.invalidateTags(["ChatConversations"]));
      });

      socket.on("chat:message:deleted", (payload) => {
        patchConversationsOnMessageDeleted(dispatch, payload);
        dispatch(chatApi.util.invalidateTags(["ChatConversations"]));
      });

      socket.on("chat:conversation:removed", () => {
        dispatch(chatApi.util.invalidateTags(["ChatConversations"]));
      });
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      const socket = socketRef.current;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch]);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      connected,
      emit,
      on,
      presenceMap,
      isUserOnline: (userId) => {
        if (!userId) return false;
        const p = presenceMap[String(userId)];
        return Boolean(
          p?.isOnline ||
            p?.status === "online" ||
            p?.status === "in_call" ||
            p?.status === "busy" ||
            p?.status === "recording"
        );
      },
      getPresence: (userId) =>
        userId ? presenceMap[String(userId)] || null : null,
    }),
    [connected, emit, on, presenceMap]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    return {
      socket: null,
      connected: false,
      emit: () => {},
      on: () => () => {},
      presenceMap: {},
      isUserOnline: () => false,
      getPresence: () => null,
    };
  }
  return ctx;
}

export default SocketProvider;
