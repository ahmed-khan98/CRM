"use client";

import { memo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { KANBAN_COLUMNS } from "../constants";
import KanbanColumn from "./KanbanColumn";

function KanbanBoard({ columns, onDragEnd, onAddTask, onOpenTask, showProject = false, onProjectClick }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={columns[col.id] || []}
            onAddTask={onAddTask}
            onOpenTask={onOpenTask}
            showProject={showProject}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

export default memo(KanbanBoard);
