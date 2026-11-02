"use client";

import { FileEdit } from "lucide-react";
import MailboxWorkspace from "@/app/_Components/mailbox/inbox/MailboxWorkspace";

export default function MailboxDraftPage() {
  return (
    <MailboxWorkspace title="Draft" defaultFolder="drafts" Icon={FileEdit} />
  );
}
