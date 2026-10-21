"use client";

import { memo } from "react";
import Header from "./Header/page";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Compact SaaS page header — white bar, ~52–56px tall.
 * Props: icon, name|title, length|count, metaLabel, btnName, handleEdit, children/actions
 */
const PageHeader = ({
  icon,
  name,
  title,
  length,
  count,
  btnName,
  handleEdit,
  children,
  actions,
  metaLabel,
}) => {
  const heading = name ?? title;
  const recordCount = length ?? count;
  const right = children ?? actions;

  return (
    <div className="header-surface">
      <div className="min-w-0 shrink-0">
        <Header
          icon={icon}
          length={recordCount}
          name={heading}
          metaLabel={metaLabel}
        />
      </div>

      {right ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
          {right}
        </div>
      ) : null}

      {btnName ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => handleEdit?.()}
          className="zyro-accent-btn inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-ink px-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          <span className="max-w-[9rem] truncate sm:max-w-none">{btnName}</span>
        </motion.button>
      ) : null}
    </div>
  );
};

export default memo(PageHeader);
