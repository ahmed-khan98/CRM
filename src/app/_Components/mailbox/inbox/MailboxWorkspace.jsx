"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Inbox,
  Pencil,
  RefreshCw,
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  MailWarning,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import EmptyState from "@/app/_Components/ui/saas/EmptyState";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import MailboxSwitcher from "@/app/_Components/mailbox/inbox/MailboxSwitcher";
import MailboxFolderList, {
  MAILBOX_SCHEDULED_PATH,
} from "@/app/_Components/mailbox/inbox/MailboxFolderList";
import MailboxMessageList from "@/app/_Components/mailbox/inbox/MailboxMessageList";
import MailboxMessageReader from "@/app/_Components/mailbox/inbox/MailboxMessageReader";
import MailboxScheduledPanel from "@/app/_Components/mailbox/inbox/MailboxScheduledPanel";
import MailboxComposer from "@/app/_Components/mailbox/MailboxComposer";
import {
  getLastMailboxId,
  setLastMailboxId,
} from "@/app/_Components/mailbox/inbox/mailboxStorage";
import {
  useDeleteMailboxMailMutation,
  useGetMailboxFoldersQuery,
  useGetMailboxMessageQuery,
  useGetMailboxMessagesQuery,
  useGetMyMailboxesQuery,
  useMoveMailboxMailMutation,
  useSpamMailboxMailMutation,
} from "@/app/_Services/mailbox/page";

const POLL_MS = 45000;

/**
 * Shared three-pane mail UI for Inbox / Sent / Draft.
 * @param {{ title: string, defaultFolder?: string, Icon?: any }} props
 */
export default function MailboxWorkspace({
  title = "Inbox",
  defaultFolder = "INBOX",
  Icon = Inbox,
}) {
  const {
    data: myData,
    isLoading: loadingMine,
    isError: mineError,
    error: mineErr,
    refetch: refetchMine,
  } = useGetMyMailboxesQuery();

  const grouped = myData?.data?.grouped || [];
  const mailboxes = myData?.data?.mailboxes || [];

  const [mailboxId, setMailboxId] = useState("");
  const [folder, setFolder] = useState(defaultFolder);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [selectedUid, setSelectedUid] = useState(null);
  const [loadImages, setLoadImages] = useState(false);
  const [mobilePane, setMobilePane] = useState("list");
  const [composer, setComposer] = useState(null); // initial payload or {}

  const [deleteMail] = useDeleteMailboxMailMutation();
  const [moveMail] = useMoveMailboxMailMutation();
  const [spamMail] = useSpamMailboxMailMutation();

  useEffect(() => {
    setFolder(defaultFolder);
    setSelectedUid(null);
    setPage(1);
  }, [defaultFolder]);

  // Debounce folder search — wait until typing pauses (avoid per-keystroke API)
  useEffect(() => {
    const trimmed = search.trim();
    // Empty = clear immediately; skip 1-char; 2+ chars after pause
    if (trimmed.length === 1) return undefined;
    const delayMs = trimmed === "" ? 0 : 700;
    const t = setTimeout(() => {
      setSearchDebounced(trimmed);
      setPage(1);
      setSelectedUid(null);
    }, delayMs);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!mailboxes.length) return;
    const last = getLastMailboxId();
    const valid = mailboxes.some((m) => String(m._id) === String(last));
    setMailboxId(valid ? last : String(mailboxes[0]._id));
  }, [mailboxes]);

  const currentMb = mailboxes.find((m) => String(m._id) === String(mailboxId));
  const canSend = ["read_send", "manage"].includes(currentMb?.permission);
  const canPermanentDelete = currentMb?.permission === "manage";
  const isScheduledFolder = folder === MAILBOX_SCHEDULED_PATH;

  const onMailboxChange = (id) => {
    setMailboxId(id);
    setLastMailboxId(id);
    setFolder(defaultFolder);
    setPage(1);
    setSelectedUid(null);
    setMobilePane("list");
  };

  const {
    data: foldersData,
    isFetching: fetchingFolders,
    error: foldersError,
    refetch: refetchFolders,
  } = useGetMailboxFoldersQuery(mailboxId, { skip: !mailboxId });

  const folders = foldersData?.data?.folders || [];
  const roles = foldersData?.data?.roles || {};
  const crmDirection =
    folder === "sent" || folder === roles.sent ? "outbound" : "inbound";

  const foldersReady = Boolean(foldersData) || Boolean(foldersError);
  const {
    data: messagesData,
    isFetching: fetchingMessages,
    error: messagesError,
    refetch: refetchMessages,
  } = useGetMailboxMessagesQuery(
    {
      mailboxId,
      folder,
      page,
      pageSize: 25,
      search: searchDebounced,
    },
    {
      skip:
        !mailboxId || !folder || !foldersReady || isScheduledFolder,
    },
  );

  const {
    data: messageData,
    isFetching: fetchingMessage,
    error: messageError,
    refetch: refetchMessage,
  } = useGetMailboxMessageQuery(
    {
      mailboxId,
      uid: selectedUid,
      folder,
      loadImages,
    },
    { skip: !mailboxId || !selectedUid || isScheduledFolder },
  );

  useEffect(() => {
    if (!mailboxId) return undefined;
    let timer;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      refetchFolders();
      refetchMessages();
    };
    timer = setInterval(tick, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mailboxId, folder, page, searchDebounced, refetchFolders, refetchMessages]);

  const messages = messagesData?.data?.messages || [];
  const total = messagesData?.data?.total || 0;
  // When no selection (e.g. switched folder), ignore RTK cached message from previous folder
  const message =
    selectedUid && !isScheduledFolder ? messageData?.data || null : null;
  const connError =
    foldersError?.data?.message ||
    (!isScheduledFolder && messagesError?.data?.message) ||
    null;

  const refreshAll = () => {
    refetchMine();
    if (mailboxId) {
      refetchFolders();
      refetchMessages();
      if (selectedUid) refetchMessage();
    }
  };

  const onSelectFolder = (path) => {
    setFolder(path);
    setPage(1);
    setSelectedUid(null);
    setLoadImages(false);
    setMobilePane("list");
  };

  const onSelectMessage = useCallback((m) => {
    setSelectedUid(m.uid);
    setLoadImages(false);
    setMobilePane("reader");
  }, []);

  const clearSelection = () => {
    setSelectedUid(null);
    refetchMessages();
    refetchFolders();
  };

  const openCompose = (initial = {}) => {
    setComposer({
      mailboxId,
      ...initial,
    });
  };

  const quoteBody = (msg) => {
    const from = (msg.from || [])
      .map((a) => a.address || "")
      .filter(Boolean)
      .join(", ");
    return `<br/><br/><blockquote style="border-left:2px solid #52525b;padding-left:12px;color:#a1a1aa">On ${msg.date || ""}, ${from} wrote:<br/>${msg.html || msg.text || ""}</blockquote>`;
  };

  const reply = (all = false) => {
    if (!message) return;
    const to = (message.from || []).map((a) => a.address).filter(Boolean);
    const cc = all
      ? [...(message.to || []), ...(message.cc || [])]
          .map((a) => a.address)
          .filter((a) => a && a !== currentMb?.emailAddress)
      : [];
    openCompose({
      mode: all ? "replyAll" : "reply",
      to,
      cc,
      subject: message.subject?.startsWith("Re:")
        ? message.subject
        : `Re: ${message.subject || ""}`,
      bodyHtml: quoteBody(message),
      inReplyTo: message.messageId,
      references: message.messageId,
    });
  };

  const forward = () => {
    if (!message) return;
    openCompose({
      mode: "forward",
      to: [],
      subject: message.subject?.startsWith("Fwd:")
        ? message.subject
        : `Fwd: ${message.subject || ""}`,
      bodyHtml: quoteBody(message),
    });
  };

  const runAction = async (fn, okMsg) => {
    if (!selectedUid) return;
    if (!canSend) return toast.error("Send permission required for this action");
    try {
      await fn().unwrap();
      toast.success(okMsg);
      clearSelection();
    } catch (err) {
      toast.error(err?.data?.message || "Action failed");
    }
  };

  if (loadingMine) {
    return <PageLoader title={`Loading ${title}`} subtitle="Fetching mailboxes…" />;
  }

  if (mineError) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Icon}
          title={`${title} unavailable`}
          description={mineErr?.data?.message || "Could not load mailboxes."}
        />
      </div>
    );
  }

  if (!mailboxes.length) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Icon}
          title="No mailbox assigned"
          description="Ask your admin to add your company email or assign a brand mailbox."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] min-h-[480px] rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/40">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
        <Icon className="h-4 w-4 text-zinc-300" />
        <span className="text-sm font-medium text-zinc-100 mr-1">{title}</span>
        <MailboxSwitcher
          grouped={grouped}
          value={mailboxId}
          onChange={onMailboxChange}
        />
        {canSend && (
          <button
            type="button"
            onClick={() => openCompose({ mode: "new" })}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-600 bg-zinc-800 text-xs text-zinc-100 hover:bg-zinc-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Compose
          </button>
        )}
        <button
          type="button"
          onClick={refreshAll}
          className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${fetchingFolders || fetchingMessages ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {connError && (
        <div className="px-3 py-2 text-xs text-amber-200 bg-amber-500/10 border-b border-amber-500/20">
          {connError}
        </div>
      )}

      <div className="flex md:hidden border-b border-zinc-800 text-xs">
        {[
          ["folders", "Folders"],
          ["list", "Messages"],
          ["reader", "Read"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`flex-1 py-2 ${
              mobilePane === key
                ? "text-white border-b-2 border-zinc-300"
                : "text-zinc-500"
            }`}
            onClick={() => setMobilePane(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-[148px_minmax(240px,320px)_1fr]">
        <aside
          className={`border-r border-zinc-800 overflow-y-auto custom-scrollbar-dark ${
            mobilePane === "folders" ? "block" : "hidden md:block"
          }`}
        >
          {fetchingFolders && !folders.length ? (
            <div className="p-4 text-xs text-zinc-500">Loading folders…</div>
          ) : (
            <MailboxFolderList
              folders={folders}
              roles={roles}
              activePath={folder}
              onSelect={onSelectFolder}
            />
          )}
        </aside>

        {isScheduledFolder ? (
          <MailboxScheduledPanel mailboxId={mailboxId} canSend={canSend} />
        ) : (
          <>
            <section
              className={`border-r border-zinc-800 min-h-0 ${
                mobilePane === "list" ? "block" : "hidden md:block"
              }`}
            >
              <MailboxMessageList
                messages={messages}
                selectedUid={selectedUid}
                onSelect={onSelectMessage}
                loading={fetchingMessages && !messages.length}
                search={search}
                onSearchChange={setSearch}
                page={page}
                total={total}
                pageSize={25}
                onPageChange={setPage}
                folder={folder}
              />
            </section>

            <section
              className={`min-h-0 flex flex-col ${
                mobilePane === "reader" ? "block" : "hidden md:flex"
              }`}
            >
              {message && canSend && (
                <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-zinc-800 shrink-0">
                  {(folder === "drafts" || folder === roles.drafts) && (
                    <ActionBtn
                      icon={Pencil}
                      label="Edit draft"
                      onClick={() =>
                        openCompose({
                          mode: "new",
                          to: (message.to || [])
                            .map((a) => a.address)
                            .filter(Boolean),
                          cc: (message.cc || [])
                            .map((a) => a.address)
                            .filter(Boolean),
                          subject: message.subject || "",
                          bodyHtml: message.html || "",
                          draftUid: message.uid,
                        })
                      }
                    />
                  )}
                  <ActionBtn
                    icon={Reply}
                    label="Reply"
                    onClick={() => reply(false)}
                  />
                  <ActionBtn
                    icon={ReplyAll}
                    label="Reply all"
                    onClick={() => reply(true)}
                  />
                  <ActionBtn icon={Forward} label="Forward" onClick={forward} />
                  <ActionBtn
                    icon={Trash2}
                    label={
                      folder === (roles.trash || "trash")
                        ? canPermanentDelete
                          ? "Delete forever"
                          : "Delete (manage only)"
                        : "Move to Bin"
                    }
                    onClick={() => {
                      const inTrash = folder === (roles.trash || "trash");
                      if (inTrash && !canPermanentDelete) {
                        return toast.error(
                          "Permanent delete requires manage permission",
                        );
                      }
                      return runAction(
                        () =>
                          deleteMail({
                            mailboxId,
                            folder,
                            uids: [selectedUid],
                            permanent: inTrash && canPermanentDelete,
                          }),
                        inTrash ? "Deleted forever" : "Moved to Bin",
                      );
                    }}
                  />
                  <ActionBtn
                    icon={MailWarning}
                    label="Spam"
                    onClick={() =>
                      runAction(
                        () =>
                          spamMail({
                            mailboxId,
                            folder,
                            uids: [selectedUid],
                          }),
                        "Moved to spam",
                      )
                    }
                  />
                  <ActionBtn
                    icon={Archive}
                    label="Archive"
                    onClick={() =>
                      runAction(
                        () =>
                          moveMail({
                            mailboxId,
                            folder,
                            uids: [selectedUid],
                            targetFolder: "archive",
                          }),
                        "Archived",
                      )
                    }
                  />
                </div>
              )}
              <div className="flex-1 min-h-0">
                <MailboxMessageReader
                  mailboxId={mailboxId}
                  folder={folder}
                  message={message}
                  loading={Boolean(selectedUid) && fetchingMessage}
                  error={messageError?.data?.message || null}
                  crmDirection={crmDirection}
                  loadImages={loadImages}
                  onLoadImages={() => setLoadImages(true)}
                />
              </div>
            </section>
          </>
        )}
      </div>

      {composer && (
        <MailboxComposer
          mailboxes={mailboxes}
          initial={composer}
          onClose={(sent) => {
            setComposer(null);
            if (sent) refreshAll();
            else {
              refetchFolders();
              refetchMessages();
            }
          }}
        />
      )}

    </div>
  );
}

function ActionBtn({ icon: Ico, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
    >
      <Ico className="h-3 w-3" />
      {label}
    </button>
  );
}
