import React, { memo } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import {
  Copy,
  DollarSign,
  EllipsisVertical,
  Link,
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

export const LinkRow = memo(
  function LeadRow({ emp, onEdit, setConfirmDelete }) {
    const router = useRouter();

    return (
      <motion.tr
        key={emp?._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="hover:bg-gray-50 transition-colors relative "
      >
        <td className="px-2 py-3 whitespace-nowrap text-[12px] font-medium text-gray-600 capitalize cursor-pointer">
          {emp?.name || "-"}
        </td>

        <td className="px-2 py-3 whitespace-nowrap text-[12px] font-medium text-gray-600 cursor-pointer">
          {emp?.email || "-"}
        </td>

        <td className="px-2 py-3 whitespace-nowrap text-[12px] text-gray-800 cursor-pointer">
          {emp?.phoneNo || "-"}
        </td>

        <td className="px-2 py-3 whitespace-nowrap text-[12px] font-medium text-gray-600 capitalize cursor-pointer">
          {emp?.brandId?.name || "-"}
        </td>

        <td className="px-2 py-3 ">
          {Array.isArray(emp?.service) ? (
            emp.service.length > 0 ? (
              emp.service.map((tagItem, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium capitalize"
                >
                  {tagItem}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-gray-600">No Service</span>
            )
          ) : (
            <span className="capitalize inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {emp?.service || "No Service"}
            </span>
          )}
        </td>

        <td className="px-2 py-3  whitespace-nowrap">
          <span className="text-[12px] text-gray-600">{emp?.merchantType}</span>
        </td>

        <td className="px-3  whitespace-nowrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              emp?.paymentStatus
            )}`}
          >
            {emp?.paymentStatus
              ? emp.paymentStatus.charAt(0).toUpperCase() +
                emp.paymentStatus.slice(1)
              : "-"}
          </span>
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            💰 ${emp?.amount}
          </span>
        </td>
        <td className="px-2 py-3  whitespace-nowrap">
          <span className="text-[12px] text-gray-600">
            {emp?.createdAt && (
              <span className="text-[12px] text-gray-600">
                {formatDate(emp.createdAt)}
              </span>
            )}
          </span>
        </td>

        <td className="pl-2  whitespace-nowrap">
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
                  className="z-20 mt-1 w-32 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
                  data-[closed]:opacity-0"
                >
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => onEdit(emp)}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 px-2 py-2 text-[12px] text-blue-700`}
                        >
                          <Copy className="h-4 w-4" />
                          Copy Link
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
