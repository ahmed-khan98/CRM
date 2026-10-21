"use client";

import StatusBadge from "@/app/_Components/ui/saas/StatusBadge";

export default function PayrollStatusBadge({ status }) {
  return <StatusBadge status={status || "draft"} />;
}
