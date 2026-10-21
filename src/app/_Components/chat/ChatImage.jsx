"use client";

import { memo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import DownloadProgressBtn from "@/app/_Components/chat/DownloadProgressBtn";
import {
  fetchAttachmentBlobWithProgress,
  saveBlobAsFile,
  toHttpsUrl,
} from "@/app/_utils/attachmentUrl";

function ChatImage({ attachment }) {
  const [progress, setProgress] = useState(null);
  const [indeterminate, setIndeterminate] = useState(false);
  const [done, setDone] = useState(false);
  const doneTimer = useRef(null);

  const busy = progress != null || indeterminate;
  const name = attachment.fileName || "image.jpg";
  const src = toHttpsUrl(attachment.url);

  const trackProgress = (p) => {
    if (p == null) {
      setIndeterminate(true);
      setProgress(null);
    } else {
      setIndeterminate(false);
      setProgress(p);
    }
  };

  const download = async () => {
    if (busy) return;
    setDone(false);
    setProgress(0);
    try {
      let blob;
      try {
        blob = await fetchAttachmentBlobWithProgress(
          attachment.url,
          {
            disposition: "attachment",
            filename: name,
            publicId: attachment.publicId,
          },
          trackProgress
        );
      } catch {
        const res = await fetch(attachment.url);
        if (!res.ok) throw new Error("fetch failed");
        setIndeterminate(true);
        blob = await res.blob();
      }
      saveBlobAsFile(blob, name);
      setIndeterminate(false);
      setProgress(100);
      setDone(true);
      toast.success("Image downloaded");
      if (doneTimer.current) clearTimeout(doneTimer.current);
      doneTimer.current = setTimeout(() => {
        setDone(false);
        setProgress(null);
      }, 1800);
    } catch (err) {
      console.error(err);
      setProgress(null);
      setIndeterminate(false);
      toast.error("Download failed");
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
        <DownloadProgressBtn
          progress={progress}
          indeterminate={indeterminate}
          done={done}
          onClick={download}
          disabled={busy}
          size={28}
          color="#fff"
          className="border border-white/20 bg-black/70 text-white shadow-sm backdrop-blur-sm hover:bg-black/90"
          iconClassName="h-3.5 w-3.5 text-white"
        />
      </div>
    </div>
  );
}

export default memo(ChatImage);
