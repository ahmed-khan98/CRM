import { useCallback, useMemo } from "react";

export function useProjectPermissions(currentUser) {
  const currentUserId = currentUser?._id;
  const currentUserRole = currentUser?.role?.toUpperCase();
  const currentUserDeptId =
    currentUser?.departmentId?._id || currentUser?.departmentId;

  const isAdminRole = useMemo(
    () => ["ADMIN", "SUBADMIN"].includes(currentUserRole),
    [currentUserRole]
  );

  const isDeptRole = useMemo(
    () => currentUserRole === "USER" || currentUserRole === "DEP_ADMIN",
    [currentUserRole]
  );

  const canManageProject = useCallback(
    (project) => {
      if (!project) return false;
      if (isAdminRole) return true;
      if (!isDeptRole || !currentUserDeptId) return false;

      const creatorDept =
        project.createdBy?.departmentId?._id ||
        project.createdBy?.departmentId;

      return (
        Boolean(creatorDept) &&
        creatorDept.toString() === currentUserDeptId.toString()
      );
    },
    [isAdminRole, isDeptRole, currentUserDeptId]
  );

  return {
    currentUserId,
    isAdminRole,
    isDeptRole,
    canManageProject,
  };
}
