"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { fleet } from "../fleet/fleetTheme";

/**
 * Shared dark modal chrome matching Add Vehicle.
 * Put form content in `children`. Optional `footer` sticks below the scroll area.
 */
export default function ModalShell({
  isOpen = true,
  onClose,
  title,
  children,
  footer = null,
  maxWidthClass = "max-w-3xl",
  zClass = "z-[100]",
  bodyClassName = "",
  stopPropagation = true,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 ${zClass} flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${fleet.modalPanel} ${maxWidthClass}`}
            onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
              <h2 className={fleet.modalTitle}>{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className={fleet.modalCloseBtn}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`${fleet.modalBody} ${bodyClassName}`.trim()}>
              {children}
            </div>

            {footer ? <div className={fleet.modalFooter}>{footer}</div> : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
