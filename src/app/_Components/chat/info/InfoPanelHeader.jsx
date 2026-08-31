"use client";

import { memo } from "react";
import { X } from "lucide-react";

function InfoPanelHeader({ theme, isGroup, onClose }) {
  return (
    <div className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${theme.header}`}>
      <p className="font-semibold">{isGroup ? "Group info" : "Contact info"}</p>
      <button type="button" aria-label="Close info" onClick={onClose}>
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default memo(InfoPanelHeader);
