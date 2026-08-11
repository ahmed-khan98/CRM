"use client";

import { memo } from "react";
import { Clock, PowerOff, LogOut, Coffee } from "lucide-react";

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
  `cursor-pointer flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold leading-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed h-7 ${colorClasses}`;

const mobileButtonClass = (colorClasses) =>
  `w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] ${colorClasses}`;

const ActionButtons = ({
  mobile = false,
  attendence,
  token,
  isTimeIn,
  isTimeOut,
  isOnBreak,
  onTimeIn,
  onBreakOpen,
  onBreakOut,
  onConfirmDelete,
  onLogout,
}) => {
  if (mobile) {
    return (
      <div className="flex w-full flex-col gap-2">
        {!attendence?.timeIn ? (
          <button
            onClick={onTimeIn}
            disabled={isTimeIn}
            className={mobileButtonClass(
              "bg-green-500/[0.12] border border-green-500/25 text-green-400 hover:bg-green-500/20"
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
                  "bg-yellow-500/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/20"
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
                  "bg-yellow-500/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/20"
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
                "bg-red-500/10 border border-red-500/[0.22] text-red-400 hover:bg-red-500/[0.18]"
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
          <div className="w-full rounded-xl border border-white/[0.08] bg-white/5 px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            Shift Over
          </div>
        )}

        {token && (
          <button
            onClick={onLogout}
            className={mobileButtonClass(
              "bg-white/[0.04] border border-white/[0.07] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
            )}
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
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
            "bg-green-500/[0.12] border border-green-500/25 text-green-400 hover:bg-green-500/20"
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
                "bg-yellow-500/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/20"
              )}
            >
              Break In
            </button>
          ) : (
            <button
              type="button"
              onClick={onBreakOut}
              className={buttonClass(
                "bg-yellow-500/[0.12] border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/20"
              )}
            >
              Break Out
            </button>
          )}
          <button
            onClick={onConfirmDelete}
            disabled={isTimeOut}
            className={buttonClass(
              "bg-red-500/10 border border-red-500/[0.22] text-red-400 hover:bg-red-500/[0.18]"
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
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase leading-none h-7 inline-flex items-center bg-white/5 border border-white/[0.08] text-zinc-500">
          Shift Over
        </span>
      )}

      {token && (
        <button
          onClick={onLogout}
          className={buttonClass(
            "bg-white/5 border border-white/[0.08] text-zinc-400 hover:bg-white/[0.09] hover:text-zinc-200"
          )}
        >
          <LogOut size={12} />
          <span>Log Out</span>
        </button>
      )}
    </div>
  );
};

export default memo(ActionButtons);
