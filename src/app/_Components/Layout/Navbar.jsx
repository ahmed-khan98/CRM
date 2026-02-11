// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import Main from "../../../app/Assets/logo-ppi.png";
// import { Search, X, Menu } from "lucide-react";
// import LeftNav from "../Dashboard/LeftNav";
// import { useLogoutMutation } from "@/app/_Services/authentication/page";

// import toast from "react-hot-toast";
// import {
//   useTimeInMutation,
//   useTimeOutMutation,
// } from "@/app/_Services/attendence/page";
// import { setAttendence } from "@/redux/filterSlice";

// const Navbar = () => {
//   const router = useRouter();
//   const token = Cookies.get("token");

//   const { attendence } = useSelector((state) => state.filter);
// console.log(attendence,'attendence')
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

//   const [logout, { isLoading: isSubmitting }] = useLogoutMutation();
//   const [TimeIn, { isLoading: isTimeIn }] = useTimeInMutation();
//   const [TimeOut, { isLoading: isTimeOut }] = useTimeOutMutation();

//   const clearExtensionAndRedirect = (response) => {
//     if (
//       typeof window !== "undefined" &&
//       window.chrome &&
//       window.chrome.runtime
//     ) {
//       window.chrome.runtime.sendMessage(
//         "ipmkoccmjmjepnnepibolhakgijemoed",
//         { type: "LOGOUT" },
//         (res) => {
//           console.log("SUCCESS! Extension replied:", res);
//           // finalizeLogout(response.message);
//           router.push("/");
//         },
//       );
//     } else {
//       console.log("Chrome Extension API not found");
//       // finalizeLogout(response.message);
//       router.push("/");
//     }
//   };

//   const finalizeLogout = (msg) => {
//     console.log("Finalizing Logout - Removing Cookies...");
//     Cookies.remove("token", { path: "/" });
//     Cookies.remove("currentuser", { path: "/" });
//     toast.success(msg);
//     clearExtensionAndRedirect();
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await logout().unwrap();
//       console.log(response, "response");
//       if (response.statusCode === 200) {
//         finalizeLogout(response?.message);
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Logout failed");
//     }
//   };

//   const handleTimeIn = async () => {
//     try {
//       const response = await TimeIn().unwrap();
//       console.log(response, "attedence");
//       if (response.statusCode === 200) {
//         toast.success(response?.message);
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Logout failed");
//     }
//   };

//   const renderAuthButtons = () => (
//     <>
//       <button
//         onClick={() => (attendence?.shiftDate ? dispatch(setAttendence(data?.data)) : handleTimeIn())}
//         className={`cursor-pointer py-2 px-3 rounded text-white text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity ${
//           token ? "bg-[#5f2781]" : "bg-[#a945fc]"
//         }`}
//       >
//         {isTimeIn || isTimeOut ? (
//           <div className="flex items-center">
//             <div className="h-5 w-5 border-1 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//             loading...
//           </div>
//         ) : attendence?.shiftDate ? (
//           "Time Out"
//         ) : (
//           "Time In"
//         )}
//       </button>

//       {token && (
//         <button
//           onClick={() => {
//             setIsMenuOpen(!isMenuOpen);
//             router.push("/dashboard/dashboardcount");
//           }}
//           className="cursor-pointer py-2 px-3 bg-[#5f2781] text-white rounded text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity"
//         >
//           Dashboard
//         </button>
//       )}
//     </>
//   );

//   return (
//     <>
//       {/* Main Navbar */}
//       <div className="bg-white border-b border-[#DDDDDD7D] fixed top-0 left-0 w-full z-50">
//         <nav className="container  md:px-10 px-2 py-1 flex justify-between items-center">
//           <Link href="/dashboard/dashboardcount" className="w-60">
//             <Image src={Main || "/placeholder.svg"} alt="Logo" height={60} />
//           </Link>

//           {/* Mobile Controls */}
//           <div className="lg:hidden flex items-center space-x-2">
//             <button
//               className="p-1 text-[#5f2781]"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               aria-label="Toggle Menu"
//             >
//               <Menu size={30} />
//             </button>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden lg:flex items-center space-x-4 text-black">
//             {renderAuthButtons()}
//           </div>
//         </nav>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`fixed inset-0 z-50 backdrop-blur-sm bg-black/20 transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
//       >
//         <nav className="fixed top-0 left-0 h-full w-80 bg-white p-3 shadow-md">
//           <div className="flex justify-between items-center mb-[#5f2781]">
//             <Link href="/dashboard/dashboardcount">
//               <Image
//                 src={Main || "/placeholder.svg"}
//                 alt="Logo"
//                 width={100}
//                 height={30}
//               />
//             </Link>

//             <button
//               className="text-gray-500 hover:text-gray-700 transition-colors"
//               onClick={() => setIsMenuOpen(false)}
//               aria-label="Close Menu"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {token ? (
//             <LeftNav set={() => setIsMenuOpen(false)} />
//           ) : (
//             <div className="flex flex-col gap-3 mt-6">
//               {renderAuthButtons()}
//             </div>
//           )}
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Navbar;

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import Main from "../../../app/Assets/logo-ppi.png";
import { X, Menu, Clock, Timer, Activity } from "lucide-react";
import LeftNav from "../Dashboard/LeftNav";
import { useLogoutMutation } from "@/app/_Services/authentication/page";
import toast from "react-hot-toast";
import {
  useTimeInMutation,
  useTimeOutMutation,
  useTodayUserAttendenceQuery,
} from "@/app/_Services/attendence/page";
import {
  removeAttendence,
  resumeWork,
  setAttendence,
} from "@/redux/filterSlice";
import TimeOutModal from "../Modal/TimeOutModal";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  const { attendence } = useSelector((state) => state.filter);
  const [workingTime, setWorkingTime] = useState("00:00:00");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [logout] = useLogoutMutation();
  const [TimeIn, { isLoading: isTimeIn }] = useTimeInMutation();
  const [TimeOut, { isLoading: isTimeOut }] = useTimeOutMutation();

  const {
    data,
    error: isError,
    isLoading,
    refetch,
  } = useTodayUserAttendenceQuery();

  useEffect(() => {
    dispatch(setAttendence(data?.data));
  }, [data]);

  useEffect(() => {
    let interval;
    // Agar timeIn hai aur timeOut abhi tak nahi hua (active shift)
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

  const handleTimeIn = async () => {
    try {
      const response = await TimeIn().unwrap();
      if (response.success) {
        dispatch(setAttendence(response.data));
        toast.success("Shift Started!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Time In failed");
    }
  };

  const clearExtensionAndRedirect = (response) => {
    if (
      typeof window !== "undefined" &&
      window.chrome &&
      window.chrome.runtime
    ) {
      window.chrome.runtime.sendMessage(
        "ipmkoccmjmjepnnepibolhakgijemoed",
        { type: "LOGOUT" },
        (res) => {
          console.log("SUCCESS! Extension replied:", res);
          // finalizeLogout(response.message);
          router.push("/");
        },
      );
    } else {
      console.log("Chrome Extension API not found");
      // finalizeLogout(response.message);
      router.push("/");
    }
  };

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

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      if (response.statusCode === 200) {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error?.message);
      console.error("Logout API failed:", error);
    } finally {
      router.push("/");
      Cookies.remove("token");
      Cookies.remove("currentuser");
      dispatch(resumeWork());
      dispatch(removeAttendence());
    }
  };

  const renderAuthButtons = () => (
    <div className="flex items-center gap-3">
      {/* Dynamic Button: Time In / Time Out */}
      {!attendence?.timeIn ? (
        <button
          onClick={handleTimeIn}
          disabled={isTimeIn}
          className="cursor-pointer  flex items-center gap-2 bg-green-500 hover:bg-green-600 shadow-green-100 text-white px-4 py-2 rounded-md text-sm font-bold transition-all disabled:opacity-50"
        >
          {isTimeIn ? "..." : "Time In"}
        </button>
      ) : !attendence?.timeOut ? (
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={isTimeOut}
          className="cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 shadow-red-100 text-white px-4 py-2 rounded-md text-sm font-bold transition-all disabled:opacity-50"
        >
          {isTimeOut ? "..." : "Time Out"}
        </button>
      ) : (
        <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm font-bold">
          Shift Over
        </span>
      )}

      {token && (
        <button
          onClick={handleLogout}
          className="cursor-pointer bg-[#5f2781] shadow-purple-100 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-all"
        >
          Logout
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white border-b border-[#DDDDDD7D] fixed top-0 left-0 w-full z-50">
        <nav className="container mx-auto md:px-10 px-4 py-1 flex justify-between items-center">
          <Link href="/dashboard/dashboardcount" className="shrink-0">
            <Image src={Main} alt="Logo" height={50} width={150} priority />
          </Link>

          {/* --- LIVE ATTENDANCE INFO PANEL --- */}
          {attendence?.timeIn && !attendence?.timeOut ? (
            // Jab user Timed In ho (Puraana wala Panel)
            <div className="hidden lg:flex items-center space-x-8 bg-gray-50 border border-gray-100 px-6 py-1.5 rounded-full shadow-sm">
              <div className="flex flex-col items-center border-r pr-6 border-gray-200">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <Clock size={12} /> Time In
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {moment(attendence.timeIn)
                    .tz("Asia/Karachi")
                    .format("hh:mm A")}
                </span>
              </div>

              <div className="flex flex-col items-center border-r pr-6 border-gray-200">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <Timer size={12} /> Working Time
                </div>
                <span className="text-sm font-mono font-black text-[#5f2781]">
                  {workingTime}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <Activity size={12} /> Status
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white uppercase ${attendence.status === "present" ? "bg-green-500" : "bg-gradient-to-br from-yellow-400 to-yellow-500"}`}
                >
                  {attendence.status}
                </span>
              </div>
            </div>
          ) : (
            // --- JAB TIME IN NAHI KIYA (USER NOTIFICATION) ---
            <div className="hidden lg:flex items-center gap-3 bg-red-50 border border-red-100 px-5 py-2 rounded-lg animate-pulse">
              <div className="bg-red-500 p-1.5 rounded-full text-white">
                <Clock size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-red-600 uppercase tracking-tight">
                  Attention Needed!
                </span>
                <span className="text-[13px] font-medium text-gray-700">
                  Please mark your attendance to start the shift.
                </span>
              </div>
            </div>
          )}

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {renderAuthButtons()}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="lg:hidden text-[#5f2781]"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"} lg:hidden`}
      >
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <Image src={Main} alt="Logo" width={100} height={40} />
            <X
              className="cursor-pointer text-gray-500"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>

          {/* Mobile Drawer Content */}
          <div className="p-4 space-y-4">
            {attendence?.timeIn && !attendence?.timeOut ? (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    Working Time
                  </span>
                  <span className="text-sm font-mono font-black text-[#5f2781]">
                    {workingTime}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    Time In
                  </span>
                  <span className="text-xs font-bold text-gray-700">
                    {moment(attendence.timeIn)
                      .tz("Asia/Karachi")
                      .format("hh:mm A")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    Status
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase ${attendence.status === "present" ? "bg-green-500" : "bg-orange-500"}`}
                  >
                    {attendence.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-3 rounded-xl border border-red-200 flex flex-col items-center text-center animate-pulse gap-2">
                <div className="bg-red-500 p-2 rounded-full text-white">
                  <Clock size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-red-600 uppercase">
                    Attendance Missing
                  </span>
                  <span className="text-[12px] text-gray-700 leading-tight">
                    Please mark your attendance to avoid salary deductions.
                  </span>
                </div>
              </div>
            )}

            {/* Time In / Out Button */}
            <div className="mt-4">{renderAuthButtons()}</div>

            <div className="pt-2 border-t">
              <LeftNav set={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      </div>
      {confirmDelete && (
        <TimeOutModal
          setConfirmDelete={setConfirmDelete}
          isDeleting={isTimeOut}
          handleDelete={handleTimeOut}
        />
      )}
    </>
  );
};

export default Navbar;
