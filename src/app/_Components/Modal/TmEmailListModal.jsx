import { useImportTmEmailListMutation } from "@/app/_Services/TmEmailList/page";
import { Info, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const formatKB = (bytes = 0) => (bytes / 1024).toFixed(2) + " KB";

export default function TmEmailListModal({ ...props }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [listName, setListName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [importEmailList] = useImportTmEmailListMutation();
  const percent = useSelector((s) => s.upload.TmImportPercent);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return toast.error("Please choose a file first");
    if (!listName) return toast.error("email list name is required ");

    const payload = new FormData();
    payload.append("listName", listName);
    payload.append("file", selectedFile);

    try {
      setIsImporting(true);
      const res = await importEmailList(payload).unwrap();
      if (res.success) {
        toast.success(res?.message);
        setSelectedFile(null);
        setListName("");
        props.closeModal?.();
        setIsImporting(false);
        props.refetch?.();
      } else {
        toast.error(res?.message || "Failed to process lists");
      }
    } catch (err) {
      setIsImporting(false);
      toast.error(err?.data?.message || "Failed to import file");
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setSelectedFile(null);
      props.closeModal();
    }
  };

  return (
    <ModalShell
      isOpen={props?.isOpen}
      onClose={handleClose}
      title="Import Email List (CSV/XLSX)"
      maxWidthClass="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isImporting}
            className={fleet.modalCancelBtn}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isImporting}
            className={`${fleet.modalPrimaryBtn} inline-flex items-center gap-2`}
          >
            <Upload className="w-4 h-4" />
            {isImporting ? "Importing…" : "Import File"}
          </button>
        </>
      }
    >
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="text-sm">
          <div className="font-semibold">Heads up</div>
          <p className="opacity-90">
            Upload a <b>CSV/XLSX</b> with headers exactly like your sample:
            <i> email</i>.
          </p>
        </div>
      </div>

      <div>
        <label className={fleet.modalLabel}>List Name</label>
        <input
          type="text"
          placeholder="enter email list name"
          className={fleet.modalInput}
          onChange={(e) => setListName(e.target.value)}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-[#161b22] text-sm font-semibold text-zinc-200 hover:bg-white/5 transition-colors disabled:opacity-60"
      >
        {selectedFile ? `Selected: ${selectedFile.name}` : "Choose CSV/XLSX File"}
      </button>

      {selectedFile && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          <div className="text-sm">
            File selected:{" "}
            <span className="font-semibold">{selectedFile.name}</span> (
            {formatKB(selectedFile.size)})
          </div>
        </div>
      )}

      {isImporting && (
        <div>
          <div className="text-sm text-zinc-400 mb-2">
            Importing leads… {percent}%
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-2 bg-zinc-100 transition-all duration-100"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </ModalShell>
  );
}
