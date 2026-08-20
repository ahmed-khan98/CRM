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
import { useDispatch } from "react-redux";
import {
  playNotificationSound,
  unlockNotificationAudio,
} from "@/app/_utils/notificationSound";
import { invalidateTaskBoardTags } from "@/app/_utils/invalidateTaskBoard";
import {
  chatApi,
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
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [presenceMap, setPresenceMap] = useState({});
  const listenersRef = useRef(new Map());
  const pushSetupRef = useRef(false);
  const [fetchVapidKey] = useLazyGetPushVapidKeyQuery();
  const [subscribePush] = useSubscribePushMutation();

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
    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, unlock, { capture: true })
      );
    };
  }, []);

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
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        return;
      }
      pushSetupRef.current = true;
      try {
        if (Notification.permission === "default") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") return;
        }
        if (Notification.permission !== "granted") return;

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
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted" &&
          document.hidden
        ) {
          try {
            new Notification(payload?.title || "Notification", {
              body: payload?.message || "",
              icon: "/favicon.ico",
            });
          } catch {
            /* ignore */
          }
        }
        const notifCount = Number(payload?.count) || 1;
        const notifTitle =
          notifCount > 1 && payload?.title
            ? `${payload.title} · ${notifCount} new`
            : payload?.title || "New notification";
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-sm w-full pointer-events-auto rounded-xl border border-white/10 bg-[#1a1a1e] px-4 py-3 shadow-xl`}
            >
              <p className="text-sm font-semibold text-white">{notifTitle}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {payload?.message || ""}
              </p>
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
