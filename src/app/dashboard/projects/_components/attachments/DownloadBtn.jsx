"use client";

import { memo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAttachmentBlob, needsProxyDownload } from "@/app/_utils/attachmentUrl";

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
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      title="Download"
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
    </button>
  );
}

export default memo(DownloadBtn);
