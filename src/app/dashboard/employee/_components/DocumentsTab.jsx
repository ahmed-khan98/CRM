"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetEmployeeDocumentsQuery,
  useCreateEmployeeDocumentMutation,
  useDeleteEmployeeDocumentMutation,
} from "@/app/_Services/employee/hrms";
import { DOCUMENT_TYPE_OPTIONS } from "@/app/schema/employee";
import {
  SectionCard,
  EmptyState,
  inputClass,
  labelClass,
  btnPrimary,
  btnCancel,
  formatDate,
} from "./hrmsUi";

export default function DocumentsTab({ employeeId }) {
  const { data, isLoading, refetch } = useGetEmployeeDocumentsQuery({
    employeeId,
    limit: 50,
  });
  const [createDoc, { isLoading: uploading }] =
    useCreateEmployeeDocumentMutation();
  const [deleteDoc] = useDeleteEmployeeDocumentMutation();
  const [documentType, setDocumentType] = useState("CV");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);

  const items = data?.data?.items || [];

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select a file");
    try {
      const fd = new FormData();
      fd.append("employeeId", employeeId);
      fd.append("documentType", documentType);
      fd.append("notes", notes);
      fd.append("file", file);
      await createDoc(fd).unwrap();
      toast.success("Document uploaded");
      setFile(null);
      setNotes("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Upload failed");
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteDoc(id).unwrap();
      toast.success("Document deleted");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Upload Document">
        <form onSubmit={onUpload} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className={inputClass}
            >
              {DOCUMENT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Notes</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
              placeholder="Optional notes"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={uploading} className={btnPrimary}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Uploaded Documents">
        {isLoading ? (
          <EmptyState message="Loading..." />
        ) : items.length === 0 ? (
          <EmptyState message="No documents uploaded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">File</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Notes</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((doc) => (
                  <tr key={doc._id} className="text-zinc-900">
                    <td className="py-2.5 pr-3">{doc.documentType}</td>
                    <td className="py-2.5 pr-3">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:underline"
                      >
                        {doc.fileName || "View"}
                      </a>
                    </td>
                    <td className="py-2.5 pr-3">{formatDate(doc.uploadDate)}</td>
                    <td className="py-2.5 pr-3">{doc.notes || "—"}</td>
                    <td className="py-2.5">
                      <button
                        type="button"
                        onClick={() => onDelete(doc._id)}
                        className={btnCancel}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
