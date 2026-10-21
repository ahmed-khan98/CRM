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
//       case "scheduled": return "text-sky-700 bg-blue-300";
//       case "completed": return "text-emerald-700 bg-green-300";
//       case "missed": return "text-rose-600 bg-red-300";
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
//               <p className="text-xs font-medium tracking-[0.15em] uppercase text-zinc-500">Management</p>
//               <h3 className="text-base font-black text-zinc-100">All Employees</h3>
//             </div>
//           </div>
//           <motion.button
//             whileTap={{ scale: 0.97 }}
//             onClick={() => handleEdit()}
//             className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 self-start sm:self-auto bg-white/[0.07] border border-white/10 text-zinc-100 hover:bg-white/[0.12]"
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
//               className={`px-3 py-2.5 text-xs rounded-lg cursor-pointer transition-all duration-150 capitalize font-semibold border ${
//                 activeFilter === e
//                   ? "bg-white/10 border-white/[0.14] text-zinc-100"
//                   : "border-transparent text-zinc-500 hover:text-zinc-400"
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
//                 <Users className="w-6 h-6 text-zinc-900" />
//               </div>
//               <p className="text-sm font-medium mb-1 text-zinc-500">No Employees Found</p>
//               <p className="text-xs text-zinc-900">
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
//                         <th key={index} className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider whitespace-nowrap text-zinc-500">
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
//                           <span className="text-xs font-medium text-zinc-500">{index + 1}</span>
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
//                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${getStatusColor(emp?.departmentId?.name)}`}>
//                               {emp.departmentId.name.charAt(0).toUpperCase() + emp.departmentId.name.slice(1)}
//                             </span>
//                           ) : (
//                             <span className="text-zinc-900">-</span>
//                           )}
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${getActionStatusColor(emp?.role)}`}>
//                             {emp?.role ? emp.role.charAt(0).toUpperCase() + emp.role.slice(1) : "-"}
//                           </span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap text-center">
//                           <button
//                             disabled={statusLoading}
//                             onClick={() => updateStatus({ id: emp?._id })}
//                             className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-medium uppercase transition-all duration-150 ${getActionStatusColor(emp?.status)} ${
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
//                           <span className="text-xs text-zinc-500">{emp?.joiningDate ? formatDate(emp.joiningDate) : "-"}</span>
//                         </td>
//                         <td className="px-3 py-2.5 whitespace-nowrap">
//                           <div className="flex items-center justify-center gap-1.5">
//                             <motion.button
//                               whileHover={{ scale: 1.08 }}
//                               whileTap={{ scale: 0.92 }}
//                               onClick={() => handleEdit(emp)}
//                               className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 bg-indigo-500/10 border border-indigo-500/[0.18] text-zinc-900 hover:bg-indigo-500/[0.18]"
//                             >
//                               <Edit className="h-3.5 w-3.5" />
//                             </motion.button>
//                             <motion.button
//                               whileHover={{ scale: 1.08 }}
//                               whileTap={{ scale: 0.92 }}
//                               onClick={() => setConfirmDelete(emp._id)}
//                               className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 bg-danger/[0.08] border border-danger/[0.16] text-rose-600 hover:bg-danger/[0.16]"
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

import { useCallback, useMemo, useState } from "react";
import { Users, Edit, DeleteIcon, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/app/utilities/date";
import {
  useAllEmployeesQuery,
  useDeleteEmployeeMutation,
  useUpdateStatusMutation,
} from "@/app/_Services/employee/page";
import EmployeeModal from "@/app/_Components/Modal/EmployeeModal";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import { getActionStatusColor, getStatusColor } from "@/app/utilities/color";
import toast from "react-hot-toast";
import { getStatusConfig } from "@/app/utilities/attendence";
import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import SearchFilterBar from "@/app/_Components/filters/SearchFilterBar";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import DataTable, {
  EntityCell,
  IconActionButton,
} from "@/app/_Components/ui/saas/DataTable";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: loggedUser } = useGetLoggedUserQuery();
  const userRole = loggedUser?.data?.role?.toUpperCase();
  const userDeptName = loggedUser?.data?.departmentId?.name;
  const canFilterDept = userRole === "ADMIN" || userRole === "SUBADMIN";

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

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  }, []);

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

  const formatBadgeLabel = (value) => {
    if (!value) return "-";
    return value
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const filteredEmployees = useMemo(() => {
    if (!data?.data) return [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return data.data.filter((item) => {
      const deptName = canFilterDept
        ? activeFilter === "all"
          ? null
          : activeFilter
        : userDeptName;
      const matchesDepartment =
        !deptName || item?.departmentId?.name === deptName;
      const matchesName =
        !normalizedSearch ||
        item?.fullName?.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "all" || item?.status === statusFilter;

      return matchesDepartment && matchesName && matchesStatus;
    });
  }, [activeFilter, statusFilter, data, searchTerm, canFilterDept, userDeptName]);

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
  const deptTabItems = canFilterDept
    ? filterData.map((name) => ({ label: name, value: name }))
    : [];

  const columns = useMemo(
    () => [
      {
        key: "sr",
        label: "Sr",
        width: 48,
        render: (_row, index) => (
          <span className="text-xs text-gray-600">{index + 1}</span>
        ),
      },
      {
        key: "employee",
        label: "Employee Info",
        render: (emp) => (
          <EntityCell
            image={emp?.image}
            name={emp?.fullName}
            subtitle={emp?.email || "-"}
          />
        ),
      },
      {
        key: "designation",
        label: "Designation",
        width: 200,
        wrap: true,
        render: (emp) => (
          <span className="block max-w-[200px] whitespace-normal break-words text-xs font-semibold text-zinc-900">
            {emp?.designation || "-"}
          </span>
        ),
      },
      {
        key: "cnic",
        label: "CNIC",
        render: (emp) => (
          <span className="text-xs text-gray-600">{emp?.CNIC || "-"}</span>
        ),
      },
      {
        key: "phone",
        label: "Phone No.",
        render: (emp) => (
          <span className="text-xs text-gray-600">
            {emp?.phoneNo || "-"}
          </span>
        ),
      },
      {
        key: "department",
        label: "Department / Role",
        wrap: true,
        render: (emp) => (
          <div className="flex flex-wrap items-center gap-1">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase ${getStatusColor(
                emp?.departmentId?.name
              )}`}
            >
              {formatBadgeLabel(emp?.departmentId?.name)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium uppercase ${getActionStatusColor(
                emp?.role
              )}`}
            >
              {formatBadgeLabel(emp?.role)}
            </span>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        align: "center",
        render: (emp) => {
          const cfg = getStatusConfig(emp?.status);
          return (
            <span
              onClick={() => handleStatus(emp?._id)}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {statusLoading && statusArgs?.id === emp?._id ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-3 w-3 animate-spin text-current"
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
                </span>
              ) : (
                cfg.label || "-"
              )}
            </span>
          );
        },
      },
      {
        key: "joining",
        label: "Joining",
        render: (emp) => (
          <span className="text-xs text-gray-600">
            {emp?.joiningDate ? formatDate(emp.joiningDate) : "-"}
          </span>
        ),
      },
      {
        key: "action",
        label: "Action",
        render: (emp) => (
          <div className="flex items-center gap-2">
            <IconActionButton
              icon={Eye}
              label="View HRMS Profile"
              href={`/dashboard/employee/${emp._id}`}
              tone="info"
            />
            <IconActionButton
              icon={Edit}
              label="Edit"
              onClick={() => handleEdit(emp)}
              tone="dark"
            />
            <IconActionButton
              icon={DeleteIcon}
              label="Delete"
              onClick={() => setConfirmDelete(emp._id)}
              tone="danger"
            />
          </div>
        ),
      },
    ],
    [handleStatus, statusLoading, statusArgs]
  );

  if (isLoading) {
    return (
      <PageLoader
        title="Loading employees"
        subtitle="Building your team directory..."
      />
    );
  }

  return (
    <div className=" section-stack  -mx-1 rounded-2xl px-1 py-1 sm:px-2 sm:py-2">
        <PageHeader
          icon={Users}
          length={filteredEmployees.length}
          name="All Employees"
          btnName="Add Employee"
          handleEdit={handleEdit}
        />
        <SearchFilterBar
          tabItems={deptTabItems}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search employee by full name..."
        />

        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "de active", label: "de Active" },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatusFilter(s.value)}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition border ${
                statusFilter === s.value
                  ? s.value === "active"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : s.value === "de active"
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "zyro-accent-btn border-transparent"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-200 hover:text-zinc-900"
              }`}
            >
              {s.value !== "all" && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    s.value === "active" ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
              )}
              {s.label}
              {s.value !== "all" && (
                <span className="ml-0.5 opacity-70">
                  ({data?.data?.filter((e) => e?.status === s.value).length ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>
        <motion.div variants={itemVariants}>
          <DataTable
            columns={columns}
            data={filteredEmployees}
            emptyState={{
              icon: Users,
              title: "No employees found",
              description: searchTerm
                ? "No employee matched your search."
                : activeFilter === "all"
                  ? "Add an employee to build your team directory."
                  : `No ${activeFilter} employees yet.`,
            }}
            getRowId={(emp, index) => emp?._id || String(index)}
          />
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
  );
}
