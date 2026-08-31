"use client";

import { memo } from "react";
import { FileText } from "lucide-react";
import { formatChatTime } from "@/app/_Components/chat/chatUtils";
import { getAttachmentProxyUrl } from "@/app/_utils/attachmentUrl";

const MEDIA_TABS = [
  { id: "media", label: "Media" },
  { id: "docs", label: "Docs" },
  { id: "links", label: "Links" },
];

function SharedMediaSection({ mediaTab, setMediaTab, mediaData }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase text-zinc-500">Shared media</p>
      <div className="mb-2 flex gap-1.5 text-[11px]">
        {MEDIA_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMediaTab(t.id)}
            className={`rounded-full px-2.5 py-1 font-medium ${
              mediaTab === t.id
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mediaTab === "media" && (
        <div className="grid grid-cols-3 gap-1">
          {(mediaData?.data || []).length === 0 && (
            <p className="col-span-3 py-4 text-center text-xs text-zinc-400">
              No photos or videos yet
            </p>
          )}
          {(mediaData?.data || []).map((m) => {
            const att = m.attachments?.[0];
            if (!att?.url) return null;
            if (m.type === "video") {
              return (
                <a
                  key={m._id}
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative aspect-square overflow-hidden rounded bg-zinc-900"
                >
                  <video
                    src={att.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] text-white">
                    Video
                  </span>
                </a>
              );
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <a
                key={m._id}
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="aspect-square overflow-hidden rounded"
              >
                <img src={att.url} alt="" className="h-full w-full object-cover" />
              </a>
            );
          })}
        </div>
      )}

      {mediaTab === "docs" && (
        <div className="space-y-1.5">
          {(mediaData?.data || []).length === 0 && (
            <p className="py-4 text-center text-xs text-zinc-400">No documents yet</p>
          )}
          {(mediaData?.data || []).map((m) => {
            const att = m.attachments?.[0];
            if (!att) return null;
            const name = att.fileName || "Document";
            const sizeKb = att.size ? `${Math.max(1, Math.round(att.size / 1024))} KB` : "";
            return (
              <a
                key={m._id}
                href={getAttachmentProxyUrl(att.url, {
                  disposition: "inline",
                  filename: name,
                  publicId: att.publicId,
                })}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 hover:bg-zinc-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-800">{name}</p>
                  <p className="text-[10px] text-zinc-400">
                    {[sizeKb, formatChatTime(m.createdAt)].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {mediaTab === "links" && (
        <div className="space-y-1.5">
          {(mediaData?.data || []).length === 0 && (
            <p className="py-4 text-center text-xs text-zinc-400">No links yet</p>
          )}
          {(mediaData?.data || []).map((m) => {
            const match = (m.body || "").match(/https?:\/\/[^\s]+/i);
            const url = match?.[0];
            if (!url) return null;
            return (
              <a
                key={m._id}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-zinc-200 bg-white px-2.5 py-2 hover:bg-zinc-50"
              >
                <p className="truncate text-xs font-medium text-sky-700">{url}</p>
                <p className="mt-0.5 text-[10px] text-zinc-400">
                  {m.senderId?.fullName || "Someone"} · {formatChatTime(m.createdAt)}
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(SharedMediaSection);
