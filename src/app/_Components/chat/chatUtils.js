import Cookies from "js-cookie";

export function getCurrentUser() {
  try {
    const raw = Cookies.get("currentuser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getMyId() {
  return getCurrentUser()?._id || getCurrentUser()?.id || null;
}

export function sameId(a, b) {
  if (a == null || b == null) return false;
  return String(a._id ?? a) === String(b._id ?? b);
}

/** Direct chat with only yourself (WhatsApp "Message yourself"). */
export function isSelfChat(conv, myId) {
  if (!conv || conv.type !== "direct" || !myId) return false;
  const parts = conv.participants || [];
  if (!parts.length) return false;
  return parts.every((p) => sameId(p.userId, myId));
}

export function conversationTitle(conv, myId) {
  if (!conv) return "Chat";
  if (conv.type === "group") return conv.name || "Group";
  if (isSelfChat(conv, myId)) return "You";
  const other = (conv.participants || []).find(
    (p) => !sameId(p.userId, myId)
  );
  return other?.userId?.fullName || "Chat";
}

export function conversationAvatar(conv, myId) {
  if (!conv) return "";
  if (conv.type === "group") return conv.image || "";
  if (isSelfChat(conv, myId)) {
    const me = (conv.participants || []).find((p) => sameId(p.userId, myId));
    return me?.userId?.image || getCurrentUser()?.image || "";
  }
  const other = (conv.participants || []).find(
    (p) => !sameId(p.userId, myId)
  );
  return other?.userId?.image || "";
}

export function conversationPeer(conv, myId) {
  if (!conv || conv.type !== "direct") return null;
  if (isSelfChat(conv, myId)) {
    const me = (conv.participants || []).find((p) => sameId(p.userId, myId));
    return me?.userId || getCurrentUser() || null;
  }
  const other = (conv.participants || []).find(
    (p) => !sameId(p.userId, myId)
  );
  return other?.userId || null;
}

export function isConversationGroupAdmin(conv, myId) {
  if (!conv || conv.type !== "group") return false;
  if (conv.myMeta?.role === "admin") return true;
  return (conv.participants || []).some(
    (p) =>
      (p.userId?._id || p.userId)?.toString() === myId?.toString() &&
      p.role === "admin"
  );
}

export function formatChatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}

export function formatMessageClock(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDaySeparator(date) {
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function sameDay(a, b) {
  if (!a || !b) return false;
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function receiptStatus(msg, myId) {
  if (!msg || !sameId(msg.senderId, myId)) return null;
  const receipts = msg.receipts || [];
  if (!receipts.length) return "sent";
  if (receipts.every((r) => r.seenAt)) return "seen";
  if (receipts.every((r) => r.deliveredAt)) return "delivered";
  if (receipts.some((r) => r.deliveredAt)) return "delivered";
  return "sent";
}

/** Sidebar ticks: lastMessage snapshot has no receipts, use peer lastReadAt. */
export function lastMessageTickStatus(conv, myId) {
  const last = conv?.lastMessage;
  if (!last?.createdAt || !sameId(last.senderId, myId)) return null;
  if (
    last.deletedForEveryone ||
    last.type === "system" ||
    /deleted this message/i.test(String(last.body || ""))
  ) {
    return null;
  }
  const sentAt = new Date(last.createdAt).getTime();
  const others = (conv.participants || []).filter((p) => !sameId(p.userId, myId));
  if (!others.length) return "sent";
  const read = (p) => p.lastReadAt && new Date(p.lastReadAt).getTime() >= sentAt;
  const delivered = (p) =>
    p.lastDeliveredAt && new Date(p.lastDeliveredAt).getTime() >= sentAt;
  if (others.every(read)) return "seen";
  if (others.some(delivered) || others.some(read)) return "delivered";
  return "sent";
}

function stripPreviewEmoji(text) {
  return String(text || "")
    .replace(/^(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]|\s)+/u, "")
    .trim();
}

function filePreviewName(msg) {
  const fromAtt =
    msg.attachments?.[0]?.fileName || msg.attachments?.[0]?.originalName;
  if (fromAtt) return stripPreviewEmoji(fromAtt);
  const body = stripPreviewEmoji(msg.body);
  if (body && !/^(document|file)$/i.test(body)) return body;
  return "";
}

export function lastMessagePreviewMeta(msg) {
  if (!msg) return { kind: "text", text: "No messages yet" };
  const deletedLabel = String(msg.body || "");
  if (
    msg.deletedForMe ||
    msg.deletedForEveryone ||
    msg.type === "system" ||
    /deleted this message/i.test(deletedLabel)
  ) {
    return {
      kind: "text",
      text: deletedLabel.trim() || "This message was deleted",
    };
  }
  const t = msg.type;
  const cleanedBody = stripPreviewEmoji(msg.body);
  if (t === "voice" || t === "audio") {
    return { kind: "audio", text: "Voice message" };
  }
  if (t === "image" || /^photo$/i.test(cleanedBody)) {
    return { kind: "image", text: "Photo" };
  }
  if (t === "video") return { kind: "video", text: "Video" };
  if (
    t === "file" ||
    t === "document" ||
    /\.(zip|rar|7z|pdf|docx?|xlsx?|pptx?)$/i.test(cleanedBody)
  ) {
    return { kind: "file", text: filePreviewName(msg) || cleanedBody || "Document" };
  }
  if (t === "call") {
    const status = (msg.callMeta?.status || "").toLowerCase();
    const video = msg.callMeta?.callType === "video";
    if (status === "missed" || status === "no_answer") {
      return {
        kind: "call",
        text: video ? "Missed video call" : "Missed voice call",
      };
    }
    return { kind: "call", text: video ? "Video call" : "Voice call" };
  }
  return { kind: "text", text: msg.body || "Message" };
}

export function lastMessagePreview(msg) {
  return lastMessagePreviewMeta(msg).text;
}

export const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "✅"];

/** Client-side caps — zip/rar go to VPS (50 MB); images stay on Cloudinary (10 MB);
 * video/audio stay on Cloudinary (100 MB). Other docs are allowed to 50 MB here
 * so a zip with a generic mime type is not blocked as a 10 MB document. */
const MB = 1024 * 1024;
const ARCHIVE_EXTS = ["zip", "rar", "7z", "tar", "gz"];

export function getUploadSizeLimit(file) {
  const type = file?.type || "";
  const ext = (file?.name || "").split(".").pop()?.toLowerCase() || "";
  const name = (file?.name || "").toLowerCase();
  const isArchive =
    ARCHIVE_EXTS.includes(ext) ||
    /zip|x-rar|x-7z|x-tar|gzip/i.test(type) ||
    ARCHIVE_EXTS.some((e) => name.endsWith(`.${e}`));

  if (isArchive) return { bytes: 50 * MB, label: "ZIP/archives" };
  if (type.startsWith("image/")) return { bytes: 10 * MB, label: "Images" };
  if (
    type.startsWith("video/") ||
    type.startsWith("audio/") ||
    ["webm", "ogg", "mp3", "m4a", "wav", "aac", "opus"].includes(ext)
  ) {
    return { bytes: 100 * MB, label: "Video/audio" };
  }
  return { bytes: 50 * MB, label: "Documents/files" };
}

export function checkUploadSize(file) {
  const { bytes, label } = getUploadSizeLimit(file);
  if (file.size <= bytes) return null;
  const limitMb = Math.round(bytes / MB);
  const fileMb = (file.size / MB).toFixed(1);
  return `${label} can be up to ${limitMb} MB on the current plan. This file is ${fileMb} MB.`;
}

/** Tight repeating doodle wallpaper — small tile so motifs sit close together. */
export function chatWallpaper(dark) {
  const ink = dark ? "#3f3f46" : "#8a8580";
  const bg = dark ? "#0b0b0d" : "#efeae2";
  const svg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <g fill="none" stroke="${ink}" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" opacity="0.32">
    <path d="M10 12h22a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H22l-7 5v-5h-5a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z"/>
    <path d="M118 14h-20a5 5 0 0 0-5 5v9a5 5 0 0 0 5 5h10l6 5v-5h4a5 5 0 0 0 5-5V19a5 5 0 0 0-5-5z"/>
    <circle cx="52" cy="16" r="1.6" fill="${ink}" stroke="none"/>
    <circle cx="58" cy="20" r="1.2" fill="${ink}" stroke="none"/>
    <circle cx="64" cy="15" r="1.4" fill="${ink}" stroke="none"/>
    <path d="M78 18l10-3 3 10-10 3z"/>
    <path d="M18 58c6-1 9 3 8 8-4 1-9-3-8-8z"/>
    <path d="M86 54a8 8 0 1 1-11 7"/>
    <path d="M42 78h16v12H42z"/>
    <path d="M50 78v-4a5 5 0 0 1 10 0v4"/>
    <path d="M108 72l12-5 2 13-9 2z"/>
    <path d="M14 108c6 0 9 5 9 9s-4 7-9 7-8-2-8-7 2-9 8-9z"/>
    <path d="M10 116h8"/>
    <path d="M124 104a9 7 0 1 1-12 0"/>
    <path d="M118 104v6l3 2 3-2v-6"/>
    <path d="M70 108l7 5 7-5"/>
    <path d="M73 113v8h8v-8"/>
    <circle cx="98" cy="36" r="1.3" fill="${ink}" stroke="none"/>
    <circle cx="34" cy="48" r="1.5" fill="${ink}" stroke="none"/>
    <circle cx="128" cy="56" r="1.2" fill="${ink}" stroke="none"/>
    <circle cx="76" cy="68" r="1.6" fill="${ink}" stroke="none"/>
    <circle cx="58" cy="98" r="1.3" fill="${ink}" stroke="none"/>
    <circle cx="96" cy="92" r="1.2" fill="${ink}" stroke="none"/>
    <path d="M130 38c4 2 4 7 0 8"/>
    <path d="M8 80l5 2-5 2"/>
    <path d="M28 88l6-2"/>
    <path d="M112 88l-5 4"/>
  </g>
</svg>`);
  return {
    backgroundColor: bg,
    backgroundImage: `url("data:image/svg+xml,${svg}")`,
    backgroundRepeat: "repeat",
    backgroundSize: "140px 140px",
  };
}

export function isVoiceMessage(m) {
  if (!m || m.deletedForEveryone || m.type === "system") return false;
  return (
    m.type === "voice" ||
    m.type === "audio" ||
    Boolean(m.attachments?.[0]?.mimeType?.startsWith("audio/"))
  );
}

export function messageKey(m) {
  return String(m?._id || m?.clientId || "");
}

/** Next consecutive voice only — stops if text/image/call/etc sits in between */
export function getNextConsecutiveVoiceId(messages, currentId) {
  if (!messages?.length || !currentId) return null;
  const idx = messages.findIndex((m) => messageKey(m) === String(currentId));
  if (idx < 0) return null;
  const next = messages[idx + 1];
  if (!isVoiceMessage(next) || !next.attachments?.[0]?.url) return null;
  return messageKey(next);
}

export function collectMentions(text, participants) {
  const mentions = [];
  (participants || []).forEach((p) => {
    const u = p.userId;
    const id = u?._id || u;
    const full = u?.fullName;
    if (!id || !full) return;
    const first = full.split(" ")[0];
    if (text.includes(`@${full}`) || text.includes(`@${first}`)) {
      mentions.push(id);
    }
  });
  return mentions;
}

export function filterMentionCandidates(participants, query, myId, limit = 8) {
  const q = (query || "").trim().toLowerCase();
  return (participants || [])
    .map((p) => p.userId)
    .filter(Boolean)
    .filter((u) => String(u._id || u) !== String(myId))
    .filter((u) => {
      if (!q) return true;
      const name = (u.fullName || "").toLowerCase();
      const des = (u.designation || "").toLowerCase();
      return name.includes(q) || des.includes(q);
    })
    .slice(0, limit);
}

export function activityNames(map, participants, myId) {
  return Object.entries(map || {})
    .filter(([uid, v]) => v && uid !== myId)
    .map(([uid]) => {
      const p = participants?.find(
        (x) => (x.userId?._id || x.userId)?.toString() === uid
      );
      return p?.userId?.fullName?.split(" ")[0] || "Someone";
    });
}

export function createPendingFile(file) {
  const kind = file.type?.startsWith("image/")
    ? "image"
    : file.type?.startsWith("video/")
      ? "video"
      : "file";
  return {
    id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    file,
    kind,
    previewUrl: kind === "image" || kind === "video" ? URL.createObjectURL(file) : null,
  };
}

export function revokePendingFiles(files) {
  (files || []).forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
}

export function formatDuration(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** WhatsApp layout + CRM zinc palette (no WA green) */
export function getChatTheme(dark) {
  return dark
    ? {
        shell: "bg-[#111111] text-zinc-100",
        side: "bg-[#111111] border-white/[0.08]",
        main: "bg-[#0b0b0d]",
        bubbleMe: "bg-zinc-700 text-zinc-50",
        bubbleThem: "bg-[#1c1c1f] text-zinc-100",
        input: "bg-[#2a2a2e] text-white border-transparent",
        header: "bg-[#1a1a1d] border-white/[0.06]",
        accent: "bg-zinc-100 text-zinc-950 hover:bg-white",
        accentSoft: "bg-white/10 text-zinc-100",
        chipOn: "bg-zinc-100 text-zinc-950",
        chipOff: "bg-white/5 text-zinc-400",
        unread: "bg-zinc-100 text-zinc-950",
        dayChip: "bg-[#1c1c1f]/95 text-zinc-300 shadow",
        composer: "bg-[#1a1a1d]",
        meta: "text-zinc-400",
      }
    : {
        shell: "bg-[#f0f2f5] text-zinc-900",
        side: "bg-white border-zinc-200",
        main: "bg-[#e8e8ea]",
        bubbleMe: "bg-zinc-800 text-white",
        bubbleThem: "bg-white text-zinc-900 shadow-sm",
        input: "bg-white text-zinc-900 border-transparent",
        header: "bg-[#f0f2f5] border-zinc-200/80",
        accent: "bg-zinc-950 text-white hover:bg-zinc-800",
        accentSoft: "bg-zinc-100 text-zinc-800",
        chipOn: "bg-zinc-950 text-white",
        chipOff: "bg-zinc-100 text-zinc-600",
        unread: "bg-zinc-950 text-white",
        dayChip: "bg-white/90 text-zinc-600 shadow-sm",
        composer: "bg-[#f0f2f5]",
        meta: "text-zinc-500",
      };
}
