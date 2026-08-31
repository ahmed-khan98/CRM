"use client";

import { memo } from "react";

function IconButton({
  label,
  className = "",
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default memo(IconButton);
