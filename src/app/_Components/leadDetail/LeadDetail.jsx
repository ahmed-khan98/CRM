"use client";

import { useGetLeadByIdQuery } from "@/app/_Services/lead/page";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  Tag,
  DollarSign,
} from "lucide-react";
import { formatDate } from "../../utilities/date";
import { getStatusColor } from "../../utilities/color";
import LeadSentEmail from "../LeadSentEmail/LeadSentEmail";
import LeadActivityTimeline from "./LeadActivityTimeline";
import InfoItem from "./InfoItem";
import AssignmentItem from "./AssignmentItem";
import PageLoader from "@/app/_Components/Loaders/PageLoader";

const card =
  "rounded-2xl border border-zinc-800 bg-[#161616] p-5 sm:p-7";

const LeadDetail = ({ id }) => {
  const { data, error, isLoading } = useGetLeadByIdQuery({ id });
  const [showAllComments, setShowAllComments] = useState(false);

  const allComments = data?.data?.leadComment || [];
  const commentsToShow = showAllComments ? allComments : allComments.slice(0, 10);
  const totalComments = allComments.length;

  if (isLoading)
    return (
      <PageLoader
        title="Loading lead details"
        subtitle="Fetching lead activity and comments..."
      />
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#050505] p-10 text-center font-sans text-rose-400">
        Error fetching data.
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-[#050505] p-10 text-center font-sans text-zinc-500">
        No Lead Found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-zinc-100">
      <div className="p-5 sm:p-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="h-8 w-1 rounded-full bg-zinc-500" />
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Lead Detail
            </p>
            <h1 className="text-lg font-semibold capitalize text-white">
              {data?.data?.name || "N/A"}
            </h1>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <section className="space-y-5 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className={card}
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="text-base font-semibold text-white">
                  Lead Overview
                </span>
                <div className="ml-2 h-px flex-1 bg-zinc-800" />
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-sm sm:grid-cols-2">
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

                  <div className="flex items-start gap-3 space-y-2">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
                      <DollarSign className="h-3.5 w-3.5 text-zinc-300" />
                    </div>
                    <div>
                      <p className="pb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                        Payment Status
                      </p>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium uppercase ${getStatusColor(data?.data?.paidStatus)}`}
                      >
                        {data?.data?.paidStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className={card}
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="text-base font-semibold text-white">
                  Assignment Details
                </span>
                <div className="ml-2 h-px flex-1 bg-zinc-800" />
              </div>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
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
            </motion.div>
          </section>

          <section className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className={`${card} h-full`}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-base font-semibold text-white">
                  Activity
                </span>
                <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                  {totalComments}
                </span>
              </div>

              <div className="relative ml-1 space-y-3 border-l-2 border-zinc-800">
                <LeadActivityTimeline
                  leadId={data?.data?._id}
                  comments={commentsToShow}
                />

                {totalComments > 10 && (
                  <div className="pt-2 pl-6">
                    <button
                      type="button"
                      onClick={() => setShowAllComments(!showAllComments)}
                      className="cursor-pointer text-xs font-medium text-zinc-400 transition hover:text-zinc-200"
                    >
                      {showAllComments
                        ? "↑ See Less"
                        : `↓ See More (${totalComments - 10} hidden)`}
                    </button>
                  </div>
                )}
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
