"use client";

import PageHeader from "@/app/_Components/PageHeader/page";

/**
 * Thin alias — always uses the shared compact PageHeader white shell.
 * Prefer PageHeader directly for new pages.
 */
export default function AttendenceHeader({
  icon,
  name,
  title,
  length,
  count,
  metaLabel,
  children,
  actions,
  btnName,
  handleEdit,
}) {
  return (
    <PageHeader
      icon={icon}
      name={name ?? title}
      length={length ?? count}
      metaLabel={metaLabel}
      btnName={btnName}
      handleEdit={handleEdit}
      actions={actions}
    >
      {children}
    </PageHeader>
  );
}
