"use client";

import { Send } from "lucide-react";
import MailboxWorkspace from "@/app/_Components/mailbox/inbox/MailboxWorkspace";

export default function MailboxSentPage() {
  return (
    <MailboxWorkspace title="Sent" defaultFolder="sent" Icon={Send} />
  );
}
