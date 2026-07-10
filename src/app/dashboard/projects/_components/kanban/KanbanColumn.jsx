"use client";

import { memo } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import TaskCard from "../task/TaskCard";

function KanbanColumn({ column, tasks, onAddTask, onOpenTask, showProject, onProjectClick }) {
  return (
    <div className={`flex min-w-[280px] w-[280px] shrink-0 flex-col rounded-xl border border-zinc-100 border-t-[3px] bg-zinc-50/80 shadow-sm ${column.accent}`}>
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${column.dot}`} />
          <span className="text-xs font-semibold text-zinc-700">{column.label}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${column.countBg}`}>{tasks.length}</span>
        </div>
        {onAddTask && (
          <button
            type="button"
            onClick={() => onAddTask(column.id)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 min-h-[120px] px-2 pb-2 transition-colors rounded-b-2xl ${snapshot.isDraggingOver ? "bg-zinc-100" : ""}`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} onOpen={onOpenTask} showProject={showProject} onProjectClick={onProjectClick} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-[11px] font-semibold text-zinc-400">Drop tasks here</p>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default memo(KanbanColumn);
