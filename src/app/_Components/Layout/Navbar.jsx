"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import Main from "../../../app/Assets/zytronlogo.png";
import { X, Menu, Clock, Timer, Activity, CheckCircle } from "lucide-react";
import LeftNav from "./LeftNav";
import ActionButtons from "./NavbarActions";
import {
  useGetLoggedUserQuery,
  useLogoutMutation,
} from "@/app/_Services/authentication/page";
import toast from "react-hot-toast";
import {
  useTimeInMutation,
  useTimeOutMutation,
} from "@/app/_Services/attendence/page";
import { useBreakOutMutation } from "@/app/_Services/employee/page";

import {
  removeAttendence,
  resumeWork,
  setAttendence,
} from "@/redux/filterSlice";
import TimeOutModal from "../Modal/TimeOutModal";
import BreakTypeModal from "../Modal/BreakTypeModal";

const formatTime = (value) =>
  moment(value).tz("Asia/Karachi").format("hh:mm A");

const mobileWidthClass = (mobile) => (mobile ? "w-full" : "");

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  const { attendence } = useSelector((state) => state.filter);
  const {
    data: loggedUser,
    error: isloggedError,
    isLoading: isLoggedLoading,
    refetch: isLoggedRefetch,
  } = useGetLoggedUserQuery();

  const [workingTime, setWorkingTime] = useState("00:00:00");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isBreakOpen, setIsBreakOpen] = useState(false);

  const [logout] = useLogoutMutation();
  const [breakOut] = useBreakOutMutation();

  const [TimeIn, { isLoading: isTimeIn }] = useTimeInMutation();
  const [TimeOut, { isLoading: isTimeOut }] = useTimeOutMutation();

  useEffect(() => {
    let interval;
    if (attendence?.timeIn && !attendence?.timeOut) {
      interval = setInterval(() => {
        const now = moment().tz("Asia/Karachi");
        const start = moment(attendence.timeIn);
        const duration = moment.duration(now.diff(start));
        const hrs = Math.floor(duration.asHours()).toString().padStart(2, "0");
        const mins = duration.minutes().toString().padStart(2, "0");
        const secs = duration.seconds().toString().padStart(2, "0");
        setWorkingTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    } else {
      setWorkingTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [attendence]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleTimeIn = useCallback(async () => {
    try {
      const response = await TimeIn().unwrap();
      if (response.success) {
        dispatch(setAttendence(response.data));
        toast.success("Shift Started!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Time In failed");
    }
  }, [dispatch, TimeIn]);

  const clearExtensionAndRedirect = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.chrome &&
      window.chrome.runtime
    ) {
      window.postMessage({ type: "LOGOUT" }, "*");
    }
    router.push("/");
  }, [router]);

  const handleTimeOut = async () => {
    try {
      const response = await TimeOut().unwrap();
      if (response.success) {
        dispatch(setAttendence(response.data));
        dispatch(resumeWork());
        setConfirmDelete(false);
        clearExtensionAndRedirect();
        toast.success("Shift Ended!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Time Out failed");
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      const response = await logout().unwrap();
      if (response.statusCode === 200) {
        toast.success("Logged out successfully");
        Cookies.remove("token", { path: "/" });
        Cookies.remove("currentuser", { path: "/" });
        clearExtensionAndRedirect();
        dispatch(resumeWork());
        dispatch(removeAttendence());
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }, [dispatch, logout, clearExtensionAndRedirect]);

  const handleBreakOut = useCallback(async () => {
    try {
      const res = await breakOut({ shiftDate: attendence?.shiftDate }).unwrap();
      if (res.success) {
        dispatch(resumeWork());
        if (res.data?.mustLogout) {
          handleLogout();
        }
        toast.success(res?.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  }, [attendence?.shiftDate, breakOut, dispatch, handleLogout]);

  const AttendanceStatus = ({ mobile = false }) => {
    if (activeBreak?.type === "OFFICIAL") {
      const duration = activeBreak.breakIn
        ? moment().diff(moment(activeBreak.breakIn), "minutes")
        : 0;

      return (
        <div
          className={`flex flex-col md:flex-row md:items-center gap-3 rounded-xl px-4 py-1 bg-yellow-500/[0.07] border border-yellow-500/15 ${mobileWidthClass(
            mobile,
          )}`}
        >
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[9px] text-zinc-500 uppercase">Status</span>
              <span className="text-xs font-bold text-yellow-400 break-words">
                {`User on ${activeBreak.type.toLowerCase()} break`}
              </span>
            </div>

            <div className="hidden md:block w-px h-7 bg-white/[0.08]" />

            <div className="flex flex-col min-w-[80px]">
              <span className="text-[9px] text-zinc-500 uppercase">
                Break In
              </span>
              <span className="text-xs text-zinc-200">
                {formatTime(activeBreak.breakIn)}
              </span>
            </div>

            <div className="hidden md:block w-px h-7 bg-white/[0.08]" />

            <div className="flex flex-col min-w-[70px]">
              <span className="text-[9px] text-zinc-500 uppercase">
                Duration
              </span>
              <span className="text-xs font-mono text-white">
                {duration} min
              </span>
            </div>

            <div className="hidden md:block w-px h-7 bg-white/[0.08]" />

            <div className="flex flex-col flex-1 min-w-[120px]">
              <span className="text-[9px] text-zinc-500 uppercase">Reason</span>
              <span className="text-xs text-zinc-300 break-words">
                {activeBreak.reason || "-"}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (attendence?.timeIn && !attendence?.timeOut) {
      const statusClasses =
        attendence.status === "present"
          ? "bg-green-500/15 text-green-400 border-green-500/25"
          : "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";

      return (
        <div
          className={`flex items-center gap-4 rounded-xl px-4 py-2 bg-white/5 border border-white/[0.08] ${mobileWidthClass(mobile)}`}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="flex items-center gap-1 text-[9px] font-bold tracking-[0.12em] uppercase text-zinc-500">
              <Clock size={9} /> Time In
            </span>
            <span className="text-xs font-bold text-zinc-200">
              {formatTime(attendence.timeIn)}
            </span>
          </div>
          <div className="w-px h-7 bg-white/[0.08]" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="flex items-center gap-1 text-[9px] font-bold tracking-[0.12em] uppercase text-zinc-500">
              <Timer size={9} /> Working
            </span>
            <span className="text-xs font-mono font-black text-zinc-100">
              {workingTime}
            </span>
          </div>
          <div className="w-px h-7 bg-white/[0.08]" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="flex items-center gap-1 text-[9px] font-bold tracking-[0.12em] uppercase text-zinc-500">
              <Activity size={9} /> Status
            </span>
            <span
              className={`text-[9px] font-bold px-2 py-[2px] rounded-full uppercase border ${statusClasses}`}
            >
              {attendence.status}
            </span>
          </div>
        </div>
      );
    }

    if (attendence?.timeIn && attendence?.timeOut) {
      return (
        <div
          className={`flex items-center gap-2.5 rounded-xl px-4 py-2 bg-green-500/[0.07] border border-green-500/15 ${mobileWidthClass(mobile)}`}
        >
          <CheckCircle size={15} className="text-green-400 shrink-0" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-green-400">
              Shift Completed
            </p>
            <p className="text-[11px] text-zinc-500">Great work today!</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center gap-2.5 rounded-xl px-4 py-2 animate-pulse bg-red-500/[0.07] border border-red-500/[0.18] ${mobileWidthClass(mobile)}`}
      >
        <Clock size={15} className="text-red-400 shrink-0" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
            Attention Needed!
          </p>
          <p className="text-[11px] text-zinc-500">
            Please mark your attendance.
          </p>
        </div>
      </div>
    );
  };

  const activeBreak = loggedUser?.data?.activeBreak;
  const isOnBreak = Boolean(activeBreak);

  const closeBreakModal = useCallback(() => {
    setIsBreakOpen(false);
  }, []);

  const openBreakModal = useCallback(() => {
    setIsBreakOpen(true);
  }, []);

  const confirmTimeOut = useCallback(() => {
    setConfirmDelete(true);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0f0f11] border-b border-white/[0.07] ">
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white/20 to-white/5" />
        <nav className="flex items-center justify-between px-3 md:px-6 py-1 gap-3">
          <Link href="/dashboard/statistics" className="shrink-0">
            <Image src={Main} alt="Logo" height={48} width={130} priority />
          </Link>
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <AttendanceStatus />
          </div>
          <div className="hidden lg:flex items-center">
            <ActionButtons
              attendence={attendence}
              token={token}
              isTimeIn={isTimeIn}
              isTimeOut={isTimeOut}
              isOnBreak={isOnBreak}
              onTimeIn={handleTimeIn}
              onBreakOpen={openBreakModal}
              onBreakOut={handleBreakOut}
              onConfirmDelete={confirmTimeOut}
              onLogout={handleLogout}
            />
          </div>
          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.07] text-zinc-300 shadow-lg shadow-black/20 transition-all duration-150 cursor-pointer hover:bg-white/[0.12]"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={18} />
          </button>
        </nav>
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 bg-black/70 backdrop-blur-md ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-[70] h-full flex flex-col transition-transform duration-300 ease-in-out w-[min(330px,88vw)] rounded-r-[28px] bg-[#0d0d0f] border-r border-white/[0.08] shadow-[18px_0_60px_rgba(0,0,0,0.65)] ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[1.5px] w-full shrink-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="flex items-center justify-between px-4 py-4 shrink-0 border-b border-white/[0.06]">
          <Image src={Main} alt="Logo" width={110} height={36} />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-2xl cursor-pointer transition-all duration-150 bg-white/5 border border-white/[0.08] text-zinc-400 hover:bg-white/[0.09] hover:text-zinc-200"
          >
            <X size={15} />
          </button>
        </div>
        <div className="px-3 pt-3 shrink-0">
          <AttendanceStatus mobile />
        </div>
        <div className="px-3 pt-2 pb-2 shrink-0">
          <ActionButtons
            mobile
            attendence={attendence}
            token={token}
            isTimeIn={isTimeIn}
            isTimeOut={isTimeOut}
            isOnBreak={isOnBreak}
            onTimeIn={handleTimeIn}
            onBreakOpen={openBreakModal}
            onBreakOut={handleBreakOut}
            onConfirmDelete={confirmTimeOut}
            onLogout={handleLogout}
          />
        </div>
        <div className="mx-3 shrink-0 h-px bg-white/[0.06]" />
        <div className="flex-1 overflow-y-auto pt-2 overscroll-contain">
          <LeftNav set={() => setIsMenuOpen(false)} />
        </div>
      </div>

      {confirmDelete && (
        <TimeOutModal
          setConfirmDelete={setConfirmDelete}
          isDeleting={isTimeOut}
          handleDelete={handleTimeOut}
        />
      )}

      {isBreakOpen && (
        <BreakTypeModal isOpen={isBreakOpen} closeModal={closeBreakModal} />
      )}
    </>
  );
};

export default Navbar;
