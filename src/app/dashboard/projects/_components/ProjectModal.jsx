"use client";

import { memo, useEffect, useState } from "react";
import { AlignLeft, Type, User, Flag } from "lucide-react";
import Select from "react-select";
import { PROJECT_STATUS_OPTIONS } from "./constants";
import ModalShell from "@/app/_Components/Modal/ModalShell";
import { fleet, modalSelectStyles } from "@/app/_Components/fleet/fleetTheme";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-zinc-300";

export default memo(function ProjectModal({
  isOpen,
  onClose,
  onSave,
  clients = [],
  project = null,
}) {
  const isEdit = Boolean(project?._id);
  const [form, setForm] = useState({
    clientId: "",
    name: "",
    description: "",
    status: "active",
  });
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
    label: c.name || c.email,
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
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Project" : "Add Project"}
      maxWidthClass="max-w-md"
      zClass="z-50"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>
            <User className="h-3 w-3" /> Client{" "}
            <span className="normal-case text-zinc-500">(optional)</span>
          </label>
          <Select
            isClearable
            options={clientOptions}
            value={clientOptions.find((o) => o.value === form.clientId) || null}
            onChange={handleClientChange}
            styles={{
              ...modalSelectStyles,
              option: (base, state) => ({
                ...modalSelectStyles.option(base, state),
                paddingTop: 10,
                paddingBottom: 10,
              }),
            }}
            placeholder="Link to a client..."
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
            formatOptionLabel={(opt) => (
              <div>
                <p className="font-semibold text-white text-sm">{opt.label}</p>
                {opt.sub && (
                  <p className="text-[11px] text-zinc-400">{opt.sub}</p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label className={labelClass}>
            <Type className="h-3 w-3" /> Project Name{" "}
            <span className="text-white">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Website Redesign"
            className={fleet.modalInput}
          />
        </div>

        <div>
          <label className={labelClass}>
            <AlignLeft className="h-3 w-3" /> Description{" "}
            <span className="normal-case text-zinc-500">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is this project about?"
            rows={3}
            className={fleet.modalTextarea}
          />
        </div>

        <div>
          <label className={labelClass}>
            <Flag className="h-3 w-3" /> Status
          </label>
          <Select
            options={PROJECT_STATUS_OPTIONS}
            value={PROJECT_STATUS_OPTIONS.find((s) => s.value === form.status)}
            onChange={(o) => setForm({ ...form, status: o?.value || "active" })}
            styles={modalSelectStyles}
            isSearchable={false}
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
          <button type="button" onClick={onClose} className={fleet.modalCancelBtn}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={fleet.modalPrimaryBtn}>
            {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
});
