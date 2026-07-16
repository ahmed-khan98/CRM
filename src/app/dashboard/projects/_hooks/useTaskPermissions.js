import { useCallback, useMemo } from "react";

export function useTaskPermissions(currentUser) {
  const currentUserId = currentUser?._id;
  const currentUserRole = currentUser?.role?.toUpperCase();
  const currentUserDeptId = currentUser?.departmentId?._id || currentUser?.departmentId;

  const isAdminRole = useMemo(
    () => ["ADMIN", "SUBADMIN"].includes(currentUserRole),
    [currentUserRole]
  );
  const isDepAdmin = currentUserRole === "DEP_ADMIN";
  const isManagerRole = useMemo(
    () => ["ADMIN", "SUBADMIN", "DEP_ADMIN", "FINANCE_ADMIN", "HR_ADMIN"].includes(currentUserRole),
    [currentUserRole]
  );
  const canCreateTask = Boolean(currentUserId);

  const isCreator = useCallback(
    (task) =>
      task?.createdBy?._id?.toString() === currentUserId?.toString() ||
      task?.createdBy?.toString() === currentUserId?.toString(),
    [currentUserId]
  );

  const isCreatorInMyDept = useCallback(
    (task) => {
      if (!isDepAdmin || !currentUserDeptId) return false;
      const creatorDept =
        task?.createdBy?.departmentId?._id ||
        task?.createdBy?.departmentId;
      return creatorDept?.toString() === currentUserDeptId?.toString();
    },
    [isDepAdmin, currentUserDeptId]
  );

  const canEditTask = useCallback(
    (task) => isAdminRole || isCreator(task),
    [isAdminRole, isCreator]
  );

  const canMoveToDone = useCallback(
    (task) => isAdminRole || isCreator(task) || isCreatorInMyDept(task),
    [isAdminRole, isCreator, isCreatorInMyDept]
  );

  const canMoveFromDone = useCallback(
    (task) => isAdminRole || isCreator(task) || isCreatorInMyDept(task),
    [isAdminRole, isCreator, isCreatorInMyDept]
  );

  const canDeleteTask = useCallback(
    (task) => isAdminRole || isCreator(task),
    [isAdminRole, isCreator]
  );

  return {
    currentUserId,
    isAdminRole,
    isManagerRole,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    canMoveToDone,
    canMoveFromDone,
  };
}
