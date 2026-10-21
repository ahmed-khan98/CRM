/**
 * Module × role access matrix for the CRM dashboard.
 * Mirrors LeftNav visibility; APIs still enforce checkRole on the backend.
 *
 * HR department employees are treated like HR_ADMIN for HRMS modules
 * (recruitment, leave settings, payroll manage, employees, etc.).
 */
export const ROLE = {
  ADMIN: "ADMIN",
  SUBADMIN: "SUBADMIN",
  USER: "USER",
  DEP_ADMIN: "DEP_ADMIN",
  HR_ADMIN: "HR_ADMIN",
  FINANCE_ADMIN: "FINANCE_ADMIN",
};

/** Dept names that count as HR. */
export function isHrDepartmentName(name) {
  if (!name) return false;
  const n = String(name).toLowerCase().trim();
  return (
    n === "hr" ||
    n === "h.r" ||
    n === "h.r." ||
    n.includes("human resource") ||
    n.includes("human-resource") ||
    /(^|[^a-z])hr([^a-z]|$)/.test(n)
  );
}

export function isHrDepartmentUser(user) {
  if (!user) return false;
  const role = user.role?.toUpperCase?.() || user.role;
  if (role === ROLE.HR_ADMIN || role === ROLE.ADMIN || role === ROLE.SUBADMIN) {
    return true;
  }
  const deptName =
    user.departmentId?.name ||
    user.department?.name ||
    user.departmentName ||
    "";
  return isHrDepartmentName(deptName);
}

/** Effective role for menu/route checks (HR dept → HR_ADMIN). */
export function effectiveRole(userOrRole) {
  if (userOrRole && typeof userOrRole === "object") {
    const role = userOrRole.role?.toUpperCase?.() || userOrRole.role;
    if (role === ROLE.ADMIN || role === ROLE.SUBADMIN) return role;
    if (isHrDepartmentUser(userOrRole)) return ROLE.HR_ADMIN;
    return role;
  }
  return userOrRole?.toUpperCase?.() || userOrRole;
}

export function roleAllows(allowedRoles, userOrRole) {
  const role = effectiveRole(userOrRole);
  if (!role) return false;
  if (role === ROLE.ADMIN || role === ROLE.SUBADMIN) return true;
  return (allowedRoles || []).includes(role);
}

/** Path prefix → allowed roles (ADMIN/SUBADMIN always allowed). */
export const ROUTE_PERMISSIONS = [
  { prefix: "/dashboard/statistics", roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/statictics", roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/department", roles: ["HR_ADMIN"] },
  { prefix: "/dashboard/brand", roles: ["HR_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/announcement", roles: ["HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/employee", roles: ["HR_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/client", roles: ["USER", "DEP_ADMIN"] },
  { prefix: "/dashboard/projects", roles: ["USER", "DEP_ADMIN"] },
  { prefix: "/dashboard/tasks", roles: ["USER", "DEP_ADMIN"] },
  { prefix: "/dashboard/chat", roles: ["USER", "HR_ADMIN", "FINANCE_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/lead", roles: ["USER", "DEP_ADMIN"] },
  { prefix: "/dashboard/sale", roles: ["USER", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/paymentLink", roles: ["USER", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/month", roles: ["FINANCE_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/attendance", roles: ["USER", "HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/leave/settings", roles: ["HR_ADMIN"] },
  { prefix: "/dashboard/leave/team", roles: ["HR_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/leave", roles: ["USER", "HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/payroll/settings", roles: ["HR_ADMIN"] },
  { prefix: "/dashboard/payroll/run", roles: ["HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/payroll", roles: ["USER", "HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/fleet", roles: ["HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"] },
  { prefix: "/dashboard/recruitment/settings", roles: ["HR_ADMIN"] },
  { prefix: "/dashboard/recruitment/reports", roles: ["HR_ADMIN"] },
  { prefix: "/dashboard/recruitment/offers", roles: ["HR_ADMIN"] },
  { prefix: "/dashboard/recruitment/jobs", roles: ["HR_ADMIN"] },
  { prefix: "/dashboard/recruitment/interviews", roles: ["HR_ADMIN", "DEP_ADMIN"] },
  { prefix: "/dashboard/recruitment", roles: ["HR_ADMIN"] },
];

export function canAccessRoute(pathname, userOrRole) {
  const role = effectiveRole(userOrRole);
  if (!role) return false;
  if (role === ROLE.ADMIN || role === ROLE.SUBADMIN) return true;

  const match = ROUTE_PERMISSIONS.find((entry) =>
    pathname.startsWith(entry.prefix),
  );
  if (!match) return true;
  return match.roles.includes(role);
}

export function getAccessibleModules(userOrRole) {
  const role = effectiveRole(userOrRole);
  if (!role) return [];
  if (role === ROLE.ADMIN || role === ROLE.SUBADMIN) {
    return ROUTE_PERMISSIONS.map((r) => r.prefix);
  }
  return ROUTE_PERMISSIONS.filter((r) => r.roles.includes(role)).map(
    (r) => r.prefix,
  );
}
