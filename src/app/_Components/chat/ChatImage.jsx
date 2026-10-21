"use client";

import { memo, useState } from "react";
import toast from "react-hot-toast";
import { Download, ExternalLink } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import {
  fetchAttachmentBlob,
  toHttpsUrl,
} from "@/app/_utils/attachmentUrl";

function ChatImage({ attachment }) {
  const [busy, setBusy] = useState(false);
  const name = attachment.fileName || "image.jpg";
  const src = toHttpsUrl(attachment.url);

  const download = async () => {
    setBusy(true);
    try {
      let blob;
      try {
        blob = await fetchAttachmentBlob(attachment.url, {
          disposition: "attachment",
          filename: name,
          publicId: attachment.publicId,
        });
      } catch {
        const res = await fetch(attachment.url);
        if (!res.ok) throw new Error("fetch failed");
        blob = await res.blob();
      }
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      toast.success("Image downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="group/img relative mb-1 w-fit max-w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="block h-auto max-h-[28rem] w-auto max-w-full rounded-xl object-contain"
      />
      <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-100 sm:opacity-0 sm:transition group-hover/img:opacity-100">
        <ChatTooltip label="Open" side="top">
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            aria-label="Open image"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-black/70 p-1.5 text-white shadow-sm backdrop-blur-sm hover:bg-black/90"
          >
            <ExternalLink className="h-3.5 w-3.5 text-white" stroke="currentColor" />
          </a>
        </ChatTooltip>
        <ChatTooltip label="Download" side="top">
          <button
            type="button"
            onClick={download}
            disabled={busy}
            aria-label="Download image"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-black/70 p-1.5 text-white shadow-sm backdrop-blur-sm hover:bg-black/90 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-white" stroke="currentColor" />
          </button>
        </ChatTooltip>
      </div>
    </div>
  );
}

export default memo(ChatImage);
