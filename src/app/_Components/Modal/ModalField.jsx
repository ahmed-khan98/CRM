"use client";

import { ErrorMessage } from "formik";
import { fleet } from "../fleet/fleetTheme";

/** Label + children + optional Formik error — Vehicle modal style */
export default function ModalField({
  label,
  name,
  required = false,
  children,
  className = "",
  showError = true,
}) {
  return (
    <div className={className}>
      {label ? (
        <label className={fleet.modalLabel} htmlFor={name || undefined}>
          {label}
          {required && <span className="text-white"> *</span>}
        </label>
      ) : null}
      {children}
      {showError && name ? (
        <ErrorMessage
          name={name}
          component="p"
          className="text-red-400 text-[11px] mt-1"
        />
      ) : null}
    </div>
  );
}
