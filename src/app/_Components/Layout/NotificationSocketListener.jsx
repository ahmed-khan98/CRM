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
    return process.env.NEXT_PUBLIC_SOCKET_URL.replace(/\/$/, "");
  }
  const api = (process.env.NEXT_PUBLIC_API_URL || "").replace(/^['"]|['"]$/g, "");
  return api.replace(/\/api\/v1\/user\/?$/i, "").replace(/\/$/, "") || "";
};

/**
 * Keeps a live Socket.IO connection for in-app notifications.
 * Mount once inside the authenticated dashboard layout.
 */
export default function NotificationSocketListener() {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  // Keep trying to unlock audio until the first successful user gesture
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
    const token = Cookies.get("token");
    const baseUrl = getSocketBaseUrl();
    if (!token || !baseUrl) return;

    const socket = io(baseUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
    });

    socketRef.current = socket;

    socket.on("notification:new", (payload) => {
      unlockNotificationAudio();
      playNotificationSound();

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-sm w-full pointer-events-auto rounded-xl border border-white/10 bg-[#1a1a1e] px-4 py-3 shadow-xl`}
          >
            <p className="text-sm font-semibold text-white">
              {payload?.title || "New notification"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {payload?.message || ""}
            </p>
          </div>
        ),
        { duration: 4500, position: "bottom-center" }
      );

      // Refresh notifications + task board (assign / status / comment)
      invalidateTaskBoardTags(dispatch, payload?.projectId);
    });

    socket.on("task:deleted", (payload) => {
      invalidateTaskBoardTags(dispatch, payload?.projectId);
    });

    return () => {
      socket.off("notification:new");
      socket.off("task:deleted");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch]);

  return null;
}
