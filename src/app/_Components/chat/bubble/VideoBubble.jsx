"use client";

import { memo, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import DownloadProgressBtn from "@/app/_Components/chat/DownloadProgressBtn";
import {
  fetchAttachmentBlobWithProgress,
  saveBlobAsFile,
} from "@/app/_utils/attachmentUrl";

function VideoBubble({ attachment }) {
  const [progress, setProgress] = useState(null);
  const [indeterminate, setIndeterminate] = useState(false);
  const [done, setDone] = useState(false);
  const doneTimer = useRef(null);

  if (!attachment?.url) return null;

  const busy = progress != null || indeterminate;
  const name = attachment.fileName || "video.mp4";

  const download = async () => {
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
        (p) => {
          if (p == null) {
            setIndeterminate(true);
            setProgress(null);
          } else {
            setIndeterminate(false);
            setProgress(p);
          }
        }
      );
      saveBlobAsFile(blob, name);
      setIndeterminate(false);
      setProgress(100);
      setDone(true);
      toast.success("Video downloaded");
      if (doneTimer.current) clearTimeout(doneTimer.current);
      doneTimer.current = setTimeout(() => {
        setDone(false);
        setProgress(null);
      }, 1800);
    } catch {
      setProgress(null);
      setIndeterminate(false);
      toast.error("Video download failed");
    }
  };

  return (
    <div className="relative mb-1 -mx-0.5">
      <video src={attachment.url} controls className="max-h-64 rounded-lg" />
      <div className="absolute bottom-2 right-2">
        <DownloadProgressBtn
          progress={progress}
          indeterminate={indeterminate}
          done={done}
          onClick={download}
          disabled={busy}
          label="Download video"
          size={28}
          color="#fff"
          className="bg-black/70 text-white hover:bg-black/90"
          iconClassName="h-3.5 w-3.5"
        />
      </div>
    </div>
  );
}

export default memo(VideoBubble);
