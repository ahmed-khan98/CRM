"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

  return "";
};

const getId = (value) => {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  const id = value._id ?? value.id;
  return id ? String(id) : null;
};

/**
 * Keeps a live Socket.IO connection for in-app notifications.
 * Mount once inside the authenticated dashboard layout.
 */
export default function NotificationSocketListener() {
  const dispatch = useDispatch();
  const router = useRouter();
  const socketRef = useRef(null);
  const routerRef = useRef(router);
  routerRef.current = router;

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

        const count = Number(payload?.count) || 1;
        const title =
          count > 1 && payload?.title
            ? `${payload.title} · ${count} new`
            : payload?.title || "New notification";

        const leadId = getId(payload?.leadId);
        const conversationId = getId(payload?.conversationId);
        const isLeadSchedule =
          payload?.type === "LEAD_SCHEDULE" ||
          String(payload?.title || "")
            .toLowerCase()
            .includes("lead follow-up");
        const isChatNotify = [
          "CHAT_MESSAGE",
          "CHAT_MENTION",
          "CHAT_GROUP",
          "MISSED_CALL",
          "INCOMING_CALL",
        ].includes(payload?.type);
        const canOpen =
          (isLeadSchedule && leadId) || (isChatNotify && conversationId);

        toast.custom(
          (t) => (
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                if (isLeadSchedule && leadId) {
                  routerRef.current.push(`/dashboard/lead/detail/${leadId}`);
                  return;
                }
                if (isChatNotify && conversationId) {
                  routerRef.current.push(
                    `/dashboard/chat?conversation=${conversationId}`,
                  );
                }
              }}
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-sm w-full pointer-events-auto rounded-xl border border-white/10 bg-[#1a1a1e] px-4 py-3 shadow-xl text-left ${
                canOpen
                  ? "cursor-pointer hover:border-white/20"
                  : "cursor-default"
              }`}
            >
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {payload?.message || ""}
              </p>
              {canOpen && (
                <p className="mt-1.5 text-[10px] font-medium text-blue-400">
                  {isChatNotify ? "Click to open chat" : "Click to open lead"}
                </p>
              )}
            </button>
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
