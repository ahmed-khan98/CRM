"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import JobForm from "@/app/_Components/recruitment/JobForm";
import {
  useGetRecruitmentJobQuery,
  useUpdateRecruitmentJobMutation,
} from "@/app/_Services/recruitment/page";

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isFetching } = useGetRecruitmentJobQuery(id);
  const [update, { isLoading }] = useUpdateRecruitmentJobMutation();
  const job = data?.data;

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader icon={Briefcase} length={job?.applicantCount || 0} name={job?.title || "Job"}>
        <Link
          href={`/dashboard/recruitment/jobs/${id}/applicants`}
          className={fleet.secondaryBtn}
        >
          Applicants
        </Link>
        {job?.slug && (
          <a
            href={`/careers/${job.slug}`}
            target="_blank"
            rel="noreferrer"
            className={fleet.secondaryBtn}
          >
            Careers page
          </a>
        )}
      </AttendenceHeader>
      {isFetching && !job ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : (
        <JobForm
          initial={job}
          submitting={isLoading}
          onSubmit={async (body) => {
            try {
              await update({ id, body }).unwrap();
              toast.success("Saved");
              router.refresh();
            } catch (e) {
              toast.error(e?.data?.message || "Failed");
            }
          }}
        />
      )}
    </div>
  );
}
