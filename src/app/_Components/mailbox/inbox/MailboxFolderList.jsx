"use client";

import {
  Archive,
  Clock,
  FileEdit,
  Flag,
  Inbox,
  MailWarning,
  Send,
  Trash2,
  Folder,
} from "lucide-react";

/** Virtual folder path — Mongo scheduled queue, not IMAP */
export const MAILBOX_SCHEDULED_PATH = "__scheduled__";

const ROLE_META = {
  inbox: { label: "Inbox", Icon: Inbox },
  sent: { label: "Sent", Icon: Send },
  drafts: { label: "Drafts", Icon: FileEdit },
  junk: { label: "Spam", Icon: MailWarning },
  trash: { label: "Bin", Icon: Trash2 },
  archive: { label: "Archive", Icon: Archive },
  important: { label: "Important", Icon: Flag },
  custom: { label: null, Icon: Folder },
};

function FolderBtn({ active, label, unseen, onClick, Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-colors ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {unseen > 0 && (
        <span className="text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          {unseen}
        </span>
      )}
    </button>
  );
}

export default function MailboxFolderList({
  folders = [],
  roles = {},
  activePath,
  onSelect,
}) {
  const primaryRoles = [
    "inbox",
    "important",
    "sent",
    "drafts",
    "scheduled",
    "junk",
    "trash",
    "archive",
  ];

  const usedPaths = new Set();
  const primary = [];

  for (const role of primaryRoles) {
    if (role === "scheduled") {
      primary.push({
        key: "scheduled",
        path: MAILBOX_SCHEDULED_PATH,
        label: "Scheduled",
        Icon: Clock,
        unseen: 0,
      });
      continue;
    }
    if (role === "important") {
      primary.push({
        key: "important",
        path: "important",
        label: "Important",
        Icon: Flag,
        unseen: 0,
      });
      continue;
    }
    const path = roles[role];
    const folder = folders.find((f) => f.path === path) ||
      folders.find((f) => f.role === role);
    if (!folder) continue;
    usedPaths.add(folder.path);
    const meta = ROLE_META[role] || ROLE_META.custom;
    primary.push({
      key: role,
      path: folder.path,
      label: meta.label || folder.name,
      Icon: meta.Icon,
      unseen: folder.unseen || 0,
    });
  }

  const custom = folders.filter(
    (f) => f.role === "custom" && !usedPaths.has(f.path),
  );

  return (
    <div className="space-y-1 p-2">
      {primary.map((f) => (
        <FolderBtn
          key={f.key}
          active={activePath === f.path}
          label={f.label}
          unseen={f.unseen}
          Icon={f.Icon}
          onClick={() => onSelect(f.path)}
        />
      ))}
      {custom.length > 0 && (
        <>
          <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-zinc-500">
            Folders
          </div>
          {custom.map((f) => (
            <FolderBtn
              key={f.path}
              active={activePath === f.path}
              label={f.name || f.path}
              unseen={f.unseen || 0}
              Icon={Folder}
              onClick={() => onSelect(f.path)}
            />
          ))}
        </>
      )}
    </div>
  );
}
