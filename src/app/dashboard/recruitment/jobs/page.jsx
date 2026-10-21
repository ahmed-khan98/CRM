"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, Pause, Play, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import AttendenceHeader from "@/app/_Components/attendence/MyAttendance/AttendenceHeader";
import { fleet } from "@/app/_Components/fleet/fleetTheme";
import {
  useGetRecruitmentJobsQuery,
  useSetRecruitmentJobStatusMutation,
  useDeleteRecruitmentJobMutation,
} from "@/app/_Services/recruitment/page";
import {
  JOB_STATUSES,
  formatJobType,
  formatWorkMode,
  jobStatusTone,
  recField,
} from "@/app/_Components/recruitment/recruitmentUi";
import StatusBadge from "@/app/_Components/ui/saas/StatusBadge";
import CrmSelect from "@/app/_Components/ui/CrmSelect";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import Tooltip from "@/app/_Components/ui/Tooltip";
import { useDebouncedValue } from "@/app/hooks/useDebouncedValue";

export default function RecruitmentJobsPage() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);
  const [status, setStatus] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const params = useMemo(
    () => ({
      q: debouncedQ.trim() || undefined,
      status: status || undefined,
      limit: 50,
    }),
    [debouncedQ, status]
  );
  const { data, isFetching } = useGetRecruitmentJobsQuery(params);
  const [setStatusMut] = useSetRecruitmentJobStatusMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteRecruitmentJobMutation();
  const items = data?.data?.items || [];

  const handleDelete = async () => {
    if (!confirmDelete?._id) return;
    try {
      await remove(confirmDelete._id).unwrap();
      toast.success("Job deleted");
      setConfirmDelete(null);
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  const onStatus = async (id, next) => {
    try {
      await setStatusMut({ id, status: next }).unwrap();
      toast.success(`Marked ${next}`);
    } catch (e) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  return (
    <div className="section-stack min-h-0 overflow-auto pb-8">
      <AttendenceHeader icon={Briefcase} length={items.length} name="Jobs">
        <Link href="/dashboard/recruitment/jobs/new" className={fleet.primaryBtn}>
          <Plus className="h-4 w-4" />
          New job
        </Link>
      </AttendenceHeader>

      <div className="flex flex-wrap items-center gap-2">
        <input
          className={`${recField} max-w-xs`}
          placeholder="Search jobs…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="min-w-[180px]">
          <CrmSelect
            options={[{ value: "", label: "All statuses" }, ...JOB_STATUSES]}
            value={status}
            onChange={(v) => setStatus(v || "")}
            placeholder="All statuses"
            isClearable
          />
        </div>
      </div>

      <div className={`${fleet.card} overflow-hidden`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Applicants</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && !items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Loading…
                </td>
              </tr>
            ) : !items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No jobs yet. Create your first opening.
                </td>
              </tr>
            ) : (
              items.map((job) => (
                <tr key={job._id} className="border-b border-zinc-100">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/recruitment/jobs/${job._id}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-zinc-400">
                      {job.departmentId?.name || "—"} · {formatWorkMode(job.workMode)}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {job.location || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-900">
                    {formatJobType(job.jobType)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={jobStatusTone(job.status)} label={job.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/recruitment/jobs/${job._id}/applicants`}
                      className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 hover:underline"
                    >
                      <Users className="h-3.5 w-3.5 opacity-70" />
                      {job.applicantCount || 0}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Tooltip label="View applicants" side="top">
                        <Link
                          href={`/dashboard/recruitment/jobs/${job._id}/applicants`}
                          className={fleet.secondaryBtn}
                        >
                          <Users className="h-4 w-4" />
                          <span className="hidden sm:inline">Applicants</span>
                        </Link>
                      </Tooltip>
                      {job.status === "published" ? (
                        <Tooltip label="Pause" side="top">
                          <button
                            type="button"
                            className={fleet.secondaryBtn}
                            onClick={() => onStatus(job._id, "paused")}
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      ) : job.status !== "closed" ? (
                        <Tooltip label="Publish" side="top">
                          <button
                            type="button"
                            className={fleet.secondaryBtn}
                            onClick={() => onStatus(job._id, "published")}
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      ) : null}
                      <Tooltip label="Delete" side="top">
                        <button
                          type="button"
                          className={fleet.secondaryBtn}
                          onClick={() => setConfirmDelete(job)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <WarningModal
          setConfirmDelete={setConfirmDelete}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
          title="Delete job"
          description={`Do you really want to delete “${confirmDelete.title}”? This cannot be undone.`}
          confirmLabel="Yes, Delete"
          message="job"
        />
      )}
    </div>
  );
}
