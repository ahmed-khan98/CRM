"use client";

import { Clock } from "lucide-react";
import MailboxWorkspace from "@/app/_Components/mailbox/inbox/MailboxWorkspace";
import { MAILBOX_SCHEDULED_PATH } from "@/app/_Components/mailbox/inbox/MailboxFolderList";

export default function MailboxScheduledPage() {
  return (
    <MailboxWorkspace
      title="Scheduled"
      defaultFolder={MAILBOX_SCHEDULED_PATH}
      Icon={Clock}
    />
  );
}
