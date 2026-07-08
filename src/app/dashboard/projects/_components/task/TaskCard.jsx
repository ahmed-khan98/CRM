"use client";

import { memo, useCallback } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { PRIORITY_CONFIG } from "../constants";
import TaskCardContent from "./TaskCardContent";

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
            layout
            onClick={handleClick}
            className={`group cursor-pointer rounded-xl border bg-white p-3.5 shadow-sm transition-all select-none
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

export default memo(TaskCard);
