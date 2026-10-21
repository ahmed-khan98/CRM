"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import JobForm from "@/app/_Components/recruitment/JobForm";
import { useCreateRecruitmentJobMutation } from "@/app/_Services/recruitment/page";

export default function NewJobPage() {
  const router = useRouter();
  const [create, { isLoading }] = useCreateRecruitmentJobMutation();

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader icon={Briefcase} length={0} name="New job" />
      <JobForm
        submitting={isLoading}
        onSubmit={async (body) => {
          try {
            const res = await create(body).unwrap();
            toast.success("Job created");
            router.push(`/dashboard/recruitment/jobs/${res.data._id}`);
          } catch (e) {
            toast.error(e?.data?.message || "Failed to create");
          }
        }}
      />
    </div>
  );
}
