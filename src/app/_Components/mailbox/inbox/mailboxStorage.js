const KEY = "mailbox.inbox.lastMailboxId";

export function getLastMailboxId() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function setLastMailboxId(id) {
  if (typeof window === "undefined") return;
  try {
    if (id) localStorage.setItem(KEY, String(id));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
