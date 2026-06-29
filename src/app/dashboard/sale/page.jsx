"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  useAllSalesQuery,
  useDeleteSaleMutation,
} from "@/app/_Services/sale/page";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import SaleModal from "@/app/_Components/Modal/SaleModal";
import toast from "react-hot-toast";
import PageHeader from "@/app/_Components/PageHeader/page";
import SalesTable from "@/app/_Components/table/SaleTable";
import { useAllMonthsQuery } from "@/app/_Services/month/page";
import { useAllDepartmentsQuery } from "@/app/_Services/department/page";
import {
  useAllEmployeesQuery,
  useGetdepartmentsEmployeeQuery,
} from "@/app/_Services/employee/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";
import SaleFilters from "./_components/SaleFilters";
import SaleSummary from "./_components/SaleSummary";

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const elevatedRoles = ["ADMIN", "SUBADMIN", "FINANCE_ADMIN", "HR_ADMIN"];
const elevatedRolesForEmployee = [
  "ADMIN",
  "SUBADMIN",
  "FINANCE_ADMIN",
  "HR_ADMIN",
  "DEP_ADMIN",
];

const getId = (value) => value?._id || value || "";

const initialFilters = {
  monthId: "",
  departmentId: "",
  employeeId: "",
  status: "",
  type: "",
};

export default function Client() {
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const { data: loggedUser, isLoading: isUserLoading } = useGetLoggedUserQuery();
  const user = loggedUser?.data || loggedUser;
  const userRole = user?.role?.toUpperCase();
  const canFilterDepartment = elevatedRoles.includes(userRole);
  const canFilterEmployee = elevatedRolesForEmployee.includes(userRole);
  const userDepartmentId = getId(user?.departmentId);

  const { data: months, isLoading: isMonthsLoading } = useAllMonthsQuery();
  const { data: departments, isLoading: isDepartmentsLoading } =
    useAllDepartmentsQuery(undefined, { skip: !canFilterDepartment });

  const { data: departmentEmployees, isLoading: isDepartmentEmployeesLoading } =
    useGetdepartmentsEmployeeQuery(filters.departmentId, {
      skip: !filters.departmentId || !canFilterEmployee,
    });
    
  const { data: allEmployees, isLoading: isAllEmployeesLoading } =
    useAllEmployeesQuery(undefined, {
      skip: !!filters.departmentId || !canFilterDepartment,
    });

  const openMonth = useMemo(
    () => months?.data?.find((month) => month?.status === "OPEN"),
    [months],
  );

  useEffect(() => {
    if (!filters.monthId && !isMonthsLoading && months?.data) {
      setFilters((current) => ({
        ...current,
        monthId: openMonth?._id || "all",
      }));
    }
  }, [filters.monthId, isMonthsLoading, months, openMonth]);

  useEffect(() => {
    if (!canFilterDepartment && userDepartmentId) {
      setFilters((current) => ({
        ...current,
        departmentId: userDepartmentId,
      }));
    }
  }, [canFilterDepartment, userDepartmentId]);

  const queryParams = useMemo(() => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params[key] = value;
      }
    });

    return params;
  }, [filters]);

  const isSaleQueryReady =
    !isUserLoading &&
    !isMonthsLoading &&
    Boolean(filters.monthId) &&
    (canFilterDepartment || Boolean(filters.departmentId));

  const { data, isLoading, isFetching, refetch } = useAllSalesQuery(
    queryParams,
    {
      skip: !isSaleQueryReady,
    },
  );
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  const rows = data?.data || [];
  const employeeOptions = filters.departmentId
    ? departmentEmployees?.data || []
    : allEmployees?.data || [];

  const totals = useMemo(() => {
    const paidRows = rows.filter((sale) => sale?.status === "paid");
    const chargeBackRows = rows.filter((sale) => sale?.status === "charge back");

    return {
      totalSales: rows.length,
      paidSales: paidRows.length,
      chargeBacks: chargeBackRows.length,
      revenue: paidRows.reduce((sum, sale) => sum + (Number(sale?.amount) || 0), 0),
      fresh: rows.filter((sale) => sale?.type === "FRESH").length,
      upsell: rows.filter((sale) => sale?.type === "UP SELL").length,
    };
  }, [rows]);

  const handleEdit = (emp) => {
    setEditingAppointment(emp);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "departmentId" ? { employeeId: "" } : {}),
    }));
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteSale(confirmDelete).unwrap();
      setConfirmDelete(null);
      toast.success("Sale deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete sale");
    }
  }, [confirmDelete, deleteSale, refetch]);

  const resetFilters = useCallback(() => {
    setFilters({
      monthId: openMonth?._id || "all",
      departmentId: canFilterDepartment ? "" : userDepartmentId,
      employeeId: "",
      status: "",
      type: "",
    });
  }, [canFilterDepartment, openMonth, userDepartmentId]);

  const isPageLoading =
    isLoading ||
    isUserLoading ||
    isMonthsLoading ||
    isDepartmentsLoading;

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          className="w-9 h-9 border-[3px] border-zinc-200 border-t-zinc-800 rounded-full"
        />
        <span className="text-sm text-zinc-500 font-medium">
          Loading sales…
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-1">
      <div className="mx-auto p-1 flex flex-col space-y-4">
        <PageHeader
          icon={TrendingUp}
          length={rows.length}
          name="Sales"
          btnName="Create Sale"
          handleEdit={handleEdit}
        />

        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <SaleSummary totals={totals} />
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <SaleFilters
            filters={filters}
            months={months?.data || []}
            departments={departments?.data || []}
            employees={employeeOptions}
            openMonth={openMonth}
            canFilterDepartment={canFilterDepartment}
            canFilterEmployee={canFilterEmployee}
            isEmployeeLoading={
              isDepartmentEmployeesLoading || isAllEmployeesLoading
            }
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <SalesTable
            data={rows}
            onEdit={handleEdit}
            onDelete={setConfirmDelete}
            isLoading={isFetching}
          />
        </motion.div>

        {confirmDelete && (
          <WarningModal
            message="sale"
            setConfirmDelete={setConfirmDelete}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}

        {isModalOpen && (
          <SaleModal
            isOpen={isModalOpen}
            data={editingAppointment}
            closeModal={closeModal}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
}