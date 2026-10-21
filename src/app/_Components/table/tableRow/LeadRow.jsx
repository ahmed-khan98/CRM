import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import {
  DollarSign,
  EllipsisVertical,
  Mail,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import { BiDetail } from "react-icons/bi";
import { getActionStatusColor, getStatusColor } from "@/app/utilities/color";
import Tooltip from "@/app/_Components/ui/Tooltip";

export const LeadRow = memo(
  function LeadRow({ index, emp, onEdit, onEditLead, setConfirmDelete }) {
    const router = useRouter();
    console.log(index, "index");

    return (
      <motion.tr
        key={emp?._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="hover:bg-zinc-50 transition-colors relative"
      >
        <td
          className="px-1 py-1 whitespace-nowrap text-[13px] text-gray-600 capitalize cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          {`${index}.`}
        </td>
        <td
          className="min-w-[160px] px-1 py-1 cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          <div className="flex flex-col ">
            <span className="text-[12px] font-semibold text-zinc-100 capitalize truncate max-w-[180px]">
              {emp?.name || "—"}
            </span>
            <span className="text-[11px] text-zinc-500 truncate max-w-[180px] normal-case">
              {emp?.email || "—"}
            </span>
            <span className="text-[10px] text-zinc-500 truncate max-w-[180px]">
              {emp?.phoneNo || "—"}
            </span>
          </div>
        </td>

        <td
          className="px-1 py-1 whitespace-nowrap text-[13px] text-gray-600 capitalize cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
            <span className="text-[12px] text-zinc-100">
           {emp?.brandMark || "-"}
          </span>
          
        </td>
        <td
          className="px-1 py-1 whitespace-nowrap cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          <span className="text-[11px] text-gray-300">
            {emp?.serialNo || "-"}
          </span>
        </td>

        <td
          className="px-1 py-1 w-[360px] min-w-[200px] cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          <div className="bg-zinc-50 shadow p-1.5 rounded-md">
            {emp?.lastComment && (
              <Tooltip
                label={emp.lastComment}
                side="top"
                className="max-w-full"
                delay
              >
                <div className="text-xs text-gray-400 leading-snug line-clamp-3">
                  {emp.lastComment}
                </div>
              </Tooltip>
            )}

            <span
              className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getActionStatusColor(
                emp?.lastAction,
              )}`}
            >
              {emp?.lastAction
                ? emp.lastAction === "schedule"
                  ? `Schedule on ${formatDate(emp.scheduleDate)}`
                  : emp.lastAction.charAt(0).toUpperCase() +
                    emp.lastAction.slice(1)
                : "No Action"}
            </span>

            {emp?.lastActionCreateAt && (
              <div className="text-[10px] text-zinc-500 mt-1">
                {formatDate(emp.lastActionCreateAt)}
              </div>
            )}
          </div>
        </td>

        <td className="px-1 py-1 whitespace-nowrap">
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] text-zinc-500">
              {emp?.signupDate ? formatDate(emp.signupDate) : "—"}
            </span>
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-normal ${getStatusColor(
                emp?.paidStatus,
              )}`}
            >
              {emp?.paidStatus
                ? emp.paidStatus.charAt(0).toUpperCase() + emp.paidStatus.slice(1)
                : "—"}
            </span>
          </div>
        </td>
        <td
          className="px-1 py-1 whitespace-nowrap text-[12px] text-gray-800 cursor-pointer capitalize"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          <span className="text-[11px] text-gray-300">
           {emp?.brandId?.name || emp?.departmentId?.name || "-"}
          </span>

          
        </td>


        {/* ACTION MENU */}
        <td className="pl-1 py-1 whitespace-nowrap  ">
          <div className="relative inline-block">
            <Menu>
              <MenuButton className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-ink p-1.5 text-zinc-300 transition-colors hover:bg-zinc-800">
                <EllipsisVertical className="h-3.5 w-3.5" />
              </MenuButton>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems
                  anchor="bottom end"
                  className="z-[9999] mt-2 w-40 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl focus:outline-none"
                >
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            router.push(`/dashboard/lead/detail/${emp?._id}`)
                          }
                          className={`${
                            active ? "bg-zinc-800" : ""
                          } flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-zinc-200`}
                        >
                          <BiDetail className="h-3.5 w-3.5" />
                          Details
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => onEditLead?.(emp)}
                          className={`${
                            active ? "bg-zinc-800" : ""
                          } flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-zinc-200`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit Lead
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => onEdit(emp)}
                          className={`${
                            active ? "bg-emerald-500/10" : ""
                          } flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-emerald-400`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Mark Action
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/SendEmail?leadId=${emp?._id}&name=${emp?.name}&email=${emp?.email}&brand=${emp?.brandId?.name}`,
                            )
                          }
                          className={`${
                            active ? "bg-amber-500/10" : ""
                          } flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-amber-300`}
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Send Email
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/paymentLink/createLeadPayment?leadId=${emp?._id}`,
                            )
                          }
                          className={`${
                            active ? "bg-sky-500/10" : ""
                          } flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-sky-300`}
                        >
                          <DollarSign className="h-3.5 w-3.5" />
                          Payment Link
                        </button>
                      )}
                    </MenuItem>

                    <div className="my-1 border-t border-zinc-700" />

                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setConfirmDelete(emp?._id)}
                          className={`${
                            active ? "bg-rose-500/10" : ""
                          } flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-rose-400`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </td>
      </motion.tr>
    );
  },
  (prev, next) => prev.emp === next.emp,
);
