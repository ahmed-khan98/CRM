"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import { Bell } from "lucide-react";
import {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/app/_Services/notification/page";
import { unlockNotificationAudio } from "@/app/_utils/notificationSound";

const OPEN_TASK_KEY = "crm:openTaskFromNotification";

const getId = (value) => {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  const id = value._id ?? value.id;
  return id ? String(id) : null;
};

export const readPendingOpenTask = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(OPEN_TASK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearPendingOpenTask = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(OPEN_TASK_KEY);
  } catch {
    /* ignore */
  }
};

const NotificationBell = ({ mobile = false }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const { data: countRes } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 120000,
  });
  const { data: listRes, isFetching } = useGetMyNotificationsQuery(30, {
    skip: !open,
    pollingInterval: open ? 60000 : 0,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: markingAll }] =
    useMarkAllNotificationsReadMutation();

  const unreadCount = countRes?.data?.count || 0;
  const notifications = listRes?.data || [];

  useEffect(() => {
    if (!open) return;
    const onPointerDownOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    // pointerdown outside — item uses onClick so navigation isn't cancelled
    document.addEventListener("pointerdown", onPointerDownOutside);
    return () => document.removeEventListener("pointerdown", onPointerDownOutside);
  }, [open]);

  const handleOpen = useCallback(() => {
    unlockNotificationAudio();
    setOpen((prev) => !prev);
  }, []);

  const handleMarkAll = useCallback(async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      /* ignore */
    }
  }, [markAllRead]);

  const handleClickItem = useCallback(
    (n, e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      setOpen(false);

      const projectId = getId(n.projectId);
      const taskId = getId(n.taskId);
      const isStatusNotify = n?.type === "TASK_STATUS";
      const openModal = Boolean(taskId && !isStatusNotify);

      if (!n?.isRead) {
        markRead(n._id).catch(() => {});
      }

      if (!projectId) return;

      // Persist intent so project page can open modal even if ?task= is lost
      try {
        sessionStorage.setItem(
          OPEN_TASK_KEY,
          JSON.stringify({
            projectId,
            taskId: openModal ? taskId : null,
            openModal,
            at: Date.now(),
          })
        );
      } catch {
        /* ignore */
      }

      const href = openModal
        ? `/dashboard/projects/${projectId}?task=${taskId}`
        : `/dashboard/projects/${projectId}`;

      router.push(href);
    },
    [markRead, router]
  );

  return (
    <div className={`relative ${mobile ? "w-full" : ""}`} ref={panelRef}>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className={`relative flex items-center justify-center rounded-xl transition-all duration-150 bg-white/5 border border-white/[0.08] text-zinc-300 hover:bg-white/[0.09] hover:text-white ${
          mobile ? "w-full gap-2 px-4 py-2 text-sm font-bold" : "h-9 w-9"
        }`}
      >
        <Bell size={16} />
        {mobile && <span>Notifications</span>}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute z-[80] mt-2 rounded-2xl border border-white/[0.1] bg-[#141416] shadow-2xl overflow-hidden ${
            mobile
              ? "left-0 right-0 w-full"
              : "right-0 w-[340px]"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <p className="text-sm font-semibold text-white">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={markingAll}
                className="text-[11px] font-medium text-zinc-400 hover:text-white disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[280px] overflow-y-auto custom-scrollbar-dark overscroll-contain">
            {isFetching && !notifications.length ? (
              <p className="px-4 py-8 text-center text-xs text-zinc-500">
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-zinc-500">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={(e) => handleClickItem(n, e)}
                  className={`w-full text-left px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.04] transition-colors ${
                    !n.isRead ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && (
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    )}
                    <div className={!n.isRead ? "" : "pl-3.5"}>
                      <p className="text-xs font-semibold text-zinc-100">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        {moment(n.createdAt)
                          .tz("Asia/Karachi")
                          .fromNow()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
