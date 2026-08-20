"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Flag, Users, AlignLeft, Type, Paperclip, FileText, Upload, X } from "lucide-react";
import Select from "react-select";
import TaskRichTextEditor from "./ui/TaskRichTextEditor";
import { TASK_PRIORITIES, TASK_STATUS_OPTIONS } from "./constants";
import ModalShell from "@/app/_Components/Modal/ModalShell";
import { fleet, modalSelectStyles } from "@/app/_Components/fleet/fleetTheme";
import { extractFilesFromClipboard } from "@/app/_utils/clipboardFiles";

const PRIORITIES = TASK_PRIORITIES;
const STATUS_OPTIONS = TASK_STATUS_OPTIONS;

const labelClass = "mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-zinc-300";

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
    title: "",
    description: "",
    priority: "medium",
    status: defaultStatus,
    assignees: [],
    dueDate: "",
  });
  const [attachmentFiles, setAttachmentFiles] = useState([]);
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
      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: defaultStatus,
        assignees: [],
        dueDate: "",
      });
    }
    setAttachmentFiles([]);
  }, [task, defaultStatus, isOpen]);

  const statusOptions = useMemo(
    () =>
      canMoveToDone
        ? STATUS_OPTIONS
        : STATUS_OPTIONS.filter((s) => s.value !== "done"),
    [canMoveToDone]
  );

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
        attachments: attachmentFiles,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Task" : "Add Task"}
      maxWidthClass="max-w-5xl"
      zClass="z-50"
      bodyClassName="!p-0 !space-y-0"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 p-1 md:grid-cols-[1.15fr_0.85fr] md:p-2"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <label className={labelClass}>
              <Type className="h-3 w-3" /> Title <span className="text-white">*</span>
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className={fleet.modalInput}
            />
          </div>

          <div>
            <label className={labelClass}>
              <AlignLeft className="h-3 w-3" /> Description
            </label>
            <TaskRichTextEditor
              value={form.description}
              onChange={(content) => setForm({ ...form, description: content })}
              placeholder="Add more context, steps, or notes..."
              minHeight={235}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <Flag className="h-3 w-3" /> Priority
              </label>
              <Select
                options={PRIORITIES}
                value={PRIORITIES.find((p) => p.value === form.priority)}
                onChange={(o) => setForm({ ...form, priority: o.value })}
                styles={modalSelectStyles}
                isSearchable={false}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <Select
                options={statusOptions}
                value={statusOptions.find((s) => s.value === form.status)}
                onChange={(o) => setForm({ ...form, status: o.value })}
                styles={modalSelectStyles}
                isSearchable={false}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <Users className="h-3 w-3" /> Assignees
            </label>
            <Select
              isMulti
              options={employeeOptions}
              value={selectedAssignees}
              onChange={(opts) =>
                setForm({ ...form, assignees: (opts || []).map((o) => o.value) })
              }
              styles={modalSelectStyles}
              placeholder="Assign team members..."
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
              menuPosition="fixed"
            />
          </div>

          <div>
            <label className={labelClass}>
              <Calendar className="h-3 w-3" /> Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className={`${fleet.modalInput} cursor-pointer [color-scheme:dark]`}
            />
          </div>

          <div>
            <label className={labelClass}>
              <Paperclip className="h-3 w-3" /> Attachments{" "}
              <span className="normal-case text-zinc-500">(optional, multiple allowed)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".zip,.rar,.psd,.ai,.eps,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const picked = Array.from(e.target.files || []);
                if (picked.length) setAttachmentFiles((prev) => [...prev, ...picked]);
                if (fileRef.current) fileRef.current.value = "";
              }}
            />

            {attachmentFiles.length > 0 && (
              <div className="mb-2 flex flex-col gap-1.5">
                {attachmentFiles.map((f, i) => (
                  <div
                    key={`${f.name}-${f.lastModified}-${i}`}
                    className="flex items-center justify-between rounded-xl border border-white/[0.1] bg-[#161b22] px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span className="truncate text-xs font-semibold text-zinc-200">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setAttachmentFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="ml-2 shrink-0 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
              }}
              onPaste={(e) => {
                const pasted = extractFilesFromClipboard(e);
                if (pasted.length) {
                  e.preventDefault();
                  setAttachmentFiles((prev) => [...prev, ...pasted]);
                }
              }}
              className="flex w-full items-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#161b22] px-3 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-white/25 hover:text-zinc-200 cursor-pointer outline-none focus:border-white/25 focus:text-zinc-200"
            >
              <Upload className="h-4 w-4" />
              {attachmentFiles.length
                ? "Add more, or paste a screenshot (Ctrl+V)"
                : "Attach files, or click here then paste (Ctrl+V)"}
            </div>

            {isEdit && task?.creatorAttachment?.length > 0 && (
              <div className="mt-1.5 flex flex-col gap-0.5">
                <p className="text-[11px] text-zinc-500">Current attachments:</p>
                {task.creatorAttachment.map((a, i) => (
                  <a
                    key={a.publicId || i}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-[11px] text-zinc-300 underline cursor-pointer"
                  >
                    {a.originalName || "View file"}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className={fleet.modalCancelBtn}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={fleet.modalPrimaryBtn}>
            {saving ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
});
