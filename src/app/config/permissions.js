/**
 * Module × role access matrix for the CRM dashboard.
 * Mirrors LeftNav visibility; APIs still enforce checkRole on the backend.
 */
export const ROLE = {
  ADMIN: "ADMIN",
  SUBADMIN: "SUBADMIN",
  USER: "USER",
  DEP_ADMIN: "DEP_ADMIN",
  HR_ADMIN: "HR_ADMIN",
  FINANCE_ADMIN: "FINANCE_ADMIN",
};

/** Path prefix → allowed roles (ADMIN/SUBADMIN always allowed). */
export const ROUTE_PERMISSIONS = [
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
  { prefix: "/dashboard/fleet", roles: ["HR_ADMIN", "DEP_ADMIN", "FINANCE_ADMIN"] },
];

export function canAccessRoute(pathname, userRole) {
  const role = userRole?.toUpperCase?.();
  if (!role) return false;
  if (role === ROLE.ADMIN || role === ROLE.SUBADMIN) return true;

  const match = ROUTE_PERMISSIONS.find((entry) =>
    pathname.startsWith(entry.prefix),
  );
  if (!match) return true;
  return match.roles.includes(role);
}

export function getAccessibleModules(userRole) {
  const role = userRole?.toUpperCase?.();
  if (!role) return [];
  if (role === ROLE.ADMIN || role === ROLE.SUBADMIN) {
    return ROUTE_PERMISSIONS.map((r) => r.prefix);
  }
  return ROUTE_PERMISSIONS.filter((r) => r.roles.includes(role)).map(
    (r) => r.prefix,
  );
}
