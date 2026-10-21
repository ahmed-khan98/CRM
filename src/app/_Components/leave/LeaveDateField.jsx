"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { formatLeaveDate } from "./leaveUi";

const CAL_WIDTH = 280;

export default function LeaveDateField({
  value,
  onChange,
  placeholder = "Select date",
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => (value ? moment(value) : moment()));
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnWrapRef = useRef(null);
  const calRef = useRef(null);

  useEffect(() => {
    if (value) setCursor(moment(value));
  }, [value]);

  const place = () => {
    const el = btnWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 12;
    let left = rect.left;
    if (left + CAL_WIDTH > window.innerWidth - margin) {
      left = rect.right - CAL_WIDTH;
    }
    if (left < margin) left = margin;
    setPos({ top: rect.bottom + 6, left });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onMove = () => place();
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [open]);

  useEffect(() => {
    const onAway = (e) => {
      if (btnWrapRef.current?.contains(e.target) || calRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onAway);
    return () => document.removeEventListener("mousedown", onAway);
  }, []);

  const cells = useMemo(() => {
    const start = cursor.clone().startOf("month").startOf("week");
    const end = cursor.clone().endOf("month").endOf("week");
    const days = [];
    const current = start.clone();
    while (current.isSameOrBefore(end, "day")) {
      days.push(current.clone());
      current.add(1, "day");
    }
    return days;
  }, [cursor]);

  return (
    <div className="relative" ref={btnWrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 text-left text-zinc-100 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50 ${
          compact
            ? "h-[38px] px-2.5 text-xs"
            : "h-[42px] px-3 text-sm"
        }`}
      >
        <span className={`truncate ${value ? "font-semibold text-zinc-100" : "text-zinc-500"}`}>
          {value ? formatLeaveDate(value) : placeholder}
        </span>
        <CalendarDays className={`shrink-0 text-zinc-500 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
      </button>

      {open &&
        createPortal(
          <div
            ref={calRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: CAL_WIDTH, zIndex: 120 }}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                className="rounded-lg p-1 text-zinc-300 hover:bg-zinc-800"
                onClick={() => setCursor((c) => c.clone().subtract(1, "month"))}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-100">
                {cursor.format("MMMM YYYY")}
              </p>
              <button
                type="button"
                className="rounded-lg p-1 text-zinc-300 hover:bg-zinc-800"
                onClick={() => setCursor((c) => c.clone().add(1, "month"))}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-widest text-zinc-500">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day) => {
                const key = day.format("YYYY-MM-DD");
                const inMonth = day.month() === cursor.month();
                const selected = value === key;
                const weekend = day.day() === 0 || day.day() === 6;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    className={`h-8 rounded-lg text-xs font-medium ${
                      selected
                        ? "bg-zinc-100 text-zinc-900"
                        : inMonth
                          ? weekend
                            ? "text-zinc-500 hover:bg-zinc-800"
                            : "text-zinc-200 hover:bg-zinc-800"
                          : "text-zinc-600"
                    }`}
                  >
                    {day.date()}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
