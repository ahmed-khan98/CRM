"use client";

import { memo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAttachmentBlob, needsProxyDownload } from "@/app/_utils/attachmentUrl";
import Tooltip from "@/app/_Components/ui/Tooltip";

function DownloadBtn({ url, filename, publicId }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const blob = needsProxyDownload(url, filename)
        ? await fetchAttachmentBlob(url, { disposition: "attachment", filename, publicId })
        : await fetch(url.replace(/^http:\/\//i, "https://")).then((r) => {
            if (!r.ok) throw new Error("Download failed");
            return r.blob();
          });

      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = filename || "attachment";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
    } catch {
      toast.error("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip label="Download" side="top">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        aria-label="Download"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.1] bg-[#12171d] text-zinc-400 hover:border-white/20 hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
      </button>
    </Tooltip>
  );
}

export default memo(DownloadBtn);
