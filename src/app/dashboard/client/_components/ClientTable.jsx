"use client";

import Image from "next/image";
import SignupTypeBadge from "@/app/_Components/table/SignupTypeBadge";
import ClientRowMenu from "@/app/_Components/table/tableRow/tableHeader/ClientRowMenu";

export default function ClientTable({ clients, handleEdit, onDelete }) {
  return (
    <>
      {/* ── Desktop Table (md+) ── */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-zinc-900">
              <tr>
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
                    className="p-3 text-left text-[10px] font-bold text-zinc-300 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {clients.map((emp, index) => (
                <tr
                  key={emp?._id || index}
                  className="group transition-colors hover:bg-zinc-50"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 flex-shrink-0 ring-2 ring-purple-100 rounded-full overflow-hidden">
                        <Image
                          src={emp?.image || "/placeholder.svg"}
                          alt="Client"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-gray-800 leading-none capitalize">
                          {emp?.name || "Unknown"}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-1">
                          {emp?.email || "-"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-[11px] text-gray-600">
                      {emp?.companyName || "No Company"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-[11px] text-gray-500 font-medium">
                    {emp?.phoneNo || "-"}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <SignupTypeBadge type={emp?.signupType} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {emp?.brandId?.name && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-blue-50 text-blue-600 border border-blue-100">
                          {emp.brandId.name}
                        </span>
                      )}
                      {emp?.departmentId?.name && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-purple-50 text-purple-600 border border-purple-100">
                          {emp.departmentId.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] text-gray-600 font-medium capitalize">
                      {emp?.handleBy?.fullName || "-"}
                    </span>
                  </td>
                  <td className="sticky right-0 z-[5] w-10 bg-white px-2 py-2.5 border-l border-zinc-100 transition-colors group-hover:bg-zinc-50">
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
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-3"
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
                  <span className="text-[13px] font-bold text-gray-800 leading-none capitalize">
                    {emp?.name || "Unknown"}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-0.5">
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
            <div className="border-t border-zinc-100 pt-2.5 flex flex-col gap-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">Business</span>
                <span className="text-zinc-700 font-semibold">
                  {emp?.companyName || "No Company"}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">Contact</span>
                <span className="text-zinc-700 font-semibold">
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
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
                      {emp.brandId.name}
                    </span>
                  )}
                  {emp?.departmentId?.name && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-purple-50 text-purple-600 border border-purple-100">
                      {emp.departmentId.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">Handled by</span>
                <span className="text-zinc-700 font-semibold capitalize">
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
