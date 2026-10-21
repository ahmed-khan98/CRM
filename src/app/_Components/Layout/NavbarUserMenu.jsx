"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ChevronDown,
  Clock,
  Coffee,
  LogOut,
  PowerOff,
  UserRound,
} from "lucide-react";

function initialsFromName(name = "") {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function readCookieUser() {
  try {
    return JSON.parse(Cookies.get("currentuser") || "{}") || {};
  } catch {
    return {};
  }
}

const Spinner = ({ className = "h-3.5 w-3.5" }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

function MenuAction({
  icon: Icon,
  label,
  onClick,
  tone = "default",
  disabled = false,
  loading = false,
}) {
  const tones = {
    default: "text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100",
    success: "text-emerald-400 hover:bg-emerald-500/10",
    warning: "text-yellow-400 hover:bg-yellow-500/10",
    danger: "text-rose-400 hover:bg-rose-500/10",
  };
  const iconBg = {
    default: "bg-white/[0.05] text-zinc-400",
    success: "bg-emerald-500/10 text-emerald-400",
    warning: "bg-yellow-500/10 text-yellow-400",
    danger: "bg-rose-500/10 text-rose-400",
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg[tone]}`}
      >
        {loading ? <Spinner /> : <Icon size={14} />}
      </span>
      {label}
    </button>
  );
}

/**
 * Navbar account menu — avatar + name; attendance + profile actions in dropdown.
 */
export default function NavbarUserMenu({
  user: userProp,
  onLogout,
  mobile = false,
  attendence,
  isOnBreak = false,
  isTimeIn = false,
  isTimeOut = false,
  onTimeIn,
  onBreakOpen,
  onBreakOut,
  onConfirmDelete,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const user = useMemo(() => {
    const fromApi = userProp || {};
    const fromCookie = readCookieUser();
    return {
      fullName: fromApi.fullName || fromCookie.fullName || "",
      email: fromApi.email || fromCookie.email || "",
      image: fromApi.image || fromCookie.image || "",
    };
  }, [userProp]);

  const initials = initialsFromName(user.fullName) || "?";
  const hasTimeIn = Boolean(attendence?.timeIn);
  const hasTimeOut = Boolean(attendence?.timeOut);
  const shiftActive = hasTimeIn && !hasTimeOut;

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const Avatar = ({ size = "h-8 w-8", text = "text-[11px]" }) => (
    <span
      className={`${size} shrink-0 overflow-hidden rounded-full border border-white/10 bg-zinc-800 ring-1 ring-white/[0.06] flex items-center justify-center`}
    >
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt={user.fullName || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={`${text} font-semibold text-zinc-300`}>{initials}</span>
      )}
    </span>
  );

  const attendanceActions = (
    <div className="space-y-0.5 p-1.5">
      {!hasTimeIn ? (
        <MenuAction
          icon={Clock}
          label="Time In"
          tone="success"
          loading={isTimeIn}
          onClick={() => {
            close();
            onTimeIn?.();
          }}
        />
      ) : null}

      {shiftActive ? (
        <>
          {!isOnBreak ? (
            <MenuAction
              icon={Coffee}
              label="Break In"
              tone="warning"
              onClick={() => {
                close();
                onBreakOpen?.();
              }}
            />
          ) : (
            <MenuAction
              icon={Coffee}
              label="Break Out"
              tone="warning"
              onClick={() => {
                close();
                onBreakOut?.();
              }}
            />
          )}
          <MenuAction
            icon={PowerOff}
            label="Time Out"
            tone="danger"
            loading={isTimeOut}
            onClick={() => {
              close();
              onConfirmDelete?.();
            }}
          />
        </>
      ) : null}

      {hasTimeIn && hasTimeOut ? (
        <div className="px-2.5 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Shift over
        </div>
      ) : null}
    </div>
  );

  const menuItems = (
    <>
      <div className="border-b border-white/[0.06] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar size="h-10 w-10" text="text-sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-zinc-100">
              {user.fullName || "Account"}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {user.email || "—"}
            </p>
          </div>
        </div>
      </div>

      {attendanceActions}

      <div className="border-t border-white/[0.06] p-1.5">
        <Link
          href="/dashboard/profile"
          onClick={close}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-zinc-100"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] text-zinc-400">
            <UserRound size={14} />
          </span>
          My profile
        </Link>
      </div>

      <div className="border-t border-white/[0.06] p-1.5">
        <MenuAction
          icon={LogOut}
          label="Log out"
          tone="danger"
          onClick={() => {
            close();
            onLogout?.();
          }}
        />
      </div>
    </>
  );

  if (mobile) {
    return (
      <div
        ref={rootRef}
        className="w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.04]"
          aria-expanded={open}
        >
          <Avatar size="h-9 w-9" text="text-xs" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold capitalize text-zinc-100">
              {user.fullName || "Account"}
            </p>
          </div>
          <ChevronDown
            size={14}
            className={`shrink-0 text-zinc-500 transition ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && <div className="border-t border-white/[0.06]">{menuItems}</div>}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex h-10 max-w-[220px] items-center gap-2.5 rounded-xl border px-1.5 pr-2.5 transition ${
          open
            ? "border-white/15 bg-white/[0.08]"
            : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]"
        }`}
      >
        <Avatar size="h-9 w-9" text="text-xs" />
        <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold capitalize leading-none text-zinc-100">
          {user.fullName || "Account"}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-zinc-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-[80] w-64 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0c0c0c] shadow-2xl shadow-black/50"
        >
          {menuItems}
        </div>
      )}
    </div>
  );
}
