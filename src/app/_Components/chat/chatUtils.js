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

export function conversationTitle(conv, myId) {
  if (!conv) return "Chat";
  if (conv.type === "group") return conv.name || "Group";
  const other = (conv.participants || []).find(
    (p) => (p.userId?._id || p.userId)?.toString() !== myId?.toString()
  );
  return other?.userId?.fullName || "Chat";
}

export function conversationAvatar(conv, myId) {
  if (!conv) return "";
  if (conv.type === "group") return conv.image || "";
  const other = (conv.participants || []).find(
    (p) => (p.userId?._id || p.userId)?.toString() !== myId?.toString()
  );
  return other?.userId?.image || "";
}

export function conversationPeer(conv, myId) {
  if (!conv || conv.type !== "direct") return null;
  const other = (conv.participants || []).find(
    (p) => (p.userId?._id || p.userId)?.toString() !== myId?.toString()
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
  if (!msg || msg.senderId?._id?.toString() !== myId?.toString()) return null;
  const receipts = msg.receipts || [];
  if (!receipts.length) return "sent";
  if (receipts.every((r) => r.seenAt)) return "seen";
  if (receipts.every((r) => r.deliveredAt)) return "delivered";
  if (receipts.some((r) => r.deliveredAt)) return "delivered";
  return "sent";
}

export function lastMessagePreview(msg) {
  if (!msg) return "No messages yet";
  if (msg.deletedForEveryone) return "This message was deleted";
  const t = msg.type;
  if (t === "voice" || t === "audio") return "🎤 Voice message";
  if (t === "image") return "📷 Photo";
  if (t === "video") return "🎬 Video";
  if (t === "file" || t === "document") return `📄 ${msg.attachments?.[0]?.fileName || "Document"}`;
  if (t === "call") {
    const status = (msg.callMeta?.status || "").toLowerCase();
    const video = msg.callMeta?.callType === "video";
    if (status === "missed" || status === "no_answer")
      return video ? "Missed video call" : "Missed voice call";
    return video ? "Video call" : "Voice call";
  }
  return msg.body || "Message";
}

export const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "✅"];

/** Mirrors the backend's CLOUDINARY_SIZE_LIMITS (src/utils/cloudinary.js on
 * the CMS_BACKEND repo) — Cloudinary's free-plan caps per resource type.
 * Checked client-side so a doomed upload is rejected instantly instead of
 * uploading the whole file first and failing on the server. Bump these (and
 * the backend copy) together if the Cloudinary plan is ever upgraded. */
const MB = 1024 * 1024;
export function getUploadSizeLimit(file) {
  const type = file?.type || "";
  const ext = (file?.name || "").split(".").pop()?.toLowerCase() || "";
  if (type.startsWith("image/")) return { bytes: 10 * MB, label: "Images" };
  if (
    type.startsWith("video/") ||
    type.startsWith("audio/") ||
    ["webm", "ogg", "mp3", "m4a", "wav", "aac", "opus"].includes(ext)
  ) {
    return { bytes: 100 * MB, label: "Video/audio" };
  }
  return { bytes: 10 * MB, label: "Documents/files" };
}

export function checkUploadSize(file) {
  const { bytes, label } = getUploadSizeLimit(file);
  if (file.size <= bytes) return null;
  const limitMb = Math.round(bytes / MB);
  const fileMb = (file.size / MB).toFixed(1);
  return `${label} can be up to ${limitMb} MB on the current plan. This file is ${fileMb} MB.`;
}

/** WhatsApp-like chat wallpaper (CRM zinc, not WA green) */
export function chatWallpaper(dark) {
  const color = dark ? "%233f3f46" : "%23a1a1aa";
  const bg = dark ? "#0b0b0d" : "#e8e8ea";
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='${color}' stroke-width='1' opacity='0.18'><path d='M0 30h60M30 0v60'/><circle cx='30' cy='30' r='8'/></g></svg>`
  );
  return {
    backgroundColor: bg,
    backgroundImage: `url("data:image/svg+xml,${svg}")`,
    backgroundSize: "60px 60px",
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
