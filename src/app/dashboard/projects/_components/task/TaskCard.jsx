"use client";

import { useCallback } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { PRIORITY_CONFIG } from "../constants";
import TaskCardContent from "./TaskCardContent";
import { withRowMemo } from "@/app/_utils/withRowMemo";

// Fields compared by value instead of reference — RTK Query hands back a
// fresh `task` object on every refetch even when nothing this card renders
// actually changed, which would otherwise bust a plain memo() every time.
const TASK_FIELDS = [
  "task._id",
  "task.status",
  "task.order",
  "task.title",
  "task.description",
  "task.priority",
  "task.dueDate",
  "task.projectId._id",
  "task.comments.length",
  "task.assignees.length",
  "task.assignees.0._id",
  "task.assignees.1._id",
  "task.assignees.2._id",
  "task.creatorAttachment.length",
  "task.assigneeAttachment.length",
];

function TaskCard({ task, index, onOpen, showProject = false, onProjectClick }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const handleClick = useCallback(() => onOpen?.(task), [onOpen, task]);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
        >
          <motion.div
            onClick={handleClick}
            className={`group cursor-pointer rounded-xl border bg-white p-3.5 shadow-sm transition-all select-none min-w-0 overflow-hidden
              ${snapshot.isDragging
                ? "rotate-1 shadow-xl border-zinc-300 scale-[1.02]"
                : "border-zinc-100 hover:border-zinc-200 hover:shadow-md"
              }`}
          >
            <TaskCardContent task={task} showProject={showProject} priority={priority} onProjectClick={onProjectClick} />
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}

export default withRowMemo(TaskCard, TASK_FIELDS);
