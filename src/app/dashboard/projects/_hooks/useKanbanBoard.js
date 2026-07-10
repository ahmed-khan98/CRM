import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { EMPTY_KANBAN_COLUMNS } from "../_components/constants";

const COLUMN_KEYS = ["todo", "in-progress", "in-review", "done"];

/** Stable signature of id+status+order so reference-only RTK updates don't reset local drag state. */
function columnsSignature(cols) {
  if (!cols) return "";
  return COLUMN_KEYS.map((key) =>
    (cols[key] || [])
      .map((t) => `${t._id}:${t.status}:${t.order ?? ""}`)
      .join(",")
  ).join("|");
}

export function useKanbanBoard(serverColumns, { onStatusUpdate, canMoveToDone }) {
  const [localColumns, setLocalColumns] = useState(null);
  const prevSignatureRef = useRef("");

  useEffect(() => {
    const nextSig = columnsSignature(serverColumns);
    if (nextSig !== prevSignatureRef.current) {
      prevSignatureRef.current = nextSig;
      setLocalColumns(null);
    }
  }, [serverColumns]);

  const columns = localColumns || serverColumns || EMPTY_KANBAN_COLUMNS;

  const handleDragEnd = useCallback(
    async (result) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      const allTasks = Object.values(columns).flat();
      const movedTask = allTasks.find((t) => t._id === draggableId);

      if (destination.droppableId === "done" && movedTask && !canMoveToDone(movedTask)) {
        toast.error("Only the creator or their department admin can mark it as Done");
        return;
      }

      const newCols = {
        todo: [...(columns.todo || [])],
        "in-progress": [...(columns["in-progress"] || [])],
        "in-review": [...(columns["in-review"] || [])],
        done: [...(columns.done || [])],
      };
      const [moved] = newCols[source.droppableId].splice(source.index, 1);
      if (!moved) return;

      newCols[destination.droppableId].splice(destination.index, 0, {
        ...moved,
        status: destination.droppableId,
      });
      setLocalColumns(newCols);

      try {
        await onStatusUpdate({
          id: draggableId,
          status: destination.droppableId,
          order: destination.index,
          task: movedTask,
        });
      } catch (err) {
        setLocalColumns(null);
        toast.error(err?.data?.message || "Failed to update task status");
      }
    },
    [columns, onStatusUpdate, canMoveToDone]
  );

  return { columns, handleDragEnd };
}
