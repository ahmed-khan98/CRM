import React, { memo, useState } from "react"; // <-- useState import kiya
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
  Check,
  Eye, // <-- New icon for 'Copied' state
} from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import { getActionStatusColor, getStatusColor } from "@/app/utilities/color";

export const LinkRow = memo(
  function LeadRow({ emp, setConfirmDelete }) {

    const router = useRouter();

    const [isCopied, setIsCopied] = useState(false);

    const onCopy = (payId) => {
      if (!payId) {
        console.error("Payment ID is missing.");
        return;
      }

      const baseUrl = "https://crm-virid-nine-17.vercel.app/pay/";
      const fullUrl = `${baseUrl}${payId}`;

      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          // Set state to show 'Copied' text
          setIsCopied(true);

          // Reset state after 3 seconds
          setTimeout(() => {
            setIsCopied(false);
          }, 3000); // 3000 milliseconds = 3 seconds
        })
        .catch((err) => {
          console.error("Failed to copy URL: ", err);
          // Optional: show a temporary error message
        });
    };

    return (
      <motion.tr
        key={emp?._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="hover:bg-gray-50 transition-colors relative "
      >
        <td className="px-4 py-2 whitespace-nowrap text-[12px] font-normal text-gray-600 capitalize">
          {emp?.name || "-"}
        </td>

        <td className="px-2 py-2 whitespace-nowrap text-[12px] font-normal text-gray-600">
          {emp?.email || "-"}
        </td>

        <td className="px-2 py-2 whitespace-nowrap text-[12px] text-gray-800">
          {emp?.phoneNo || "-"}
        </td>

        <td className="px-2 py-2 whitespace-nowrap text-[12px] font-normal text-gray-600 capitalize">
          {emp?.brandId?.name || "-"}
        </td>

        <td className="px-2 py-2 ">
          {Array.isArray(emp?.service) ? (
            emp.service.length > 0 ? (
              emp.service.map((tagItem, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize whitespace-nowrap"
                >
                  {tagItem}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-gray-600">No Service</span>
            )
          ) : (
            <span className="capitalize inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {emp?.service || "No Service"}
            </span>
          )}
        </td>

        <td className="px-2 py-2  whitespace-nowrap">
          <span className="text-[12px] text-gray-600">{emp?.merchantType}</span>
        </td>

        <td className="px-3  whitespace-nowrap">
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
        <td className="px-2 py-2 whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-bold bg-zinc-200 text-zinc-800">
            <DollarSign className="text-amber-500 h-5 w-5" /> {emp?.amount}
          </span>
        </td>
        <td className="px-2 py-2  whitespace-nowrap">
          {emp?.createdAt && (
            <span className="text-[12px] text-gray-600">
              {formatDate(emp.createdAt)}
            </span>
          )}
        </td>

        <td className="pl-2  whitespace-nowrap">
          <div className="relative inline-block">
            {" "}
            {/* important: relative container */}
            <Menu>
              <MenuButton className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 border-1 border-gray-200 hover:bg-zinc-200">
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
                     {emp?.paymentStatus !== "paid" && (
                   <>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => router.push(`/pay/${emp?._id}`)}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 p-1.5 text-[12px] text-gray-800`}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => onCopy(emp?._id)} // Updated to use local onCopy
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 p-1.5 text-[12px] ${
                            isCopied ? "text-green-600" : "text-blue-700" // Text color change
                          }`}
                        >
                          {/* Icon change based on state */}
                          {isCopied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          {/* Text change based on state */}
                          {isCopied ? "Copied!" : "Copy Link"}{" "}
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setConfirmDelete(emp?._id)}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } cursor-pointer flex w-full items-center gap-2 p-1.5 text-[12px] text-red-600`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </MenuItem>
                   </>)}
                   
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
