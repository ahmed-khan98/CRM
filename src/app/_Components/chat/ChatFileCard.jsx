"use client";

import { memo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import DownloadProgressBtn from "@/app/_Components/chat/DownloadProgressBtn";
import {
  getAttachmentProxyUrl,
  isDownloadOnlyFile,
  fetchAttachmentBlobWithProgress,
  saveBlobAsFile,
} from "@/app/_utils/attachmentUrl";

function ChatFileCard({ attachment, mine = false, dark = false }) {
  const [progress, setProgress] = useState(null);
  const [indeterminate, setIndeterminate] = useState(false);
  const [done, setDone] = useState(false);
  const doneTimer = useRef(null);

  const busy = progress != null || indeterminate;
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

  const markDone = () => {
    setIndeterminate(false);
    setProgress(100);
    setDone(true);
    if (doneTimer.current) clearTimeout(doneTimer.current);
    doneTimer.current = setTimeout(() => {
      setDone(false);
      setProgress(null);
    }, 1800);
  };

  const trackProgress = (p) => {
    if (p == null) {
      setIndeterminate(true);
      setProgress(null);
    } else {
      setIndeterminate(false);
      setProgress(p);
    }
  };

  const openViaProxy = async () => {
    if (busy) return;
    setDone(false);
    setProgress(0);
    try {
      const blob = await fetchAttachmentBlobWithProgress(
        attachment.url,
        {
          disposition: downloadOnly ? "attachment" : "inline",
          filename: name,
          publicId: attachment.publicId,
        },
        trackProgress
      );

      if (blob.type?.includes("text/html") || blob.size < 20) {
        throw new Error("Invalid file from storage");
      }

      if (downloadOnly) {
        saveBlobAsFile(blob, name);
        markDone();
        toast.success("Downloaded");
      } else {
        const href = URL.createObjectURL(blob);
        const win = window.open(href, "_blank", "noopener,noreferrer");
        if (!win) {
          saveBlobAsFile(blob, name);
          toast.success("Downloaded (popup blocked)");
        } else {
          setTimeout(() => URL.revokeObjectURL(href), 120_000);
          toast.success("Opened");
        }
        markDone();
      }
    } catch (err) {
      console.error("[chat] open file failed", err);
      setProgress(null);
      setIndeterminate(false);
      const fallback = getAttachmentProxyUrl(attachment.url, {
        disposition: downloadOnly ? "attachment" : "inline",
        filename: name,
        publicId: attachment.publicId,
      });
      window.open(fallback, "_blank", "noopener,noreferrer");
      toast.error(err?.message || "Could not open file — try Download");
    }
  };

  const download = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (busy) return;
    setDone(false);
    setProgress(0);
    try {
      const blob = await fetchAttachmentBlobWithProgress(
        attachment.url,
        {
          disposition: "attachment",
          filename: name,
          publicId: attachment.publicId,
        },
        trackProgress
      );
      if (blob.type?.includes("text/html") || blob.size < 20) {
        throw new Error("Invalid file");
      }
      saveBlobAsFile(blob, name);
      markDone();
      toast.success("Downloaded");
    } catch (err) {
      console.error(err);
      setProgress(null);
      setIndeterminate(false);
      const fallback = getAttachmentProxyUrl(attachment.url, {
        disposition: "attachment",
        filename: name,
        publicId: attachment.publicId,
      });
      window.location.href = fallback;
      toast.error("Download failed — opening fallback");
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

  const statusLabel = done
    ? "Downloaded"
    : indeterminate
      ? "Downloading…"
      : typeof progress === "number"
        ? `Downloading ${progress}%`
        : null;

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
            {statusLabel
              ? statusLabel
              : `${extLabel}${sizeLabel ? ` · ${sizeLabel}` : ""}`}
          </p>
        </button>
      </ChatTooltip>
      <DownloadProgressBtn
        progress={progress}
        indeterminate={indeterminate}
        done={done}
        onClick={download}
        disabled={busy}
        size={32}
        color={iconBtn}
        className="hover:bg-white/10 rounded-lg"
        iconClassName="h-4 w-4"
      />
    </div>
  );
}

export default memo(ChatFileCard);
