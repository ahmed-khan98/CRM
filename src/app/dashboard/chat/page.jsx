import { Suspense } from "react";
import ChatApp from "@/app/_Components/chat/ChatApp";

export const metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense
        fallback={
          <div className="flex h-full min-h-0 flex-1 items-center justify-center text-sm text-zinc-500">
            Loading chat...
          </div>
        }
      >
        <ChatApp />
      </Suspense>
    </div>
  );
}
