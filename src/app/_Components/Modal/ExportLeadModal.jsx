import { useImportLeadMutation } from "@/app/_Services/lead/page";
import { Info, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import ModalShell from "./ModalShell";
import { fleet } from "../fleet/fleetTheme";

const formatKB = (bytes = 0) => (bytes / 1024).toFixed(2) + " KB";

export default function ExportLeadModal({ ...props }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [importLead, { isLoading }] = useImportLeadMutation();
  const percent = useSelector((s) => s.upload.leadImportPercent);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return toast.error("Please choose a file first");
    const payload = new FormData();
    payload.append("file", selectedFile);

    try {
      setIsImporting(true);
      const res = await importLead(payload).unwrap();
      toast.success("Excel File Uploaded Successfully");
      setSelectedFile(null);
      props.closeModal?.();
      setIsImporting(false);
      props.refetch?.();
    } catch (err) {
      console.log(err, "err");
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

  const footer = (
    <>
      <button
        type="button"
        onClick={handleClose}
        disabled={isImporting}
        className={`${fleet.modalCancelBtn} flex-1 text-center disabled:opacity-50`}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedFile || isImporting}
        className={`${fleet.modalPrimaryBtn} flex-1 flex items-center justify-center gap-2`}
      >
        <Upload className="w-4 h-4" />
        {isImporting ? "Importing…" : "Import File"}
      </button>
    </>
  );

  return (
    <ModalShell
      isOpen={props?.isOpen}
      onClose={handleClose}
      title="Import Leads (CSV/XLSX)"
      maxWidthClass="max-w-xl"
      footer={footer}
    >
      {/* Info alert */}
      <div className="rounded-2xl border border-white/10 bg-[#161b22] px-4 py-3 text-zinc-300 flex items-start gap-3">
        <Info className="w-5 h-5 mt-0.5 shrink-0 text-zinc-400" />
        <div className="text-sm">
          <div className="font-semibold text-white">Heads up</div>
          <p className="opacity-90">
            Upload a <b>CSV/XLSX</b> with headers exactly like your
            sample:
            <i>
              {" "}
              Customer Name, Brand Mark, Serial Number, Phone Number,
              Signup Date, Brand Name, Email, Paid Status, Last Action,
              Agent, Last Comment
            </i>
            .
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Choose file button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="cursor-pointer w-full px-4 py-3 rounded-xl border border-white/10 bg-[#161b22] text-zinc-200 font-semibold hover:bg-[#1c2330] transition-colors disabled:opacity-60"
      >
        {selectedFile
          ? `Selected: ${selectedFile.name}`
          : "Choose CSV/XLSX File"}
      </button>

      {/* Selected file alert */}
      {selectedFile && (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          <div className="text-sm">
            File selected:{" "}
            <span className="font-semibold">{selectedFile.name}</span> (
            {formatKB(selectedFile.size)})
          </div>
        </div>
      )}

      {/* Progress */}
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
