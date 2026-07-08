"use client";

import { memo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAttachmentBlob, getDirectOpenUrl, isPdfFile } from "@/app/_utils/attachmentUrl";

function OpenBtn({ url, filename, publicId }) {
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (!url) return;
    if (!isPdfFile(url, filename)) {
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
      toast.error("Failed to open PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      disabled={loading}
      title="Open file"
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-blue-200 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3 w-3" />}
    </button>
  );
}

export default memo(OpenBtn);
