"use client";

import { memo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchAttachmentBlob,
  getDirectOpenUrl,
  isDownloadOnlyFile,
  isPdfFile,
  needsProxyDownload,
} from "@/app/_utils/attachmentUrl";
import Tooltip from "@/app/_Components/ui/Tooltip";

function OpenBtn({ url, filename, publicId }) {
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (!url) return;

    // Office / ZIP / PSD etc. cannot open in browser — download instead
    if (isDownloadOnlyFile(url, filename)) {
      setLoading(true);
      try {
        const blob = await fetchAttachmentBlob(url, {
          disposition: "attachment",
          filename,
          publicId,
        });
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = filename || "attachment";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objUrl);
        toast.success("File downloaded — open it from your Downloads folder");
      } catch {
        toast.error("Failed to download file");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!needsProxyDownload(url, filename) && !isPdfFile(url, filename)) {
      window.open(getDirectOpenUrl(url), "_blank", "noopener,noreferrer");
      return;
    }

    setLoading(true);
    try {
      const blob = await fetchAttachmentBlob(url, { disposition: "inline", filename, publicId });
      const objUrl = URL.createObjectURL(blob);
      window.open(objUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(objUrl), 60_000);
    } catch {
      toast.error("Failed to open file");
    } finally {
      setLoading(false);
    }
  };

  const tip = isDownloadOnlyFile(url, filename) ? "Download file" : "Open file";

  return (
    <Tooltip label={tip} side="top">
      <button
        type="button"
        onClick={handleOpen}
        disabled={loading}
        aria-label={tip}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-blue-200 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3 w-3" />}
      </button>
    </Tooltip>
  );
}

export default memo(OpenBtn);
