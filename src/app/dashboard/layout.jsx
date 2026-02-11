"use client";

import { useState, useEffect } from "react";
import LeftNav from "../_Components/Dashboard/LeftNav";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resumeWork, setActivity } from "@/redux/filterSlice";
import BreakOverlay from "../_Components/break/BreakOverlay";
import {
  useBreakInMutation,
  useBreakOutMutation,
} from "../_Services/employee/page";
import toast from "react-hot-toast";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const [breakOut] = useBreakOutMutation();
  const [breakIn, { isLoading: isBreakLoading }] = useBreakInMutation();

  const dispatch = useDispatch();
  const { activityStatus, lastBreakInTime, attendence } = useSelector(
    (state) => state.filter,
  );

  const handleBreakOut = async () => {
    try {
      const res = await breakOut({ attendanceId: attendence?._id }).unwrap();
      if (res.success) {
        dispatch(resumeWork());
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
            lastBreakInTime: res?.data?.lastBreakInTime,
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

        if (
          event.data.status === "idle" &&
          activityStatus !== "idle" &&
          attendence?.timeIn
        ) {
          console.log("activityStatus", activityStatus);
          console.log("extension ne kaha break in kro");
          handleBreakIn();
        } else if (event.data.status === "active") {
          handleBreakOut();
        }
      }
    };

    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, [dispatch, activityStatus]);

  return (
    <div className="app-container">
      {activityStatus === "idle" ? (
        <BreakOverlay startTime={lastBreakInTime} onBreakOut={handleBreakOut} />
      ) : (
        <div className="min-h-screen bg-[#F8F9FC] flex flex-col pt-14 md:pt-20">
          <div className="flex flex-1 relative overflow-hidden">
            {/* Overlay for mobile when sidebar is open */}
            {isMobile && isSidebarOpen && (
              <div
                className="fixed inset-0 backdrop-blur-sm bg-black/20 z-20"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            {/* Sidebar - Fixed on desktop, overlay on mobile */}
            <div
              className={`${
                isSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              } ${
                isMobile
                  ? "fixed top-0 left-0 h-full z-30 w-78 shadow-xl overflow-y-auto"
                  : "lg:relative lg:w-52 xl:w-64 lg:sticky lg:top-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-y-auto"
              } transition-transform duration-300 ease-in-out`}
            >
              <LeftNav />
            </div>

            {/* Main Content - Scrollable */}
            <main
              className={`flex-1 overflow-y-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out px-2 md:px-2
            ${isMobile ? "w-full" : ""}`}
            >
              <div className="w-full bg-[#F8F9FC] h-auto py-2">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;