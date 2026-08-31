"use client";

import { memo } from "react";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import { fetchAttachmentBlob } from "@/app/_utils/attachmentUrl";

function VideoBubble({ attachment }) {
  if (!attachment?.url) return null;
  return (
    <div className="relative mb-1 -mx-0.5">
      <video src={attachment.url} controls className="max-h-64 rounded-lg" />
      <ChatTooltip label="Download video" side="top">
        <button
          type="button"
          className="absolute bottom-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90"
          onClick={async () => {
            try {
              const blob = await fetchAttachmentBlob(attachment.url, {
                disposition: "attachment",
                filename: attachment.fileName || "video.mp4",
                publicId: attachment.publicId,
              });
              const href = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = href;
              a.download = attachment.fileName || "video.mp4";
              a.click();
              URL.revokeObjectURL(href);
            } catch {
              toast.error("Video download failed");
            }
          }}
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </ChatTooltip>
    </div>
  );
}

export default memo(VideoBubble);
