"use client";

import { useState, useEffect } from "react";
import LeftNav from "@/app/_Components/Layout/LeftNav";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { clearAuthCookies } from "@/app/_utils/authCookies";
import {
  removeAttendence,
  resumeWork,
  setActivity,
  setAttendence,
} from "@/redux/filterSlice";
import BreakOverlay from "@/app/_Components/break/BreakOverlay";
import {
  useBreakInMutation,
  useBreakOutMutation,
} from "@/app/_Services/employee/page";
import toast from "react-hot-toast";
import {
  useGetLoggedUserQuery,
  useLogoutMutation,
} from "@/app/_Services/authentication/page";
import { useTodayUserAttendenceQuery } from "@/app/_Services/attendence/page";
import AnnouncementPopup from "@/app/_Components/Modal/AnnouncementPopup";
import AnnouncementMarquee from "@/app/_Components/Layout/AnnouncementMarquee";
import Ip from "@/app/_Components/ip";
import Navbar from "@/app/_Components/Layout/Navbar";
import Footer from "@/app/_Components/Layout/Footer";
import SocketProvider from "@/app/_Components/Socket/SocketProvider";
import { CallProvider } from "@/app/_Components/chat/CallContext";
import CallOverlay from "@/app/_Components/chat/CallOverlay";
import RoutePermissionGuard from "@/app/_Components/Layout/RoutePermissionGuard";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const isChatRoute = pathname?.startsWith("/dashboard/chat");
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
        clearAuthCookies();
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
      const res = await breakOut({shiftDate:attendence?.shiftDate }).unwrap();
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
      const res = await breakIn({ shiftDate: attendence?.shiftDate }).unwrap();

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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isloggedError) {
    const loggedErrorMessage =
      isloggedError?.data?.message ||
      isloggedError?.error ||
      isloggedError?.status ||
      "Unable to load current user. Please refresh the page.";

    return (
    <Ip loggedErrorMessage={loggedErrorMessage} />
    );
  }
  return (
    <SocketProvider>
    <CallProvider>
    <div className="theme-zyro-dark bg-ink app-container">
      <CallOverlay />
      {isOnBreak 
       ? (
        <BreakOverlay startTime={breakInTime} onBreakOut={handleBreakOut} />
      ) : (
        <>
        <Navbar />
        <div
          className={
            isChatRoute
              ? "flex h-dvh flex-col overflow-hidden pt-14"
              : "flex min-h-screen flex-col pt-14"
          }
        >
          <div
            className={
              isChatRoute
                ? "relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
                : "relative flex min-w-0 flex-1"
            }
          >
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
                  ? `fixed top-0 left-0 h-full z-30 w-78 overflow-y-auto ${
                      isSidebarOpen
                        ? "shadow-xl"
                        : "shadow-none pointer-events-none invisible"
                    }`
                  : "lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto shrink-0 self-start"
              } transition-transform duration-300 ease-in-out`}
              aria-hidden={isMobile && !isSidebarOpen ? true : undefined}
            >
              <LeftNav />
            </div>

            <main
              className={`flex min-w-0 flex-1 flex-col px-2 transition-all duration-300 ease-in-out ${
                isMobile ? "w-full" : ""
              } ${
                isChatRoute
                  ? "min-h-0 overflow-hidden"
                  : ""
              }`}
            >
              {!isChatRoute ? <AnnouncementMarquee /> : null}
              <div
                className={`w-full min-h-0 min-w-0 flex-1 ${
                  isChatRoute ? "flex flex-col overflow-hidden pt-1" : "pt-1"
                }`}
              >
                <RoutePermissionGuard>{children}</RoutePermissionGuard>
              </div>
            </main>
          </div>
        </div>
        {!isChatRoute ? <Footer /> : null}
        </>
      )}
      <AnnouncementPopup />
    </div>
    </CallProvider>
    </SocketProvider>
  );
};

export default DashboardLayout;
