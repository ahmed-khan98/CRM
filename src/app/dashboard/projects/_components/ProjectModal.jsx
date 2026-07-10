"use client";

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlignLeft, Type, User, Flag } from "lucide-react";
import Select from "react-select";
import { PROJECT_STATUS_OPTIONS, selectStyles } from "./constants";

export default memo(function ProjectModal({ isOpen, onClose, onSave, clients = [], project = null }) {
  const isEdit = Boolean(project?._id);
  const [form, setForm] = useState({ clientId: "", name: "", description: "", status: "active" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setForm({
          clientId: project.clientId?._id || project.clientId || "",
          name: project.name || "",
          description: project.description || "",
          status: project.status || "active",
        });
      } else {
        setForm({ clientId: "", name: "", description: "", status: "active" });
      }
    }
  }, [isOpen, project, isEdit]);

  const clientOptions = clients.map((c) => ({
    value: c._id,
    label:  c.name || c.email ,
    sub: c.companyName,
  }));

  const handleClientChange = (opt) => {
    setForm((f) => ({
      ...f,
      clientId: opt?.value || "",
      name: f.name || opt?.label || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...form, ...(isEdit && { id: project._id }) });
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
            className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-300/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {isEdit ? "Edit Project" : "New Project"}
                </p>
                <h2 className="text-base font-black text-zinc-900">
                  {isEdit ? "Update project details" : "Create a project"}
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
              {/* Client selector — optional */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <User className="h-3 w-3" /> Client{" "}
                  <span className="normal-case text-zinc-300">(optional)</span>
                </label>
                <Select
                  isClearable
                  options={clientOptions}
                  value={clientOptions.find((o) => o.value === form.clientId) || null}
                  onChange={handleClientChange}
                  styles={selectStyles}
                  placeholder="Link to a client..."
                  formatOptionLabel={(opt) => (
                    <div>
                      <p className="font-bold text-zinc-800">{opt.label}</p>
                      {opt.sub && <p className="text-[11px] text-zinc-400">{opt.sub}</p>}
                    </div>
                  )}
                />
              </div>

              {/* Project name */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <Type className="h-3 w-3" /> Project Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Website Redesign"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800 outline-none transition focus:border-zinc-800 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <AlignLeft className="h-3 w-3" /> Description{" "}
                  <span className="normal-case text-zinc-300">(optional)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this project about?"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 outline-none transition focus:border-zinc-800 focus:bg-white"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <Flag className="h-3 w-3" /> Status
                </label>
                <Select
                  options={PROJECT_STATUS_OPTIONS}
                  value={PROJECT_STATUS_OPTIONS.find((s) => s.value === form.status)}
                  onChange={(o) => setForm({ ...form, status: o?.value || "active" })}
                  styles={selectStyles}
                  isSearchable={false}
                />
              </div>

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
                  className="flex-1 rounded-2xl bg-zinc-900 py-2.5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
