"use client";

import { useState, useEffect } from "react";
import LeftNav from "../_Components/Layout/LeftNav";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  removeAttendence,
  resumeWork,
  setActivity,
  setAttendence,
} from "@/redux/filterSlice";
import BreakOverlay from "../_Components/break/BreakOverlay";
import {
  useBreakInMutation,
  useBreakOutMutation,
} from "../_Services/employee/page";
import toast from "react-hot-toast";
import {
  useGetLoggedUserQuery,
  useLogoutMutation,
} from "../_Services/authentication/page";
import { useTodayUserAttendenceQuery } from "../_Services/attendence/page";
import AnnouncementPopup from "../_Components/Modal/AnnouncementPopup";
import AnnouncementMarquee from "../_Components/Layout/AnnouncementMarquee";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const [logout] = useLogoutMutation();
  const [breakOut] = useBreakOutMutation();
  const [breakIn, { isLoading: isBreakLoading }] = useBreakInMutation();

  const {
    data,
    error: isError,
    isLoading,
    refetch,
  } = useTodayUserAttendenceQuery();

  const {
    data: loggedUser,
    error: isloggedError,
    isLoading: isLoggedLoading,
    refetch: isLoggedRefetch,
  } = useGetLoggedUserQuery();

  useEffect(() => {
    dispatch(setAttendence(data?.data));
    if (loggedUser?.data?.status === "de active") {
      handleLogout();
    } else if (loggedUser?.data?.activeBreak) {
      dispatch(
        setActivity({
          activityStatus: loggedUser?.data?.activityStatus,
          breakInTime: loggedUser?.data?.activeBreak?.breakIn,
          type: loggedUser?.data?.activeBreak?.type,
          reason: loggedUser?.data?.activeBreak?.reason,
        }),
      );
    }
  }, [loggedUser, data, dispatch]);

  const { activityStatus, breakInTime, attendence, type } = useSelector(
    (state) => state.filter,
  );
  console.log("loggedUser", loggedUser);

  const clearExtensionAndRedirect = (response) => {
    if (
      typeof window !== "undefined" &&
      window.chrome &&
      window.chrome.runtime
    ) {
      window.postMessage(
        {
          type: "LOGOUT",
        },
        "*",
      );

      router.push("/");
    } else {
      console.log("Chrome Extension API not found");
      // finalizeLogout(response.message);
      router.push("/");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout({ forceLogout: true }).unwrap();
      if (response.statusCode === 200) {
        toast.success("Logged out successfully");
        Cookies.remove("token", { path: "/" });
        Cookies.remove("currentuser", { path: "/" });
        clearExtensionAndRedirect();
        dispatch(resumeWork());
        dispatch(removeAttendence());
      }
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed");
    }
  };

  const handleBreakOut = async () => {
    try {
      const res = await breakOut({ attendanceId: attendence?._id }).unwrap();
      if (res.success) {
        console.log("breakOutResponse", res);
        dispatch(resumeWork());
        if (res.data?.mustLogout) {
          console.log("backend ne kaha logout kro");
          handleLogout();
        }
        toast.success(res?.message);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleBreakIn = async () => {
    try {
      const res = await breakIn({ attendanceId: attendence?._id }).unwrap();

      if (res.success) {
        dispatch(
          setActivity({
            activityStatus: res?.data?.activityStatus,
            breakInTime: res?.data?.breakRecord?.breakIn,
            type: "SYSTEM IDLE",
          }),
        );
      }
    } catch (err) {
      console.log("breakINError", err);
      toast.error(err?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsMobile(true);
      } else {
        setIsSidebarOpen(true);
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  useEffect(() => {
    const messageListener = (event) => {
      if (event.data && event.data.type === "STATUS_CHANGED") {
        console.log("REACT RECEIVED:", event.data);

        if (window.location.pathname === "/") {
          return;
        }
        console.log(
          "event.data.status, activityStatus,attendence?.timeIn",
          event.data.status,
          activityStatus,
          attendence?.timeIn,
        );

        if (
          event.data.status === "idle" &&
          activityStatus === "active"
          // attendence?.timeIn
        ) {
          console.log("extension ne kaha break in kro", activityStatus);

          handleBreakIn();
        } else if (event.data.status === "active") {
          handleBreakOut();
        }
      }
    };

    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, [dispatch, activityStatus, attendence]);


    const isOnBreak =
    loggedUser?.data?.activityStatus !== "active" &&
      // activityStatus !== "active"
    loggedUser?.data?.activeBreak?.type !== "OFFICIAL";
    
  if (isLoggedLoading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="app-container ">
      {isOnBreak 
       ? (
        <BreakOverlay startTime={breakInTime} onBreakOut={handleBreakOut} />
      ) : (
        <div
          //   style={{
          //   background: "#0f0f11",
          //   border: "1px solid rgba(255,255,255,0.07)",
          //   // boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          // }}
          className="min-h-screen bg-zinc-50 flex flex-col pt-14 md:pt-18"
        >
          <div className="flex flex-1 relative overflow-hidden">
            {isMobile && isSidebarOpen && (
              <div
                className="fixed inset-0 backdrop-blur-sm bg-black/20 z-20"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            <div
              className={`${
                isSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              } ${
                isMobile
                  ? "fixed top-0 left-0 h-full z-30 w-78 shadow-xl overflow-y-auto"
                  : "lg:relative lg:top-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-y-auto"
              } transition-transform duration-300 ease-in-out`}
            >
              <LeftNav />
            </div>

            <main
              className={`flex-1 overflow-y-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out px-1 
            ${isMobile ? "w-full" : ""}`}
            >
              <AnnouncementMarquee />
              <div className="w-full h-auto py-2">{children}</div>
            </main>
          </div>
        </div>
      )}
      <AnnouncementPopup />
    </div>
  );
};

export default DashboardLayout;
