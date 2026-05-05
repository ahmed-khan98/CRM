// "use client";

// import { useState } from "react";
// import { Users, Edit, Plus, Trash2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { formatDate } from "@/app/utilities/date";
// import {
//   useAllEmployeesQuery,
//   useDeleteEmployeeMutation,
//   useUpdateStatusMutation,
// } from "@/app/_Services/employee/page";
// import EmployeeModal from "@/app/_Components/Modal/EmployeeModal";
// import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
// import Image from "next/image";
// import WarningModal from "@/app/_Components/Modal/WarningModal";
// import { getActionStatusColor } from "@/app/utilities/color";
// import toast from "react-hot-toast";
// import { EMPLOYEE_HEADERS } from "@/app/_Components/table/tableRow/tableHeader/employeeHeader";

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// export default function AppointmentBooking() {
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [editingAppointment, setEditingAppointment] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(null);

//   const { data, isLoading, refetch } = useAllEmployeesQuery();
//   const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
//   const [updateStatus, { isLoading: statusLoading, originalArgs: statusArgs }] = useUpdateStatusMutation();

//   const handleEdit = (emp) => {
//     setEditingAppointment(emp);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingAppointment(null);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "scheduled": return "text-blue-600 bg-blue-300";
//       case "completed": return "text-green-600 bg-green-300";
//       case "missed": return "text-red-600 bg-red-300";
//       case "cancelled": return "text-gray-600 bg-gray-300";
//       default: return "text-gray-800 bg-purple-300";
//     }
//   };

//   const filteredNotifications = () => {
//     if (!data?.data) return [];
//     if (activeFilter !== "all") {
//       return data.data.filter((item) => item?.departmentId?.name === activeFilter);
//     }
//     return data.data;
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteEmployee(confirmDelete).unwrap();
//       setConfirmDelete(null);
//       toast.success("Employee deleted successfully");
//       refetch();
//     } catch (error) {
//       toast.error(error.data?.message || "Failed to delete employee");
//     }
//   };

//   const { data: departments } = useAllDepartmentsQuery();
//   const filterData = ["all", ...(departments?.data?.map((e) => e?.name) || [])];

//   if (isLoading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center gap-3">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//           className="w-8 h-8 rounded-full border-2 border-transparent border-t-white border-r-white/30"
//         />
//         <span className="text-sm font-semibold text-zinc-500">Loading your Employees...</span>
//       </div>
//     );
//   }

//   const employees = filteredNotifications();

//   return (
//     <div className="min-h-screen p-2">
//       <div className="w-full flex flex-col gap-4">

//         {/* Header */}
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.07] border border-white/10">
//               <Users className="w-4 h-4 text-zinc-400" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-600">Management</p>
//               <h3 className="text-base font-black text-zinc-100">All Employees</h3>
//             </div>
//           </div>
//           <motion.button
//             whileTap={{ scale: 0.97 }}
//             onClick={() => handleEdit()}
//             className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 self-start sm:self-auto bg-white/[0.07] border border-white/10 text-zinc-200 hover:bg-white/[0.12]"
//           >
//             <Plus className="h-3.5 w-3.5" />
//             Add Employee
//           </motion.button>
//         </div>

//         {/* Filter tabs */}
//         <div className="flex flex-wrap gap-1 p-1 rounded-xl w-fit bg-white/[0.04] border border-white/[0.06]">
//           {filterData?.map((e) => (
//             <button
//               key={e}
//               onClick={() => setActiveFilter(e)}
//               className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all duration-150 capitalize font-semibold border ${
//                 activeFilter === e
//                   ? "bg-white/10 border-white/[0.14] text-zinc-100"
//                   : "border-transparent text-zinc-600 hover:text-zinc-400"
//               }`}
//             >
//               {e}
//             </button>
//           ))}
//         </div>

//         {/* Table */}
//         <motion.div variants={itemVariants}>
//           {employees.length === 0 ? (
//             <div className="flex flex-col items-center justify-center rounded-2xl p-14 text-center bg-white/[0.03] border border-white/[0.06]">
//               <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white/5 border border-white/[0.08]">
//                 <Users className="w-6 h-6 text-zinc-700" />
//               </div>
//               <p className="text-sm font-bold mb-1 text-zinc-600">No Employees Found</p>
//               <p className="text-xs text-zinc-700">
//                 {activeFilter === "all"
//                   ? "You don't have any employees yet."
//                   : `No employees in ${activeFilter} department.`}
//               </p>
//             </div>
//           ) : (
//             <div className="rounded-2xl overflow-hidden border border-white/[0.07]">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="bg-white/5 border-b border-white/[0.07]">
//                       {EMPLOYEE_HEADERS.map((col, index) => (
//                         <th key={index} className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] whitespace-nowrap text-zinc-600">
//                           {col}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {employees.map((emp, index) => (
//                       <motion.tr
//                         key={emp?._id}
//                         initial={{ opacity: 0, y: 8 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.04, duration: 0.25 }}
//                         className={`border-b border-white/[0.04] hover:bg-white/5 transition-colors duration-150 ${
//                           index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
//                         }`}
//                       >
//                         <td className="px-3 py-2.5 text-center">
//                           <span className="text-[11px] font-bold text-zinc-600">{index + 1}</span>
//                         </td>
//                         <td className="px-3 py-2.5 text-center">
//                           <div className="relative w-8 h-8 mx-auto">
//                             <Image
//                               src={emp?.image || "/placeholder.svg"}
//                               alt="employee-img"
//                               fill
//                               className="rounded-full object-cover ring-[1.5px] ring-white/10"
//                             />
//                           </div>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap">
//                           <span className="text-xs font-semibold capitalize text-zinc-300">{emp?.fullName || "-"}</span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap">
//                           <span className="text-xs text-zinc-500">{emp?.email || "-"}</span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <span className="text-xs text-zinc-500">{emp?.designation || "-"}</span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <span className="text-xs font-mono text-zinc-500">{emp?.CNIC || "-"}</span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <span className="text-xs font-mono text-zinc-500">{emp?.phoneNo || "-"}</span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           {emp?.departmentId?.name ? (
//                             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(emp?.departmentId?.name)}`}>
//                               {emp.departmentId.name.charAt(0).toUpperCase() + emp.departmentId.name.slice(1)}
//                             </span>
//                           ) : (
//                             <span className="text-zinc-700">-</span>
//                           )}
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getActionStatusColor(emp?.role)}`}>
//                             {emp?.role ? emp.role.charAt(0).toUpperCase() + emp.role.slice(1) : "-"}
//                           </span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <button
//                             disabled={statusLoading}
//                             onClick={() => updateStatus({ id: emp?._id })}
//                             className={`cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all duration-150 ${getActionStatusColor(emp?.status)} ${
//                               statusLoading && statusArgs?.id === emp?._id ? "opacity-50 cursor-not-allowed" : ""
//                             }`}
//                           >
//                             {statusLoading && statusArgs?.id === emp?._id ? (
//                               <div className="flex items-center gap-1">
//                                 <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
//                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                 </svg>
//                                 <span>Wait...</span>
//                               </div>
//                             ) : (
//                               emp?.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : "-"
//                             )}
//                           </button>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <span className="text-[11px] text-zinc-500">{emp?.joiningDate ? formatDate(emp.joiningDate) : "-"}</span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap">
//                           <div className="flex items-center justify-center gap-1.5">
//                             <motion.button
//                               whileHover={{ scale: 1.08 }}
//                               whileTap={{ scale: 0.92 }}
//                               onClick={() => handleEdit(emp)}
//                               className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 bg-indigo-500/10 border border-indigo-500/[0.18] text-indigo-400 hover:bg-indigo-500/[0.18]"
//                             >
//                               <Edit className="h-3.5 w-3.5" />
//                             </motion.button>
//                             <motion.button
//                               whileHover={{ scale: 1.08 }}
//                               whileTap={{ scale: 0.92 }}
//                               onClick={() => setConfirmDelete(emp._id)}
//                               className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 bg-red-500/[0.08] border border-red-500/[0.16] text-red-400 hover:bg-red-500/[0.16]"
//                             >
//                               <Trash2 className="h-3.5 w-3.5" />
//                             </motion.button>
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </motion.div>

//         {confirmDelete && (
//           <WarningModal
//             message="employee"
//             setConfirmDelete={setConfirmDelete}
//             isDeleting={isDeleting}
//             handleDelete={handleDelete}
//           />
//         )}

//         <EmployeeModal
//           isOpen={isModalOpen}
//           data={editingAppointment}
//           closeModal={closeModal}
//           refetch={refetch}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Users, Edit, Plus, DeleteIcon } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import {
  useAllEmployeesQuery,
  useDeleteEmployeeMutation,
  useUpdateStatusMutation,
} from "@/app/_Services/employee/page";
import EmployeeModal from "@/app/_Components/Modal/EmployeeModal";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import Image from "next/image";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import { getActionStatusColor } from "@/app/utilities/color";
import toast from "react-hot-toast";
import { EMPLOYEE_HEADERS } from "@/app/_Components/table/tableRow/tableHeader/employeeHeader";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AppointmentBooking() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, error: isError, isLoading, refetch } = useAllEmployeesQuery();
  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

  // Yahan statusLoading aur statusArgs ko nikal liya
  const [updateStatus, { isLoading: statusLoading, originalArgs: statusArgs }] =
    useUpdateStatusMutation();

  const handleEdit = (emp) => {
    setEditingAppointment(emp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleStatus = async (id) => {
    try {
      const response = await updateStatus({ id }).unwrap();
      console.log(response, "response");
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to changed status");
      }
      refetch();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        error?.data?.message ||
        "Failed to create department";
      toast.error(msg);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-300";
      case "completed":
        return "text-green-600 bg-green-300";
      case "missed":
        return "text-red-600 bg-red-300";
      case "cancelled":
        return "text-gray-600 bg-gray-300";
      default:
        return "text-gray-800 bg-purple-300";
    }
  };

  const filteredNotifications = () => {
    if (!data?.data) return [];
    if (activeFilter !== "all") {
      return data.data.filter(
        (item) => item?.departmentId?.name === activeFilter,
      );
    } else {
      return data.data;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Employee deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete employee");
    }
  };

  const {
    data: departments,
    error: isDepartError,
    isLoading: isDeaprtLoading,
  } = useAllDepartmentsQuery();

  const filterData = ["all", ...(departments?.data?.map((e) => e?.name) || [])];

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-zinc-800 border-t-transparent rounded-full"
        />

        <span className="ml-4 text-gray-800 font-semibold">
          Loading your Employees... 🚀
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mx-1">
      <div className="w-full mx-auto p-1 flex flex-col space-y-2">
        <div className="flex flex-col gap-2 pb-2 justify-between items-center md:flex-row">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-800" />
            <h3 className="text-[#242424] text-xl font-bold">All Employees</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit()}
              className="flex items-center gap-2 cursor-pointer bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-900 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </motion.button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <div className="flex bg-white rounded-full shadow-sm p-1">
            {filterData?.map((e, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(e)}
                className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${
                  activeFilter === e
                    ? "bg-zinc-800 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <motion.div variants={itemVariants} className="">
          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Users className="h-16 w-16 text-gray-300 mbg-zinc-800" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Employee
              </h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any Employee yet."
                  : `You don't have any ${activeFilter} Employee.`}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-800 py-0">
                    <tr>
                      {EMPLOYEE_HEADERS.map((col, index) => (
                        <th
                          key={index}
                          className={`text-center text-[11px] font-medium text-zinc-300 capitalize tracking-wider           ${col === "Sr" ? "px-2 py-3" : ""}           ${col === "Status" ? "px-5 py-3" : ""}           ${col !== "Sr" && col !== "Status" ? "p-3" : ""}  `}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications().map((emp, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-600 capitalize">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 flex-shrink-0 ring-2 ring-purple-100 rounded-full overflow-hidden">
                              <Image
                                src={emp?.image || "/placeholder.svg"}
                                alt="employee-img"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-800 leading-none capitalize">
                                {emp?.fullName || "-"}
                              </span>
                              <span className="text-[12px] text-gray-500 mt-1">
                                {emp?.email || "-"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-600">
                          {emp?.designation || "-"}
                        </td>

                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-600">
                          {emp?.CNIC || "-"}
                        </td>

                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-600">
                          {emp?.phoneNo || "-"}
                        </td>

                        <td className="px-1 py-1.5 whitespace-nowrap capitalize">
                          {emp?.departmentId?.name ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp?.departmentId?.name)}`}
                            >
                              {emp?.departmentId?.name.charAt(0).toUpperCase() +
                                emp?.departmentId?.name.slice(1)}
                            </span>
                          ) : (
                            "-" // if no department
                          )}
                        </td>
                        <td className="px-1  whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getActionStatusColor(emp?.role)}`}
                          >
                            {emp?.role
                              ? emp.role.charAt(0).toUpperCase() +
                                emp.role.slice(1)
                              : "-"}
                          </span>
                        </td>
                        <td className="px-1 whitespace-normal text-center">
                          <button
                            disabled={statusLoading}
                            onClick={() => updateStatus({ id: emp?._id })}
                            className={`relative min-w-[80px] flex items-center justify-center cursor-pointer px-2 py-1 shadow-sm rounded text-xs font-medium transition-all ${getActionStatusColor(emp?.status)} ${statusLoading && statusArgs?.id === emp?._id ? "opacity-70 cursor-not-allowed" : ""}`}
                          >
                            {statusLoading && statusArgs?.id === emp?._id ? (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="animate-spin h-3 w-3 text-current"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                <span>Wait...</span>
                              </div>
                            ) : emp?.status ? (
                              emp.status.charAt(0).toUpperCase() +
                              emp.status.slice(1)
                            ) : (
                              "-"
                            )}
                          </button>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="text-[12px] text-gray-600">
                              {emp?.joiningDate
                                ? formatDate(emp.joiningDate)
                                : "-"}
                            </span>
                          </div>
                        </td>
                        <td className=" px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(emp)}
                              className="cursor-pointer p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setConfirmDelete(emp._id)}
                              className="cursor-pointer p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <DeleteIcon className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
        {confirmDelete && (
          <WarningModal
            message="employee"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        <EmployeeModal
          isOpen={isModalOpen}
          data={editingAppointment}
          closeModal={closeModal}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
