import { useCallback, useMemo } from "react";

export function useTaskPermissions(currentUser) {
  const currentUserId = currentUser?._id;
  const currentUserRole = currentUser?.role?.toUpperCase();
  const isAdminRole = useMemo(
    () => ["ADMIN", "SUBADMIN"].includes(currentUserRole),
    [currentUserRole]
  );

  const canMoveToDone = useCallback(
    (task) => isAdminRole || task?.createdBy?._id?.toString() === currentUserId?.toString(),
    [isAdminRole, currentUserId]
  );

  return { currentUserId, isAdminRole, canMoveToDone };
}
