"use client";

import { Inbox } from "lucide-react";
import MailboxWorkspace from "@/app/_Components/mailbox/inbox/MailboxWorkspace";

export default function MailboxInboxPage() {
  return (
    <MailboxWorkspace title="Inbox" defaultFolder="INBOX" Icon={Inbox} />
  );
}
