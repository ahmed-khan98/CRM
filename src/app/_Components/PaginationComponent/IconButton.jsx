"use client";

import Tooltip from "@/app/_Components/ui/Tooltip";

function IconButton({ children, disabled, onClick, title }) {
  const btn = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      className={`h-8 w-8 inline-flex items-center justify-center rounded-md border text-sm cursor-pointer
        ${
          disabled
            ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
        }`}
    >
      {children}
    </button>
  );

  if (!title) return btn;
  return (
    <Tooltip label={title} side="top">
      {btn}
    </Tooltip>
  );
}

export default IconButton;
