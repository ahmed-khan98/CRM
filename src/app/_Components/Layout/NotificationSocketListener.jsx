"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  playNotificationSound,
  unlockNotificationAudio,
} from "@/app/_utils/notificationSound";
import { invalidateTaskBoardTags } from "@/app/_utils/invalidateTaskBoard";

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

  // Absolute API URL → strip /api/v1/user (with or without trailing slash)
  try {
    if (/^https?:\/\//i.test(api)) {
      const u = new URL(api);
      u.pathname = u.pathname.replace(/\/api\/v1\/user\/?$/i, "").replace(/\/$/, "") || "/";
      u.search = "";
      u.hash = "";
      const originPath =
        u.pathname === "/" ? u.origin : `${u.origin}${u.pathname}`.replace(/\/$/, "");
      return originPath;
    }
  } catch {
    /* fall through */
  }

  // Relative /api/... → same origin (only works if Next proxies socket — usually not)
  return "";
};

/**
 * Keeps a live Socket.IO connection for in-app notifications.
 * Mount once inside the authenticated dashboard layout.
 */
export default function NotificationSocketListener() {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  // Unlock audio on first user gesture (required by browsers)
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
    if (!baseUrl) {
      console.warn(
        "[notifications] Socket URL missing. Set NEXT_PUBLIC_SOCKET_URL or NEXT_PUBLIC_API_URL."
      );
      return;
    }

    let cancelled = false;
    let retryTimer = null;

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
        // Prefer polling first — more reliable behind Railway / proxies
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
        console.log("[notifications] socket connected", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.warn("[notifications] socket connect_error:", err?.message || err);
      });

      socket.on("notification:new", (payload) => {
        unlockNotificationAudio();
        playNotificationSound();

        // Chat notifications get collapsed server-side (one row per
        // conversation instead of one per message) — reflect that count
        // here instead of implying this is a single, brand-new message.
        const count = Number(payload?.count) || 1;
        const title =
          count > 1 && payload?.title
            ? `${payload.title} · ${count} new`
            : payload?.title || "New notification";

        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-sm w-full pointer-events-auto rounded-xl border border-white/10 bg-[#1a1a1e] px-4 py-3 shadow-xl`}
            >
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {payload?.message || ""}
              </p>
            </div>
          ),
          { duration: 4500, position: "bottom-center" }
        );

        invalidateTaskBoardTags(dispatch, payload?.projectId);
      });

      socket.on("task:deleted", (payload) => {
        invalidateTaskBoardTags(dispatch, payload?.projectId);
      });
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      const socket = socketRef.current;
      if (socket) {
        socket.off("notification:new");
        socket.off("task:deleted");
        socket.off("connect");
        socket.off("connect_error");
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch]);

  return null;
}
