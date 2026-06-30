"use client";

import { useGetLeadByIdQuery } from "@/app/_Services/lead/page";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  Clock,
  Tag,
  Users,
  X,
  CheckCircle,
  Eye,
  DollarSign,
} from "lucide-react";
import { formatDate } from "../../utilities/date";
import { getActionStatusColor, getStatusColor } from "../../utilities/color";
import LeadSentEmail from "../LeadSentEmail/LeadSentEmail";
import Comment from "./Comment";
import InfoItem from "./InfoItem";
import AssignmentItem from "./AssignmentItem";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

const getAgentName = (userId) => {
  switch (userId) {
    case "68bf1147113f9f0ce3cb0de3":
      return "Junaid Khan (Agent)";
    default:
      return "System/Unknown";
  }
};

const LeadDetail = ({ id }) => {
  const { data, error, isLoading } = useGetLeadByIdQuery({ id });
  const [showAllComments, setShowAllComments] = useState(false);

  const commentsToShow = useMemo(() => {
    const leadComments = data?.data?.leadComment || [];
    return showAllComments ? leadComments : leadComments.slice(0, 3);
  }, [showAllComments, data?.data?.leadComment]);

  const totalComments = data?.data?.leadComment?.length || 0;
  const lastCommentArray = data?.data?.leadComment;
  const hasComments =
    Array.isArray(lastCommentArray) && lastCommentArray.length > 0;

  let displayLastAction, displayActionDate, displayScheduleDate;

  if (hasComments) {
    const lastComment = lastCommentArray[0];
    displayLastAction = lastComment.lastAction;
    displayActionDate = lastComment.createdAt;
    displayScheduleDate = lastComment.scheduleDate || "";
  } else {
    displayLastAction = data?.data?.lastAction;
    displayActionDate = data?.data?.lastActionDate;
    displayScheduleDate = data?.data?.scheduleDate || "";
  }

  if (isLoading)
    return (
      <PageLoader
        title="Loading lead details"
        subtitle="Fetching lead activity and comments..."
      />
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-400 bg-[#0f0f13] min-h-screen font-sans">
        Error fetching data.
      </div>
    );

  if (!data)
    return (
      <div className="p-10 text-center text-white/50 bg-[#0f0f13] min-h-screen font-sans">
        No Lead Found.
      </div>
    );

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background:
          "linear-gradient(135deg, #0f0f13 0%, #13111c 60%, #0f1117 100%)",
      }}
    >
      {/* Top gradient line */}
      <div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
        }}
      />

      <div className="p-5 sm:p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center gap-3"
        >
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: "linear-gradient(180deg, #6366f1, #a855f7)" }}
          />
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-purple-400 uppercase mb-0.5">
              Lead Detail
            </p>
            <h1 className="text-xl font-bold text-white capitalize">
              {data?.data?.name || "N/A"}
            </h1>
          </div>
        </motion.header>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left / Main */}
          <section className="lg:col-span-2 space-y-5">
            {/* Lead Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl p-[1px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.15), rgba(30,30,46,0))",
              }}
            >
              <div
                className="rounded-2xl p-7"
                style={{
                  background: "rgba(18,17,28,0.95)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-base font-bold text-white">
                    Lead Overview
                  </span>
                  <div
                    className="flex-1 h-px ml-2"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(99,102,241,0.4), transparent)",
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                  {/* Contact Info */}
                  <div className="space-y-5">
                    <InfoItem
                      icon={Mail}
                      label="Email"
                      value={data?.data?.email}
                      link={`mailto:${data?.data?.email}`}
                    />
                    <InfoItem
                      icon={Phone}
                      label="Phone No"
                      value={data?.data?.phoneNo}
                      link={`tel:${data?.data?.phoneNo}`}
                    />
                    <InfoItem
                      icon={Tag}
                      label="Serial No"
                      value={data?.data?.serialNo || "N/A"}
                    />
                  </div>

                  {/* Status Info */}
                  <div className="space-y-5">
                    <InfoItem
                      icon={Tag}
                      label="Brand Mark"
                      value={data?.data?.brandMark || "N/A"}
                    />
                    <InfoItem
                      icon={Calendar}
                      label="Signup Date"
                      value={formatDate(data?.data?.signupDate || "")}
                    />

                    <div className="space-y-2 flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "rgba(99,102,241,0.12)",
                          border: "1px solid rgba(99,102,241,0.2)",
                        }}
                      >
                        <DollarSign
                          className="w-3.5 h-3.5"
                          style={{ color: "#818cf8" }}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.15em] text-white/40 uppercase pb-1">
                          Payment Status
                        </p>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ring-1 ${getStatusColor(data?.data?.paidStatus)}`}
                        >
                          {data?.data?.paidStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Assignment Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl p-[1px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1), rgba(30,30,46,0))",
              }}
            >
              <div
                className="rounded-2xl p-7"
                style={{
                  background: "rgba(18,17,28,0.95)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-base font-bold text-white">
                    Assignment Details
                  </span>
                  <div
                    className="flex-1 h-px ml-2"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(99,102,241,0.4), transparent)",
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                  <AssignmentItem
                    icon={User}
                    label="Agent"
                    value={data?.data?.agent?.fullName}
                  />
                  <AssignmentItem
                    icon={Briefcase}
                    label="Brand"
                    value={
                      data?.data?.brandId?.name || data?.data?.brandId || "N/A"
                    }
                  />
                  <AssignmentItem
                    icon={Briefcase}
                    label="Department"
                    value={data?.data?.departmentId?.name || "N/A"}
                  />
                </div>
              </div>
            </motion.div>
          </section>

          {/* Right / Activity */}
          <section className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-2xl p-[1px] overflow-hidden h-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(99,102,241,0.1), rgba(30,30,46,0))",
              }}
            >
              <div
                className="rounded-2xl p-5 h-full"
                style={{
                  background: "rgba(18,17,28,0.95)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-base font-bold text-white">
                    Activity
                  </span>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(168,85,247,0.15)",
                      color: "#c084fc",
                      border: "1px solid rgba(168,85,247,0.3)",
                    }}
                  >
                    {totalComments}
                  </span>
                </div>

                <div
                  className="relative border-l-2 ml-1 space-y-3"
                  style={{ borderColor: "rgba(99,102,241,0.2)" }}
                >
                  {commentsToShow?.map((comment) => (
                    <Comment
                      key={comment?._id}
                      id={comment?._id}
                      lastComment={comment?.lastComment}
                      lastAction={comment?.lastAction}
                      username={comment?.userId?.fullName}
                      createdAt={
                        comment?.createdAt || comment?.createdAtAt || ""
                      }
                    />
                  ))}

                  {totalComments > 3 && (
                    <div className="pt-2 pl-6">
                      <button
                        onClick={() => setShowAllComments(!showAllComments)}
                        className="cursor-pointer text-xs font-bold transition-all duration-200"
                        style={{ color: "#a78bfa" }}
                        onMouseEnter={(e) => (e.target.style.color = "#c4b5fd")}
                        onMouseLeave={(e) => (e.target.style.color = "#a78bfa")}
                      >
                        {showAllComments
                          ? "↑ See Less"
                          : `↓ See More (${totalComments - 3} hidden)`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </section>
        </div>

        <LeadSentEmail id={data?.data?._id} />
      </div>
    </div>
  );
};

export default LeadDetail;
