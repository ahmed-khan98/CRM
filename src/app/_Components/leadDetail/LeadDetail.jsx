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
} from "lucide-react";
import { formatDate } from "../../utilities/date";
import { getActionStatusColor, getStatusColor } from "../../utilities/color";
import LeadSentEmail from "../LeadSentEmail/LeadSentEmail";
import Comment from "./Comment";
import InfoItem from "./InfoItem";
import AssignmentItem from "./AssignmentItem";

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

  let displayLastAction;
  let displayActionDate;
  let displayScheduleDate;

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#5f2781] font-semibold">
          Loading ... 🚀
        </span>
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-600">Error fetching data.</div>
    );
  if (!data)
    return <div className="p-10 text-center text-gray-600">No Lead Found.</div>;

  return (
    <div className="p-6 sm:p-6 font-sans text-gray-900">
      <header className="mb-4 border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 capitalize">
          Lead Detail: {data?.data?.name || "N/A"}
        </h1>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-indigo-200/50 transition duration-300 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Lead Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8 text-sm">
              {/* Contact Info */}
              <div className="space-y-6">
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-gray-500  uppercase tracking-wider">
                    Last Action
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ring-1 ${getActionStatusColor(
                      displayLastAction // <-- Use calculated variable
                    )}`}
                  >
                    {displayLastAction === "schedule"
                      ? `Schedule on ${formatDate(displayScheduleDate)}` // Use displayScheduleDate
                      : displayLastAction?.charAt(0).toUpperCase() +
                          displayLastAction?.slice(1) || "NO ACTION"}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-500 uppercase tracking-wider pt-3">
                    Action Date
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {formatDate(displayActionDate || "")}{" "}
                  </p>
                </div>
              </div>

              {/* Payment & Brand Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-500  uppercase tracking-wider">
                    Payment Status
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ring-1 ${getStatusColor(
                      data?.data?.paidStatus
                    )}`}
                  >
                    {data?.data?.paidStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-500  uppercase tracking-wider pt-3">
                    Brand Mark
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {data?.data?.brandMark || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-indigo-200/50 transition duration-300 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Assignment Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <AssignmentItem
                icon={User}
                label="Agent"
                value={data?.data?.userId?.userName}
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
                value={
                  data?.data?.departmentId?.name ||
                  data?.data?.departmentId ||
                  "N/A"
                }
              />
            </div>
          </div>
        </section>

        <section className="lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-indigo-200/50 transition duration-300 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Activity & Comments ({totalComments})
            </h2>

            <div className="relative border-l border-gray-200 ml-1 space-y-3">
              {commentsToShow?.map((comment) => (
                <Comment
                  id={comment?._id}
                  lastComment={comment?.lastComment}
                  lastAction={comment?.lastAction}
                  username={comment?.userId?.fullName}
                  createdAt={comment?.createdAt || comment?.createdAtAt || ""}
                />
              ))}

              {/* See More / See Less Button */}
              {totalComments > 3 && (
                <div className="pt-2 pl-6">
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="cursor-pointer text-xs font-semibold text-[#5f2781] hover:text-indigo-800 transition duration-150"
                  >
                    {showAllComments
                      ? "See Less"
                      : `See More (${totalComments - 3} hidden)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <LeadSentEmail id={data?.data?._id} />
    </div>
  );
};

export default LeadDetail;
