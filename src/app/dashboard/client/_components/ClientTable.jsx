"use client";

import Image from "next/image";
import Link from "next/link";
import SignupTypeBadge from "@/app/_Components/table/SignupTypeBadge";
import ClientRowMenu from "@/app/_Components/table/tableRow/tableHeader/ClientRowMenu";
import { tableWrap, thClass, theadRow, trHover } from "@/app/_Components/ui/saas/DataTable";

export default function ClientTable({ clients, handleEdit, onDelete }) {
  return (
    <>
      {/* ── Desktop Table (md+) ── */}
      <div className={`hidden md:block ${tableWrap}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className={theadRow}>
                {[
                  "Client Info",
                  "Business / Brand",
                  "Contact",
                  "Signup Type",
                  "Tags",
                  "Handled By",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className={thClass}
                    style={
                      h === "Business / Brand"
                        ? { width: 200, maxWidth: 200 }
                        : undefined
                    }
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {clients.map((emp, index) => (
                <tr
                  key={emp?._id || index}
                  className={`group ${trHover}`}
                >
                  <td className="px-2 py-1">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 flex-shrink-0 ring-2 ring-purple-100 rounded-full overflow-hidden">
                        <Image
                          src={emp?.image || "/dummy.png"}
                          alt="Client"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/client/${emp?._id}`}
                          className="text-[12px] font-semibold text-gray-200 leading-none capitalize hover:text-zinc-900"
                        >
                          {emp?.name || "Unknown"}
                        </Link>
                        <span className="text-[11px] text-zinc-500 mt-1">
                          {emp?.email || "-"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-1 max-w-[200px] w-[200px]">
                    <span className="block max-w-[200px] whitespace-normal break-words text-[10px] font-medium text-gray-300">
                      {emp?.companyName || "No Company"}
                    </span>
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-[10px] text-zinc-500">
                    {emp?.phoneNo || "-"}
                  </td>
                  <td className="px-2 py-1 text-center whitespace-nowrap">
                    <SignupTypeBadge type={emp?.signupType} />
                  </td>
                  <td className="px-2 py-1">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {emp?.brandId?.name && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-tighter bg-sky-500/15 text-sky-300 border-sky-500/30">
                          {emp.brandId.name}
                        </span>
                      )}
                      {emp?.departmentId?.name && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-tighter bg-purple-500/15 text-purple-300 border-purple-500/30">
                          {emp.departmentId.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-1">
                    <span className="text-[11px] text-gray-600 font-medium capitalize">
                      {emp?.handleBy?.fullName || "-"}
                    </span>
                  </td>
                  <td className="sticky right-0 z-[5] w-10 bg-white px-2 py-1 border-l border-zinc-200 transition-colors group-hover:bg-zinc-50">
                    <ClientRowMenu
                      emp={emp}
                      handleEdit={() => handleEdit(emp)}
                      onDelete={() => onDelete(emp._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-2.5">
        {clients.map((emp, index) => (
          <div
            key={emp?._id || index}
            className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-3"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 flex-shrink-0 ring-2 ring-purple-100 rounded-full overflow-hidden">
                  <Image
                    src={emp?.image || "/placeholder.svg"}
                    alt="Client"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <Link
                    href={`/dashboard/client/${emp?._id}`}
                    className="text-[13px] font-bold text-gray-800 leading-none capitalize hover:text-zinc-900"
                  >
                    {emp?.name || "Unknown"}
                  </Link>
                  <span className="text-[11px] text-zinc-400 mt-0.5">
                    {emp?.email || "-"}
                  </span>
                </div>
              </div>
              <ClientRowMenu
                emp={emp}
                handleEdit={() => handleEdit(emp)}
                onDelete={() => onDelete(emp._id)}
              />
            </div>

            {/* Card Body */}
            <div className="border-t border-zinc-200 pt-2.5 flex flex-col gap-2">
              <div className="flex justify-between gap-3 text-[11px]">
                <span className="shrink-0 text-zinc-400 font-medium">Business</span>
                <span className="max-w-[200px] text-right whitespace-normal break-words text-zinc-900 font-semibold">
                  {emp?.companyName || "No Company"}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">Contact</span>
                <span className="text-zinc-900 font-semibold">
                  {emp?.phoneNo || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-400 font-medium">Signup type</span>
                <SignupTypeBadge type={emp?.signupType} />
              </div>
              <div className="flex justify-between items-start text-[11px]">
                <span className="text-zinc-400 font-medium">Tags</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
                  {emp?.brandId?.name && (
                    <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium uppercase bg-sky-500/15 text-sky-300 border-sky-500/30">
                      {emp.brandId.name}
                    </span>
                  )}
                  {emp?.departmentId?.name && (
                    <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium uppercase bg-purple-500/15 text-purple-300 border-purple-500/30">
                      {emp.departmentId.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">Handled by</span>
                <span className="text-zinc-900 font-semibold capitalize">
                  {emp?.handleBy?.fullName || "-"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
