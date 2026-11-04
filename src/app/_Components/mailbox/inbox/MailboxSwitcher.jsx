"use client";

import { useMemo } from "react";
import CrmSelect from "@/app/_Components/ui/CrmSelect";

export default function MailboxSwitcher({
  grouped = [],
  value,
  onChange,
  disabled,
}) {
  const options = useMemo(() => {
    const brandOpts = [];
    const companyOpts = [];
    for (const g of grouped) {
      const isPersonal = g.kind === "personal" || g.brandId === "personal";
      for (const m of g.mailboxes || []) {
        const personal = m.kind === "personal" || isPersonal;
        const opt = {
          value: String(m._id),
          label: personal
            ? `Company (internal) · ${m.emailAddress}`
            : `${g.brandName || "Brand"} · ${m.emailAddress}`,
        };
        if (personal) companyOpts.push(opt);
        else brandOpts.push(opt);
      }
    }
    return [...brandOpts, ...companyOpts];
  }, [grouped]);

  return (
    <div className="min-w-[220px] max-w-full flex-1 sm:flex-none sm:w-[280px]">
      <CrmSelect
        variant="dark"
        isSearchable
        isDisabled={disabled}
        options={options}
        value={value || ""}
        onChange={onChange}
        placeholder="Select mailbox…"
      />
    </div>
  );
}
