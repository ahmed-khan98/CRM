"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Flag, Users, AlignLeft, Type, Paperclip, FileText } from "lucide-react";
import Select from "react-select";
import TaskRichTextEditor from "./ui/TaskRichTextEditor";
import { TASK_PRIORITIES, TASK_STATUS_OPTIONS, selectStyles } from "./constants";

const PRIORITIES = TASK_PRIORITIES;
const STATUS_OPTIONS = TASK_STATUS_OPTIONS;

export default memo(function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
  employees = [],
  defaultStatus = "todo",
  canMoveToDone = true,
}) {
  const isEdit = Boolean(task?._id);
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    status: defaultStatus, assignees: [], dueDate: "",
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || defaultStatus,
        assignees: task.assignees?.map((a) => a._id || a) || [],
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm({ title: "", description: "", priority: "medium", status: defaultStatus, assignees: [], dueDate: "" });
    }
    setAttachmentFile(null);
  }, [task, defaultStatus, isOpen]);

  const statusOptions = canMoveToDone
    ? STATUS_OPTIONS
    : STATUS_OPTIONS.filter((s) => s.value !== "done");

  const employeeOptions = useMemo(
    () => employees.map((e) => ({ value: e._id, label: e.fullName })),
    [employees]
  );
  const selectedAssignees = useMemo(
    () => employeeOptions.filter((o) => form.assignees.includes(o.value)),
    [employeeOptions, form.assignees]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        ...(isEdit && { id: task._id }),
        attachment: attachmentFile || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-300/40 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {isEdit ? "Edit Task" : "New Task"}
                </p>
                <h2 className="text-base font-black text-zinc-900">
                  {isEdit ? "Update task details" : "Create a new task"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-100 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {/* Title */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <Type className="h-3 w-3" /> Title
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800 outline-none transition focus:border-zinc-800 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <AlignLeft className="h-3 w-3" /> Description
                </label>
                <TaskRichTextEditor
                  value={form.description}
                  onChange={(content) => setForm({ ...form, description: content })}
                  placeholder="Add more context, steps, or notes..."
                  minHeight={160}
                />
              </div>

              {/* Priority + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    <Flag className="h-3 w-3" /> Priority
                  </label>
                  <Select
                    options={PRIORITIES}
                    value={PRIORITIES.find((p) => p.value === form.priority)}
                    onChange={(o) => setForm({ ...form, priority: o.value })}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    Status
                  </label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((s) => s.value === form.status)}
                    onChange={(o) => setForm({ ...form, status: o.value })}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                </div>
              </div>

              {/* Assignees */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <Users className="h-3 w-3" /> Assignees
                </label>
                <Select
                  isMulti
                  options={employeeOptions}
                  value={selectedAssignees}
                  onChange={(opts) => setForm({ ...form, assignees: opts.map((o) => o.value) })}
                  styles={selectStyles}
                  placeholder="Assign team members..."
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <Calendar className="h-3 w-3" /> Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-700 outline-none transition focus:border-zinc-800 focus:bg-white cursor-pointer"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <Paperclip className="h-3 w-3" /> Attachment{" "}
                  <span className="normal-case text-zinc-300">(optional)</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                />
                {attachmentFile ? (
                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span className="truncate text-xs font-semibold text-zinc-700">
                        {attachmentFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAttachmentFile(null); fileRef.current.value = ""; }}
                      className="ml-2 shrink-0 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600 cursor-pointer"
                  >
                    <Paperclip className="h-4 w-4" />
                    Click to attach a file
                  </button>
                )}
                {isEdit && task?.creatorAttachment?.url && !attachmentFile && (
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Current:{" "}
                    <a href={task.creatorAttachment.url} target="_blank" rel="noreferrer" className="text-zinc-600 underline cursor-pointer">
                      {task.creatorAttachment.originalName || "View file"}
                    </a>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-zinc-200 py-2.5 text-sm font-black text-zinc-600 transition hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-zinc-900 py-2.5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
