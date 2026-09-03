import { Suspense } from "react";
import ChatApp from "@/app/_Components/chat/ChatApp";

export const metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return (
    <div className="h-full min-h-0 overflow-hidden">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Loading chat...
          </div>
        }
      >
        <ChatApp />
      </Suspense>
    </div>
  );
}
