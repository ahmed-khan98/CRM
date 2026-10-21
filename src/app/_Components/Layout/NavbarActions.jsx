"use client";

import { memo } from "react";
import { Clock, PowerOff, Coffee } from "lucide-react";

const Spinner = ({ size = "h-3.5 w-3.5" }) => (
  <svg
    className={`animate-spin ${size}`}
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

const buttonClass = (colorClasses) =>
  `cursor-pointer flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium leading-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed h-7 ${colorClasses}`;

const mobileButtonClass = (colorClasses) =>
  `w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] ${colorClasses}`;

const ActionButtons = ({
  mobile = false,
  attendence,
  isTimeIn,
  isTimeOut,
  isOnBreak,
  onTimeIn,
  onBreakOpen,
  onBreakOut,
  onConfirmDelete,
}) => {
  if (mobile) {
    return (
      <div className="flex w-full flex-col gap-2">
        {!attendence?.timeIn ? (
          <button
            onClick={onTimeIn}
            disabled={isTimeIn}
            className={mobileButtonClass(
              "bg-success/[0.12] border border-emerald-200 text-green-400 hover:bg-emerald-600/20"
            )}
          >
            {isTimeIn ? (
              <Spinner size="h-4 w-4" />
            ) : (
              <>
                <Clock size={15} />
                <span>Time In</span>
              </>
            )}
          </button>
        ) : !attendence?.timeOut ? (
          <div className="grid grid-cols-2 gap-2">
            {!isOnBreak ? (
              <button
                type="button"
                onClick={onBreakOpen}
                className={mobileButtonClass(
                  "bg-warning/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-warning/20"
                )}
              >
                <Coffee size={14} />
                <span>Break In</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onBreakOut}
                className={mobileButtonClass(
                  "bg-warning/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-warning/20"
                )}
              >
                <Coffee size={14} />
                <span>Break Out</span>
              </button>
            )}
            <button
              onClick={onConfirmDelete}
              disabled={isTimeOut}
              className={mobileButtonClass(
                "bg-danger/10 border border-danger/[0.22] text-rose-600 hover:bg-danger/[0.18]"
              )}
            >
              {isTimeOut ? (
                <Spinner size="h-4 w-4" />
              ) : (
                <>
                  <PowerOff size={14} />
                  <span>Time Out</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="w-full rounded-xl border border-white/[0.08] bg-white/5 px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
            Shift Over
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {!attendence?.timeIn ? (
        <button
          onClick={onTimeIn}
          disabled={isTimeIn}
          className={buttonClass(
            "bg-success/[0.12] border border-emerald-200 text-green-400 hover:bg-emerald-600/20"
          )}
        >
          {isTimeIn ? (
            <Spinner />
          ) : (
            <>
              <Clock size={12} />
              <span>Time In</span>
            </>
          )}
        </button>
      ) : !attendence?.timeOut ? (
        <>
          {!isOnBreak ? (
            <button
              type="button"
              onClick={onBreakOpen}
              className={buttonClass(
                "bg-warning/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-warning/20"
              )}
            >
              Break In
            </button>
          ) : (
            <button
              type="button"
              onClick={onBreakOut}
              className={buttonClass(
                "bg-warning/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-warning/20"
              )}
            >
              Break Out
            </button>
          )}
          <button
            onClick={onConfirmDelete}
            disabled={isTimeOut}
            className={buttonClass(
              "bg-danger/10 border border-danger/[0.22] text-rose-600 hover:bg-danger/[0.18]"
            )}
          >
            {isTimeOut ? (
              <Spinner />
            ) : (
              <>
                <PowerOff size={12} />
                <span>Time Out</span>
              </>
            )}
          </button>
        </>
      ) : (
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium uppercase leading-none h-7 inline-flex items-center bg-white/5 border border-white/[0.08] text-zinc-500">
          Shift Over
        </span>
      )}
    </div>
  );
};

export default memo(ActionButtons);
