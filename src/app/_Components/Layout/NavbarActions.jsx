"use client";

import { memo } from "react";
import { Clock, PowerOff, LogOut } from "lucide-react";

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
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

const buttonClass = (mobile, colorClasses) =>
  `cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${colorClasses} ${mobile ? "w-full" : ""}`;

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
}) => (
  <div className={`flex ${mobile ? "flex-col w-full" : "items-center"} gap-2`}>
    {!attendence?.timeIn ? (
      <button
        onClick={onTimeIn}
        disabled={isTimeIn}
        className={buttonClass(
          mobile,
          "bg-green-500/[0.12] border border-green-500/25 text-green-400 hover:bg-green-500/20"
        )}
      >
        {isTimeIn ? (
          <Spinner />
        ) : (
          <>
            <Clock size={14} />
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
              mobile,
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
              mobile,
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
            mobile,
            "bg-red-500/10 border border-red-500/[0.22] text-red-400 hover:bg-red-500/[0.18]"
          )}
        >
          {isTimeOut ? (
            <Spinner />
          ) : (
            <>
              <PowerOff size={14} />
              <span>Time Out</span>
            </>
          )}
        </button>
      </>
    ) : (
      <span
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase bg-white/5 border border-white/[0.08] text-zinc-500 ${
          mobile ? "text-center" : ""
        }`}
      >
        Shift Over
      </span>
    )}

    {token && (
      <button
        onClick={onLogout}
        className={buttonClass(
          mobile,
          "bg-white/5 border border-white/[0.08] text-zinc-400 hover:bg-white/[0.09] hover:text-zinc-200"
        )}
      >
        <LogOut size={14} />
        <span>Log Out</span>
      </button>
    )}
  </div>
);

export default memo(ActionButtons);
