"use client";

import { memo, useState } from "react";
import toast from "react-hot-toast";
import { Download, FileText } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import {
  getAttachmentProxyUrl,
  isDownloadOnlyFile,
  fetchAttachmentBlob,
} from "@/app/_utils/attachmentUrl";

function ChatFileCard({ attachment, mine = false, dark = false }) {
  const [busy, setBusy] = useState(false);
  const name =
    attachment.fileName ||
    decodeURIComponent(
      String(attachment.url || "")
        .split("?")[0]
        .split("/")
        .pop() || "file"
    );
  const mime = attachment.mimeType || "";
  const downloadOnly = isDownloadOnlyFile(attachment.url, name);
  const isPdf =
    /\.pdf($|\?)/i.test(name) ||
    mime === "application/pdf" ||
    /\/raw\/upload\/.*\.pdf/i.test(attachment.url || "");

  const openViaProxy = async () => {
    setBusy(true);
    try {
      const blob = await fetchAttachmentBlob(attachment.url, {
        disposition: downloadOnly ? "attachment" : "inline",
        filename: name,
        publicId: attachment.publicId,
      });

      if (blob.type?.includes("text/html") || blob.size < 20) {
        throw new Error("Invalid file from storage");
      }

      const href = URL.createObjectURL(blob);
      if (downloadOnly) {
        const a = document.createElement("a");
        a.href = href;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 60_000);
        toast.success("Download started");
      } else {
        const win = window.open(href, "_blank", "noopener,noreferrer");
        if (!win) {
          const a = document.createElement("a");
          a.href = href;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          a.remove();
          toast.success("Download started (popup blocked)");
        }
        setTimeout(() => URL.revokeObjectURL(href), 120_000);
      }
    } catch (err) {
      console.error("[chat] open file failed", err);
      const fallback = getAttachmentProxyUrl(attachment.url, {
        disposition: downloadOnly ? "attachment" : "inline",
        filename: name,
        publicId: attachment.publicId,
      });
      window.open(fallback, "_blank", "noopener,noreferrer");
      toast.error(err?.message || "Could not open file — try Download");
    } finally {
      setBusy(false);
    }
  };

  const download = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setBusy(true);
    try {
      const blob = await fetchAttachmentBlob(attachment.url, {
        disposition: "attachment",
        filename: name,
        publicId: attachment.publicId,
      });
      if (blob.type?.includes("text/html") || blob.size < 20) {
        throw new Error("Invalid file");
      }
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      toast.success("Downloaded");
    } catch (err) {
      console.error(err);
      const fallback = getAttachmentProxyUrl(attachment.url, {
        disposition: "attachment",
        filename: name,
        publicId: attachment.publicId,
      });
      window.location.href = fallback;
    } finally {
      setBusy(false);
    }
  };

  const extLabel = (() => {
    if (isPdf) return "PDF";
    const ext = name.split(".").pop()?.toUpperCase();
    return ext && ext.length <= 5 ? ext : "FILE";
  })();

  const sizeLabel = attachment.size
    ? `${Math.max(1, Math.round(attachment.size / 1024))} KB`
    : "";

  // Light mode: own bubbles are dark (bg-ink). Dark mode: both sides render dark.
  const onDarkBubble = dark || mine;
  const stripBg = onDarkBubble ? "rgba(255,255,255,0.10)" : "rgba(24,24,27,0.06)";
  const titleColor = onDarkBubble ? "#fafafa" : "#18181b";
  const metaColor = onDarkBubble ? "#d4d4d8" : "#52525b";
  const iconBtn = onDarkBubble ? "#f4f4f5" : "#3f3f46";

  return (
    <div
      className="mb-1 flex w-full min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-xl px-2 py-2"
      style={{ background: stripBg, color: titleColor }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: isPdf ? "#fee2e2" : "#e4e4e7" }}
      >
        {isPdf ? (
          <FileText className="h-5 w-5" stroke="#dc2626" />
        ) : (
          <span className="text-[10px] font-bold" style={{ color: "#3f3f46" }}>
            {extLabel}
          </span>
        )}
      </div>
      <ChatTooltip label={name} side="top">
        <button
          type="button"
          className="min-w-0 flex-1 overflow-hidden text-left cursor-pointer disabled:cursor-not-allowed"
          onClick={downloadOnly ? download : openViaProxy}
          disabled={busy}
        >
          <p
            className="truncate text-[13px] font-medium leading-snug"
            style={{ color: titleColor }}
          >
            {name}
          </p>
          <p className="mt-0.5 truncate text-[11px] leading-none" style={{ color: metaColor }}>
            {extLabel}
            {sizeLabel ? ` · ${sizeLabel}` : ""}
          </p>
        </button>
      </ChatTooltip>
      <ChatTooltip label="Download" side="top">
        <button
          type="button"
          onClick={download}
          disabled={busy}
          aria-label="Download file"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-white/10 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          style={{ color: iconBtn }}
        >
          <Download className="h-4 w-4" stroke="currentColor" />
        </button>
      </ChatTooltip>
    </div>
  );
}

export default memo(ChatFileCard);
