import React, { memo } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import { DollarSign, EllipsisVertical, Mail, Pencil, Trash2 } from "lucide-react";
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

export const LeadRow = memo(
  function LeadRow({ emp, onEdit,setConfirmDelete }) {
    const router = useRouter();

    return (
      <motion.tr
        key={emp?._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="hover:bg-purple-50 transition-colors relative "
      >
        <td
          className="px-4 py-2 whitespace-nowrap text-[13px] text-gray-600 capitalize cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          {emp?.name || "-"}
        </td>

        <td
          className="px-2 py-2 whitespace-nowrap text-[13px] text-gray-600 capitalize cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          {emp?.brandMark || "-"}
        </td>

        <td
          className="px-2 py-2 whitespace-nowrap capitalize text-[13px] text-gray-600 cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          {emp?.serialNo || "-"}
        </td>

        <td
          className="px-2 py-2 whitespace-nowrap text-[12px] text-gray-800 cursor-pointer"
          onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}
        >
          {emp?.phoneNo || "-"}
        </td>

        <td className="px-2 py-2 whitespace-nowrap text-[12px] text-gray-800 cursor-pointer"
        onClick={() => router.push(`/dashboard/lead/detail/${emp?._id}`)}>
          {emp?.email || "-"}
        </td>

        <td className="px-2 py-2 whitespace-nowrap">
          <div className="flex flex-col items-start gap-1 bg-gray-100 shadow p-2 rounded-md">
            {emp?.lastComment &&  <span className="text-xs text-gray-700 ">
             {emp?.lastComment}
          </span>}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getActionStatusColor(
                emp?.lastAction
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
              <span className="text-[12px] text-gray-600">
                {formatDate(emp.lastActionCreateAt)}
              </span>
            )}
          </div>
        </td>

        <td className="px-2 py-2 whitespace-nowrap ">
          <span className="text-[12px] text-gray-600">
            {emp?.signupDate ? formatDate(emp.signupDate) : "-"}
          </span>
        </td>

        <td className="px-3 py-4 whitespace-nowrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              emp?.paidStatus
            )}`}
          >
            {emp?.paidStatus
              ? emp.paidStatus.charAt(0).toUpperCase() + emp.paidStatus.slice(1)
              : "-"}
          </span>
        </td>


        <td className="pl-2 py-2 whitespace-nowrap">
          <div className="relative inline-block">
            {" "}
            {/* important: relative container */}
            <Menu>
              <MenuButton className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 border-1 border-gray-200 hover:bg-purple-100">
                <EllipsisVertical className="h-4 w-4 text-gray-700" />
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
                  className="z-20 mt-2 w-32 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                               data-[closed]:opacity-0"
                >
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            router.push(`/dashboard/lead/detail/${emp?._id}`)
                          }
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-[12px] text-gray-800`}
                        >
                          <BiDetail className="h-4 w-4" />
                          Details
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => onEdit(emp)}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-[12px] text-green-700`}
                        >
                          <Pencil className="h-4 w-4" />
                          Mark Action
                        </button>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/SendEmail?leadId=${emp?._id}&name=${emp?.name}&email=${emp?.email}&brand=${emp?.brandId?.name}`
                            )
                          }
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-[12px] text-yellow-500`}
                        >
                          <Mail className="h-4 w-4" />
                          Send Email
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() =>  
                            router.push(
                              `/dashboard/paymentLink/createLeadPayment?leadId=${emp?._id}`
                            )
                          }
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-[12px] text-blue-500`}
                        >
                          <DollarSign className="h-4 w-4" />
                          Payment Link
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setConfirmDelete(emp?._id)}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-[12px] text-red-600`}
                        >
                          <Trash2 className="h-4 w-4" />
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
  (prev, next) => prev.emp === next.emp
);
